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
import { Info, Edit, Delete, Replay } from "@mui/icons-material";
import { AnimeFormDialog } from "@/components/anime/AnimeFormDialog";
import { reqUpdateReplay, reqDelete } from "@/services/anime-api";
import { toast } from "react-toastify";
import { useAppStore } from "@/store";
import { useRefreshAnime } from "@/hooks/use-anime";
import { STATUS } from "@/constants";

export function AnimeCard({ data }: { data: IItemAnime }) {
  const isMal = Boolean(data.mal);
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

      {!isMal && <AnimeFormDialog id={data._id} />}

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
          else if (isMal) setInfoOpen(true);
        }}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: "100%",
          backgroundColor: "background.paper",
          cursor: data.link || isMal ? "pointer" : "default",
          transition: "border-color 0.2s, box-shadow 0.2s",
          "@media (hover: hover)": {
            "&:hover": {
              borderColor:
                data.link || isMal ? "primary.main" : "divider",
              boxShadow: (theme: Theme) =>
                data.link || isMal
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
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                minHeight: { md: 250 },
                borderRight: { md: 1 },
                borderColor: "divider",
                bgcolor: "action.hover",
                color: "text.disabled",
              }}
            >
              <Typography align="center">No Image</Typography>
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
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {data.name}
            </Typography>

            <Box
              sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {data.animeId ? (
                <Chip
                  icon={<Info />}
                  label="Info"
                  size="small"
                  variant="outlined"
                  color="info"
                  onClick={handleClick}
                />
              ) : null}

              {!isMal && (
                <Chip
                  icon={<Edit />}
                  label="Edit"
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={handleOpen}
                />
              )}

              {!isMal && [STATUS.DROPPED].includes(data.status as STATUS) && (
                <Chip
                  icon={<Replay />}
                  label="Replay"
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={onReplay}
                />
              )}

              {!isMal && (
                <Chip
                  icon={<Delete />}
                  label="Delete"
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => setConfirmDelete(true)}
                />
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: "auto",
                pt: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isMal ? (
                <Chip
                  label={
                    <>
                      <Typography display="inline" fontSize="1.125rem">
                        {data.episode || 0}
                      </Typography>
                      <Typography
                        display="inline"
                        fontSize={12}
                        color="warning.light"
                      >
                        {data.totalEpisodes ? `/${data.totalEpisodes}` : ""}
                      </Typography>
                    </>
                  }
                  sx={{ minWidth: 88, px: 1.5 }}
                />
              ) : (
                <EpisodeAction
                  episode={episode}
                  setEpisode={setEpisode}
                  data={data}
                />
              )}
            </Box>
          </CardContent>
        </Box>
      </Card>
    </>
  );
}
