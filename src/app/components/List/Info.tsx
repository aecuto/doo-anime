import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Skeleton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";

import moment from "moment-timezone";
import { reqAnimeById } from "@/app/services/myanimelist-api";
import { IMyAnimeList } from "@/app/types/myanimelist";

interface Props {
  open: boolean;
  animeId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <TableRow>
    <TableCell
      component="th"
      scope="row"
      sx={{ color: "text.secondary", whiteSpace: "nowrap", pr: 3 }}
    >
      {label}
    </TableCell>
    <TableCell>{value || "—"}</TableCell>
  </TableRow>
);

export default function InfoDialog({ open, animeId, setOpen }: Props) {
  const [anime, setAnime] = React.useState<IMyAnimeList | null>();

  React.useEffect(() => {
    if (!animeId || !open) return;

    reqAnimeById(String(animeId))
      .then((res) => setAnime(res.data))
      .catch(() => setAnime(null));
  }, [animeId, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const getTime = () => {
    const date = moment.tz(
      `${anime?.broadcast?.day_of_the_week} ${anime?.broadcast?.start_time}`,
      "dddd HH:mm",
      "Asia/Tokyo", // parse the input as JST
    );

    if (!date.isValid()) return "—";

    return date.clone().tz("Asia/Bangkok").format("dddd HH:mm");
  };

  if (!animeId) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: "auto" } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Info
        <IconButton aria-label="Close" size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {anime === undefined ? (
          <Box sx={{ width: { xs: "100%", sm: 400 }, py: 1 }}>
            <Skeleton sx={{ width: "85%" }} />
            <Skeleton sx={{ width: "55%" }} />
            <Skeleton sx={{ width: "100%" }} />
            <Skeleton sx={{ width: "70%" }} />
          </Box>
        ) : anime === null ? (
          <Typography variant="body2" color="text.secondary">
            Failed to load anime info. Please try again.
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableBody>
                <InfoRow label="Title" value={anime?.title} />
                <InfoRow label="Episodes" value={anime?.num_episodes || "—"} />
                <InfoRow label="Status" value={anime?.status} />
                <InfoRow label="Broadcast" value={getTime()} />
                <InfoRow label="Type" value={anime?.media_type} />
                <InfoRow
                  label="Title English"
                  value={anime?.alternative_titles?.en}
                />
                <InfoRow
                  label="Title Japan"
                  value={anime?.alternative_titles?.ja}
                />
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  );
}
