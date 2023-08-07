import * as React from "react";
import Dialog from "@mui/material/Dialog";

import {
  IAnimeDetails,
  getAnimeById,
  getAnimeSearch,
} from "@/app/services/jikan";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Collapse, IconButton, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { IWatching } from "@/database/model";
import { TYPE } from "@/app/constant";
import { reqUpdate } from "@/app/services/watching-api";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { AppContext } from "../App";

export default function SyncAnime({ item }: { item: IWatching }) {
  const { setSync } = React.useContext(AppContext);
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState<IAnimeDetails[]>([]);

  const handleClickOpen = () => {
    const notFoundMessage = "anime not found";
    if (item.animeId) {
      getAnimeById(item.animeId).then((res) => {
        if (!res.data.data) {
          toast.info(notFoundMessage);
          return;
        }
        const data = res.data.data;
        setOpen(true);
        setData([data]);
      });
    } else {
      getAnimeSearch(item.name).then((res) => {
        if (!res.data.data.length) {
          toast.info(notFoundMessage);
          return;
        }

        setOpen(true);
        setData(res.data.data);
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const syncAnime = (data: IAnimeDetails) => {
    const payload = {
      name: data.title,
      animeId: data.mal_id,
      imageUrl: data.images.webp.image_url,
      totalEpisodes: data.episodes || undefined,
    };
    reqUpdate(item._id, payload)
      .then(() => {
        toast.success("sync success!");
        handleClose();
        setSync(new Date());
      })
      .catch((error) => toast.error(error.response.data.message));
  };

  if (item.type !== TYPE.ANIME) return null;

  return (
    <>
      <IconButton onClick={() => handleClickOpen()} size="small">
        <SyncAltIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>status</TableCell>
                <TableCell>Episodes</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.title}>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.episodes || "??"}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => syncAnime(row)}>sync</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {item.animeId ? (
            <Table
              size="small"
              sx={{ backgroundColor: "rgba(255, 255, 255, 0.08);" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data[0]?.titles.map((value) => (
                  <TableRow key={value.type}>
                    <TableCell>{value.type}</TableCell>
                    <TableCell colSpan={3}>{value.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : null}
        </TableContainer>
      </Dialog>
    </>
  );
}
