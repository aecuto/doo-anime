import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Skeleton, Typography } from "@mui/material";

import moment from "moment-timezone";
import { reqAnimeById } from "@/app/services/myanimelist-api";
import { IMyAnimeList } from "@/app/types/myanimelist";

interface Props {
  open: boolean;
  animeId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InfoDialog({ open, animeId, setOpen }: Props) {
  const [anime, setAnime] = React.useState<IMyAnimeList>();

  React.useEffect(() => {
    if (!animeId || !open) return;

    reqAnimeById(String(animeId)).then((res) => setAnime(res.data));
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

    if (!date.isValid()) return "-";

    return date.clone().tz("Asia/Bangkok").format("dddd HH:mm");
  };

  if (!animeId) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: "auto" } } }}
    >
      <DialogTitle>Info</DialogTitle>
      <DialogContent>
        <TableContainer>
          {anime ? (
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>{anime?.title || `??`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Episodes</TableCell>
                  <TableCell>{anime?.num_episodes || `??`}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>{anime?.status}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Broadcast</TableCell>
                  <TableCell>{getTime()}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>{anime?.media_type}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Title English</TableCell>
                  <TableCell>
                    <Typography>{anime?.alternative_titles?.en}</Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Title Japan</TableCell>
                  <TableCell>
                    <Typography>{anime?.alternative_titles?.ja}</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <>
              <Skeleton
                animation="wave"
                sx={{ width: { xs: "85%", sm: 300 } }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: { xs: "55%", sm: 200 } }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: { xs: "100%", sm: 400 } }}
              />
              <Skeleton
                animation="wave"
                sx={{ width: { xs: "70%", sm: 250 } }}
              />
            </>
          )}
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
