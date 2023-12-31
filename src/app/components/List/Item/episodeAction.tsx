import * as React from "react";

import { IAnime } from "@/database/model";
import { Chip, IconButton } from "@mui/material";

import { reqUpdateEpisode, reqUpdateComplete } from "@/app/services/anime-api";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

import { AppContext } from "@/app/App";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  episode: number;
  setEpisode: React.Dispatch<React.SetStateAction<number>>;
  data: IAnime;
}

const EpisodeAction = ({ episode, setEpisode, data }: Props) => {
  const { setSync } = React.useContext(AppContext);

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

  const onComplete = () => {
    toast.promise(
      reqUpdateComplete(data._id).then(() => {
        setSync(new Date());
      }),
      {
        pending: "Update is pending",
        success: "Update status to done",
        error: "Update is failed",
      }
    );
  };

  const onAdd = () => {
    setEpisode((prev) => prev + 1);
    reqUpdateEpisodeDeb();
  };

  const onRemove = () => {
    setEpisode((prev) => prev - 1);
    reqUpdateEpisodeDeb();
  };

  return (
    <>
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
    </>
  );
};

export default EpisodeAction;
