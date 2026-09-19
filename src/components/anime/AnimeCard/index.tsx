import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IItemAnime } from "@/types/anime";
import {
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { alpha, Theme } from "@mui/material/styles";

import { AnimeInfoDialog } from "./AnimeInfoDialog";
import { EpisodeAction } from "./EpisodeAction";
import {
  Info,
  Edit,
  Delete,
  Replay,
  EventAvailable,
  Link as LinkIcon,
  CloudDone as CloudDoneIcon,
  ImageNotSupported as ImageNotSupportedIcon,
} from "@mui/icons-material";
import { AnimeFormDialog } from "@/components/anime/AnimeFormDialog";
import { reqUpdateReplay, reqDelete } from "@/services/anime-api";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";
import { useRefreshAnime } from "@/hooks/use-anime";
import { STATUS } from "@/constants";

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const actionChipSx = {
  height: 26,
  fontSize: 12,
  "& .MuiChip-icon": { fontSize: 16 },
} as const;

function AnimeCardBase({ data }: { data: IItemAnime }) {
  const synced = Boolean(data.mal);
  const refresh = useRefreshAnime();
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const [episode, setEpisode] = React.useState(data.episode || 0);
  const [openInfo, setInfoOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    setEpisode(data.episode || 0);
  }, [data.episode]);

  const handleClick = () => {
    setInfoOpen(true);
  };

  const completedDate =
    data.status === STATUS.DONE && data.completed
      ? formatDate(data.completed)
      : null;
  const linkHost = data.link
    ? (() => {
        try {
          return new URL(data.link).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      })()
    : null;

  const handleOpen = () => {
    setOpenDialog(data._id);
  };

  const onReplay = () => {
    toast.promise(
      reqUpdateReplay(data._id).then(() => refresh()),
      {
        pending: "Update is pending",
        success: "Update status to watching",
        error: "Update is failed",
      },
    );
  };

  const handleDelete = () => {
    toast.promise(
      reqDelete(data._id).then(() => refresh()),
      {
        pending: "Delete is pending",
        success: "Anime deleted",
        error: "Delete is failed",
      },
    );
  };

  return (
    <>
      <AnimeInfoDialog
        animeId={data.animeId}
        open={openInfo}
        setOpen={setInfoOpen}
      />

      <AnimeFormDialog id={data._id} />

      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: "auto" } } }}
      >
        <DialogTitle>Delete anime</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete “{data.name}”? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmDelete(false);
              handleDelete();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Card
        variant="outlined"
        onClick={() => {
          if (data.link) window.open(data.link, "_blank", "noreferrer");
        }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
          backgroundColor: "background.paper",
          cursor: data.link ? "pointer" : "default",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "@media (hover: hover)": {
            "&:hover": {
              borderColor: data.link ? "primary.main" : "divider",
              boxShadow: (theme: Theme) =>
                data.link
                  ? `0 0 8px ${alpha(theme.palette.primary.main, 0.4)}`
                  : "none",
            },
          },
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "250px" },
            height: { xs: 220, md: "auto" },
            minHeight: { xs: 220, md: 250 },
            flexShrink: 0,
          }}
        >
          {data.imageUrl ? (
            <CardMedia
              component="img"
              image={data.imageUrl}
              alt={data.name}
              height="100%"
              loading="lazy"
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 1,
                height: "100%",
                minHeight: { md: 250 },
                background: (theme: Theme) =>
                  `linear-gradient(160deg, ${alpha(
                    theme.palette.primary.main,
                    0.08,
                  )} 0%, ${alpha(theme.palette.text.primary, 0.04)} 100%)`,
                color: "text.disabled",
              }}
            >
              <ImageNotSupportedIcon sx={{ fontSize: 44 }} />
              <Typography
                variant="body2"
                align="center"
                sx={{ fontWeight: 500, px: 2 }}
              >
                No Image
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: 0,
          }}
        >
          <CardContent
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography
              variant="h6"
              sx={{
                marginBottom: 1,
                fontWeight: 600,
                lineHeight: 1.3,
                overflowWrap: "anywhere",
              }}
            >
              {data.name}
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 0.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {synced && (
                <Chip
                  icon={<CloudDoneIcon />}
                  label="On MAL"
                  size="small"
                  sx={{
                    height: 26,
                    fontSize: 12,
                    bgcolor: "#2e51a2",
                    color: "#fff",
                    "& .MuiChip-icon": { color: "#fff", fontSize: 16 },
                  }}
                />
              )}

              {completedDate && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary",
                  }}
                >
                  <EventAvailable sx={{ fontSize: 16 }} />
                  Finished {completedDate}
                </Typography>
              )}

              {linkHost && (
                <Typography
                  variant="caption"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    color: "text.secondary",
                    minWidth: 0,
                  }}
                >
                  <LinkIcon sx={{ fontSize: 16 }} />
                  <Box
                    component="span"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {linkHost}
                  </Box>
                </Typography>
              )}
            </Box>

            <Box
              sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", mt: "auto", pt: 1.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {data.animeId ? (
                <Chip
                  icon={<Info />}
                  label="Info"
                  size="small"
                  variant="outlined"
                  color="info"
                  sx={actionChipSx}
                  onClick={handleClick}
                />
              ) : null}

              <Chip
                icon={<Edit />}
                label="Edit"
                size="small"
                variant="outlined"
                color="primary"
                sx={actionChipSx}
                onClick={handleOpen}
              />

              {[STATUS.DROPPED].includes(data.status as STATUS) && (
                <Chip
                  icon={<Replay />}
                  label="Replay"
                  size="small"
                  variant="outlined"
                  color="success"
                  sx={actionChipSx}
                  onClick={onReplay}
                />
              )}

              <Chip
                icon={<Delete />}
                label="Delete"
                size="small"
                variant="outlined"
                color="error"
                sx={actionChipSx}
                onClick={() => setConfirmDelete(true)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                pt: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <EpisodeAction
                episode={episode}
                setEpisode={setEpisode}
                data={data}
              />
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}

export const AnimeCard = React.memo(AnimeCardBase);
