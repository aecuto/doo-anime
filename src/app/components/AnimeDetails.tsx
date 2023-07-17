import * as React from "react";
import Dialog from "@mui/material/Dialog";

import { IAnimeDetails, getAnimeDetails } from "@/app/services/jikan";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Chip } from "@mui/material";
import { toast } from "react-toastify";
import { IWatching } from "@/database/model";
import { TYPE } from "@/app/constant";

export default function AnimeDetails({ item }: { item: IWatching }) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<IAnimeDetails[]>([]);

  const handleClickOpen = () => {
    getAnimeDetails(item.name).then((res) => {
      if (!res.data.data.length) {
        toast.info("info not found");
        return;
      }

      setOpen(true);
      setData(res.data.data);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (item.type !== TYPE.ANIME) return null;

  return (
    <>
      <Chip
        variant="outlined"
        onClick={handleClickOpen}
        label="info"
        sx={{ mr: "10px" }}
      />
      <Dialog open={open} onClose={handleClose}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Episodes</TableCell>
                <TableCell>Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.title}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.episodes || "??"}
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </>
  );
}
