import * as React from "react";

import { IAnime } from "@/database/model";
import { Chip, IconButton, Typography } from "@mui/material";

import { reqUpdateEpisode, reqUpdateComplete, reqSyncEpisodeToMal } from "@/services/anime-api";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

import { useRefreshAnime } from "@/hooks/use-anime";
import { STATUS } from "@/constants";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  episode: number;
  setEpisode: React.Dispatch<React.SetStateAction<number>>;
  data: IAnime;
}

export const EpisodeAction = ({ episode, setEpisode, data }: Props) => {
  const refresh = useRefreshAnime();

  const episodeRef = React.useRef(episode);
  React.useEffect(() => {
    episodeRef.current = episode;
  }, [episode]);

  const onComplete = () => {
    toast.promise(
      reqUpdateComplete(data._id).then(() => refresh()),
      {
        pending: "Update is pending",
        success: "Update status to done",
        error: "Update is failed",
      },
    );
  };

  // Best-effort push of the episode change to MyAnimeList. Ignored entirely
  // when there is no linked MAL id or no MAL session (401); other failures
  // surface a quiet toast and can be fixed with "Sync to MAL" later.
  const syncMalEpisode = (episode: number, status?: string) => {
    if (!data.animeId) return;

    reqSyncEpisodeToMal(data.animeId, episode, status)
      .then(() => refresh())
      .catch((error: { response?: { status?: number } }) => {
        if (error?.response?.status !== 401) {
          toast.error("MyAnimeList sync failed");
        }
      });
  };

  const reqUpdateEpisodeDeb = useDebouncedCallback(() => {
    let newEpisode = episodeRef.current;
    let completed = false;

    if (data.totalEpisodes && newEpisode > data.totalEpisodes) {
      newEpisode = data.totalEpisodes;
      completed = true;
    }

    reqUpdateEpisode(data._id, newEpisode).then(() =>
      toast.success("Episodes updated"),
    );

    if (completed) {
      onComplete();
      syncMalEpisode(newEpisode, STATUS.DONE);
    } else {
      syncMalEpisode(newEpisode);
    }
  }, 500);

  const onAdd = () => {
    setEpisode((prev) => prev + 1);
    reqUpdateEpisodeDeb();
  };

  const onRemove = () => {
    setEpisode((prev) => Math.max(0, prev - 1));
    reqUpdateEpisodeDeb();
  };

  return (
    <>
      <IconButton
        color="default"
        aria-label="Decrease episode"
        onClick={() => onRemove()}
        sx={{ border: 1, borderColor: "divider", margin: 0.5 }}
      >
        <RemoveIcon />
      </IconButton>
      <Chip
        label={
          <>
            <Typography display="inline" fontSize="1.125rem">
              {episode <= 0 ? 0 : episode + (data.episodeOffset || 0)}
            </Typography>
            <Typography display="inline" fontSize={12} color="warning.light">
              {data.totalEpisodes
                ? `/${data.totalEpisodes + (data.episodeOffset || 0)}`
                : ""}
            </Typography>
          </>
        }
        sx={{ minWidth: 88, px: 1.5, margin: 0.5 }}
      />
      <IconButton
        color="default"
        aria-label="Increase episode"
        onClick={() => onAdd()}
        sx={{ border: 1, borderColor: "divider", margin: 0.5 }}
      >
        <AddIcon />
      </IconButton>
    </>
  );
};
