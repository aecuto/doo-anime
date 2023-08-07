import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { IWatching } from "@/database/model";
import { Box, Chip, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  reqUpdateEpisode,
  reqUpdateComplete,
  reqUpdateReplay,
} from "../services/watching-api";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";
import styled from "styled-components";

import { AppContext } from "../App";
import { STATUS } from "@/app/constant";
import SyncAnime from "@/app/components/SyncAnime";

const ChipV2 = styled(Chip)`
  && {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export default function ListItem({ data }: { data: IWatching }) {
  const { setId, setOpen, setSync } = React.useContext(AppContext);
  const [episode, setEpisode] = React.useState(data.episode || 0);

  const handleOpen = () => {
    setOpen(true);
    setId(data._id);
  };

  const reqUpdateEpisodeDeb = useDebouncedCallback(() => {
    let updateEpisode = episode;

    if (data.totalEpisodes && updateEpisode > data.totalEpisodes) {
      updateEpisode = data.totalEpisodes;
      onComplete();
    }

    reqUpdateEpisode(data._id, updateEpisode).then(() =>
      toast.success("Episodes updated")
    );
  }, 500);

  const onAdd = () => {
    setEpisode((prev) => prev + 1);
    reqUpdateEpisodeDeb();
  };

  const onRemove = () => {
    setEpisode((prev) => prev - 1);
    reqUpdateEpisodeDeb();
  };

  const onComplete = () => {
    toast.promise(
      reqUpdateComplete(data._id).then(() => {
        setSync(new Date());
      }),
      {
        pending: "update is pending",
        success: "update status to done",
        error: "update is failed",
      }
    );
  };

  const onReplay = () => {
    toast.promise(
      reqUpdateReplay(data._id).then(() => {
        setSync(new Date());
      }),
      {
        pending: "update is pending",
        success: "update status to watching",
        error: "update is failed",
      }
    );
  };

  const onLink = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ width: "250px", height: "250px" }}>
        <CardMedia
          component="img"
          image={
            data.imageUrl ||
            "https://sgame.etsisi.upm.es/pictures/12946.png?1608547866/"
          }
          height={`100%`}
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <CardContent
          sx={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <Typography
            variant="body1"
            sx={{ maxHeight: "70px", overflow: "hidden", marginBottom: "5px" }}
          >
            {data.name}
          </Typography>

          <Box>
            <ChipV2
              label={`episodes: ${data.totalEpisodes || "??"}`}
              variant="outlined"
              color="info"
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              mt: "auto",
              justifyContent: "center",
            }}
          >
            <IconButton color="error" onClick={() => onRemove()}>
              <RemoveIcon />
            </IconButton>
            <Chip
              label={episode <= 0 ? 0 : episode}
              sx={{ width: "100px", fontSize: "18px", height: "auto" }}
            ></Chip>
            <IconButton color="success" onClick={() => onAdd()}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {[STATUS.WAIT, STATUS.DROP].includes(data.status as STATUS) ? (
              <Button size="small" color="warning" onClick={() => onReplay()}>
                Replay
              </Button>
            ) : null}

            <Button size="small" color="info" onClick={() => onLink(data.link)}>
              Link
            </Button>
            <Button size="small" onClick={() => handleOpen()}>
              Edit
            </Button>
            <SyncAnime item={data} />
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}
