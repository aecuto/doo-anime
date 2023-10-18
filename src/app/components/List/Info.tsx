import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IAnimeDetails, getAnimeById } from "@/app/services/jikan";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { Typography } from "@mui/material";

import moment from "moment-timezone";

interface Props {
  open: boolean;
  animeId: number;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function InfoDialog({ open, animeId, setOpen }: Props) {
  const [anime, setAnime] = React.useState<IAnimeDetails>();

  React.useEffect(() => {
    if (!animeId || !open) return;

    getAnimeById(animeId).then((res) => setAnime(res.data.data));
  }, [animeId, open]);

  const handleClose = () => {
    setOpen(false);
  };

  const getTime = () => {
    const date = moment.tz(
      `${anime?.broadcast.day} ${anime?.broadcast.time}`,
      "dddd HH:mm",
      anime?.broadcast.timezone || ""
    );

    if (!date.isValid) return "-";

    return moment(date.format()).tz("Asia/Bangkok").format("dddd HH:mm");
  };

  if (!animeId) return null;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Info</DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableBody>
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
                <TableCell>{anime?.type}</TableCell>
              </TableRow>

              {anime?.titles.map((data) => (
                <TableRow key={data.type}>
                  <TableCell>Names ({data.type})</TableCell>
                  <TableCell>
                    <Typography>{data.title}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
}
