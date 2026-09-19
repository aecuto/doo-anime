import * as React from "react";

import { IAnime } from "@/database/model";
import { Box, IconButton, Typography } from "@mui/material";

import { reqUpdateEpisode, reqUpdateComplete, reqSyncEpisodeToMal } from "@/services/anime-api";
import { useDebouncedCallback } from "use-debounce";
import { toast } from "react-toastify";

import { useRefreshAnime } from "@/hooks/use-anime";
import { STATUS } from "@/constants";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";

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

  const offset = data.episodeOffset || 0;
  const total = data.totalEpisodes ? data.totalEpisodes + offset : null;
  const display = episode <= 0 ? 0 : episode + offset;
  const completed = Boolean(data.totalEpisodes && episode >= data.totalEpisodes);

  return (
    <Box sx={{ width: "100%", maxWidth: 220 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <IconButton
          aria-label="Decrease episode"
          color="error"
          onClick={onRemove}
          disabled={episode <= 0}
          sx={{ borderRadius: 0, flexShrink: 0 }}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        <Box
          sx={{
            flex: 1,
            display: "inline-flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 0.25,
            py: 0.75,
            px: 1,
            borderLeft: 1,
            borderRight: 1,
            borderColor: "divider",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {completed && <CheckIcon fontSize="small" sx={{ fontSize: 16 }} />}
          <Typography
            display="inline"
            fontSize="1.125rem"
            fontWeight={600}
            sx={{ lineHeight: 1.2 }}
          >
            {display}
          </Typography>
          <Typography display="inline" fontSize={12} color="text.secondary">
            {total ? `/${total}` : ""}
          </Typography>
        </Box>
        <IconButton
          aria-label="Increase episode"
          color="success"
          onClick={onAdd}
          disabled={completed}
          sx={{ borderRadius: 0, flexShrink: 0 }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
