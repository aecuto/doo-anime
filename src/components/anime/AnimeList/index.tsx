import { Grid, Chip, Skeleton, Typography } from "@mui/material";

import { useState } from "react";
import { useAppStore } from "@/store";
import { useAnimeList } from "@/hooks/use-anime";

import { AnimeCard } from "@/components/anime/AnimeCard";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { STATUS } from "@/constants";

import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Expanded {
  [status: string]: boolean;
}

const STATUS_META: Record<
  STATUS,
  { Icon: typeof SmartDisplayIcon; color: string }
> = {
  [STATUS.WATCHING]: { Icon: SmartDisplayIcon, color: "info.main" },
  [STATUS.DROPPED]: { Icon: ThumbDownIcon, color: "error.main" },
  [STATUS.DONE]: { Icon: CheckCircleIcon, color: "success.main" },
};

export function AnimeList() {
  const search = useAppStore((s) => s.search);

  const expandedInit = { [STATUS.WATCHING]: true } as Expanded;
  const [expanded, setExpanded] = useState<Expanded>(expandedInit);

  const watching = useAnimeList(STATUS.WATCHING);
  const dropped = useAnimeList(STATUS.DROPPED);
  const done = useAnimeList(STATUS.DONE);

  const lists: Partial<Record<STATUS, ReturnType<typeof useAnimeList>>> = {
    [STATUS.WATCHING]: watching,
    [STATUS.DROPPED]: dropped,
    [STATUS.DONE]: done,
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  return (
    <>
      {Object.values(STATUS).map((status) => {
        const { Icon, color } = STATUS_META[status];
        const list = lists[status];
        const items =
          list?.data?.filter((value) =>
            search
              ? value.name.toLowerCase().includes(search.toLowerCase())
              : true,
          ) ?? [];

        return (
          <Accordion
            key={status}
            expanded={Boolean(expanded[status]) || Boolean(search)}
            onChange={handleChange(status)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
            >
              <Icon sx={{ marginRight: 1, color, fontSize: "1.5rem" }} />
              <Typography sx={{ fontWeight: 600 }}>{status}</Typography>
              {list?.data && (
                <Chip
                  label={items.length}
                  size="small"
                  sx={{ marginLeft: 1 }}
                />
              )}
            </AccordionSummary>
            <AccordionDetails>
              {list?.error ? (
                <Typography variant="body2" color="error">
                  {`Failed to load ${status} list.`}
                </Typography>
              ) : !list?.data ? (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rounded" height={140} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Skeleton variant="rounded" height={140} />
                  </Grid>
                </Grid>
              ) : items.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {search
                    ? `No results for “${search}”`
                    : "Nothing here yet — add an anime to get started."}
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {items.map((value) => (
                    <Grid key={value._id} size={{ xs: 12, sm: 6 }}>
                      <AnimeCard data={value} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}
