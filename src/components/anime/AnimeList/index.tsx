import {
  Box,
  Tab,
  Tabs,
  Badge,
  Grid,
  Chip,
  Skeleton,
  Typography,
  Button,
} from "@mui/material";

import { useState } from "react";
import { useAppStore } from "@/store";
import { useAnimeList } from "@/hooks/use-anime";

import { AnimeCard } from "@/components/anime/AnimeCard";

import { STATUS } from "@/constants";

import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const PAGE_SIZE = 12;

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

  const [active, setActive] = useState<STATUS>(STATUS.WATCHING);
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});

  const watching = useAnimeList(STATUS.WATCHING);
  const dropped = useAnimeList(STATUS.DROPPED);
  const done = useAnimeList(STATUS.DONE);

  const lists: Partial<Record<STATUS, ReturnType<typeof useAnimeList>>> = {
    [STATUS.WATCHING]: watching,
    [STATUS.DROPPED]: dropped,
    [STATUS.DONE]: done,
  };

  const searching = Boolean(search);

  const getItems = (status: STATUS) => {
    const list = lists[status];
    return (
      list?.data?.filter((value) =>
        search ? value.name.toLowerCase().includes(search.toLowerCase()) : true,
      ) ?? []
    );
  };

  const list = lists[active];
  const items = getItems(active);
  const shown = searching ? items : items.slice(0, visibleCount[active] ?? PAGE_SIZE);
  const hasMore = !searching && items.length > shown.length;

  return (
    <Box>
      <Tabs
        value={active}
        onChange={(_, value: STATUS) => setActive(value)}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 3 }}
      >
        {Object.values(STATUS).map((status) => {
          const { Icon, color } = STATUS_META[status];
          const count = lists[status]?.data?.length;
          const matches = getItems(status).length;
          return (
            <Tab
              key={status}
              value={status}
              icon={
                <Badge
                  badgeContent={searching ? matches : count}
                  color="primary"
                  max={999}
                  showZero={false}
                >
                  <Icon sx={{ color }} />
                </Badge>
              }
              iconPosition="start"
              label={status}
            />
          );
        })}
      </Tabs>

      {list?.error ? (
        <Typography variant="body2" color="error">
          {`Failed to load ${active} list.`}
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
        <>
          {searching && (
            <Chip
              label={`${items.length}/${list.data.length} matches`}
              size="small"
              sx={{ marginBottom: 2 }}
            />
          )}
          <Grid container spacing={3}>
            {shown.map((value) => (
              <Grid key={value._id} size={{ xs: 12, sm: 6 }}>
                <AnimeCard data={value} />
              </Grid>
            ))}
          </Grid>
          {hasMore && (
            <Button
              fullWidth
              sx={{ marginTop: 2 }}
              onClick={() =>
                setVisibleCount((prev) => ({
                  ...prev,
                  [active]: (prev[active] ?? PAGE_SIZE) + PAGE_SIZE,
                }))
              }
            >
              {`Show more (${items.length - shown.length} remaining)`}
            </Button>
          )}
        </>
      )}
    </Box>
  );
}
