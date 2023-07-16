import {
  Button,
  ButtonGroup,
  Chip,
  Grid,
  IconButton,
  Link,
} from "@mui/material";
import Box from "@mui/material/Box";

import { useContext, useState } from "react";
import { AppContext } from "../App";
import {
  reqUpdateEpisode,
  reqUpdateComplete,
  reqUpdateReplay,
} from "../services/watching-api";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import styled from "styled-components";
import { TaskAltOutlined } from "@mui/icons-material";
import ReplayIcon from "@mui/icons-material/Replay";

import { IWatching } from "@/database/model";
import { STATUS } from "../constant";
import { toast } from "react-toastify";
import { useDebouncedCallback } from "use-debounce";

const ChipV2 = styled(Chip)`
  && {
    margin-right: 10px;
  }
`;

export const ListItem = ({ data }: { data: IWatching }) => {
  const { setId, setOpen, setSync } = useContext(AppContext);
  const [episode, setEpisode] = useState(data.episode || 0);

  const handleOpen = () => {
    setOpen(true);
    setId(data._id);
  };

  const reqUpdateEpisodeDeb = useDebouncedCallback(() => {
    reqUpdateEpisode(data._id, episode).then(() =>
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

  const shortCutAction = () => {
    return (
      <>
        {data.status === STATUS.WATCHING ? (
          <IconButton color="success" onClick={() => onComplete()} size="large">
            <TaskAltOutlined />
          </IconButton>
        ) : (
          <IconButton color="warning" onClick={() => onReplay()} size="large">
            <ReplayIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container>
        <Grid item xs={12} sm={9}>
          <Box sx={{ mb: 2 }}>
            <Link
              underline="hover"
              variant="h5"
              textAlign={"left"}
              href={data.link}
              target="_blank"
              referrerPolicy="no-referrer"
            >
              {data.name}
            </Link>
          </Box>
          <Box>
            <ChipV2
              label={`Edit`}
              variant="outlined"
              onClick={() => handleOpen()}
              color="info"
            />
            <ChipV2
              label={`status: ${data.status}`}
              variant="outlined"
              color="warning"
            />
            <ChipV2
              label={`type: ${data.type}`}
              variant="outlined"
              color="success"
            />
          </Box>
        </Grid>
        <Grid item xs sx={{ m: "auto" }}>
          <Grid container textAlign={"center"}>
            <Grid item xs={12} sm={2}>
              {data.status !== STATUS.DONE ? shortCutAction() : null}
            </Grid>

            <Grid item xs={12} sm={10}>
              <IconButton color="error" onClick={() => onRemove()} size="large">
                <RemoveIcon />
              </IconButton>
              <Chip
                label={episode <= 0 ? 0 : episode}
                sx={{ width: "100px", fontSize: "32px", height: "auto" }}
              ></Chip>
              <IconButton color="success" onClick={() => onAdd()} size="large">
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
