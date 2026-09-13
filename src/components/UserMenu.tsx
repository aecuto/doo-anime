"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import SyncIcon from "@mui/icons-material/Sync";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useAppStore } from "@/store";
import { reqMalLogout, reqMalMe } from "@/services/user-api";
import { reqDeleteMalList, reqSyncToMal } from "@/services/anime-api";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

export const UserMenu = () => {
  const { mutate } = useSWRConfig();
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const setUser = useAppStore((s) => s.setUser);
  const user = useAppStore((s) => s.user);
  const viewMal = useAppStore((s) => s.viewMal);
  const setViewMal = useAppStore((s) => s.setViewMal);
  const [menuAnchor, setMenuAnchor] = React.useState<HTMLElement | null>(null);
  const [isMalSession, setIsMalSession] = React.useState<boolean | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const [deletingMal, setDeletingMal] = React.useState(false);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [confirmDeleteMal, setConfirmDeleteMal] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    reqMalMe()
      .then((res) => {
        if (!cancelled) setIsMalSession(res.data?.username === user?.username);
      })
      .catch(() => {
        if (!cancelled) setIsMalSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.username]);

  const handleSyncToMal = () => {
    setSyncing(true);
    toast.promise(
      reqSyncToMal()
        .then((res) => res.data)
        .then((data) => {
          mutate(
            (key) => Array.isArray(key) && key[0] === "animeList",
            undefined,
            { revalidate: true },
          );
          return data;
        }),
      {
        pending: "Syncing your list to MyAnimeList…",
        success: {
          render({ data }) {
            return `Synced ${data.synced} of ${data.total} anime to MyAnimeList`;
          },
        },
        error: {
          render({ data }: any) {
            const message = data?.response?.data?.error;
            return message || "Could not sync to MyAnimeList. Please sign in again.";
          },
        },
      },
    ).finally(() => setSyncing(false));
  };

  const handleDeleteMalList = () => {
    setDeletingMal(true);
    toast.promise(
      reqDeleteMalList()
        .then((res) => res.data)
        .then((data) => {
          mutate(
            (key) => Array.isArray(key) && key[0] === "animeList",
            undefined,
            { revalidate: true },
          );
          return data;
        }),
      {
        pending: "Deleting your MyAnimeList entries…",
        success: {
          render({ data }) {
            return `Deleted ${data.deleted} of ${data.total} anime from MyAnimeList`;
          },
        },
        error: {
          render({ data }: any) {
            const message = data?.response?.data?.error;
            return message || "Could not delete your MyAnimeList. Please sign in again.";
          },
        },
      },
    ).finally(() => setDeletingMal(false));
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await reqMalLogout();
    } catch {
      // session cookie is best-effort; still clear the local user
    } finally {
      setUser(undefined);
      setLoggingOut(false);
    }
  };

  if (!user?.username) return null;

  return (
    <>
      <Tooltip
        title={
          isMalSession
            ? "Signed in via MyAnimeList"
            : "Signed in with username"
        }
      >
        <Chip
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          avatar={
            <Avatar
              sx={{
                bgcolor: isMalSession ? "#2e51a2" : "grey.500",
                fontSize: 14,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
          }
          label={
            <Box sx={{ textAlign: "left", lineHeight: 1.2, py: 0.5 }}>
              <Typography
                variant="body2"
                component="span"
                sx={{ display: "block", fontWeight: 600 }}
              >
                {user.username}
              </Typography>
              <Typography
                variant="caption"
                component="span"
                color="text.secondary"
              >
                {isMalSession === null
                  ? "…"
                  : isMalSession
                    ? "MyAnimeList"
                    : "Username"}
              </Typography>
            </Box>
          }
          variant="outlined"
          sx={{ height: "auto", maxWidth: 180, cursor: "pointer" }}
        />
      </Tooltip>

      <Menu
        open={Boolean(menuAnchor)}
        anchorEl={menuAnchor}
        onClose={() => setMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setOpenDialog("create");
          }}
        >
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText>Add Anime</ListItemText>
        </MenuItem>

        {isMalSession && <Divider />}
        {isMalSession && (
          <MenuItem disableRipple sx={{ cursor: "default" }}>
            <ListItemText>MyAnimeList</ListItemText>
            <Switch
              edge="end"
              checked={viewMal}
              onChange={(e) => setViewMal(e.target.checked)}
            />
          </MenuItem>
        )}
        {isMalSession && (
          <MenuItem
            disabled={syncing}
            onClick={() => {
              setMenuAnchor(null);
              handleSyncToMal();
            }}
          >
            <ListItemIcon>
              <SyncIcon />
            </ListItemIcon>
            <ListItemText>Sync to MAL</ListItemText>
          </MenuItem>
        )}
        {isMalSession && (
          <MenuItem
            disabled={deletingMal}
            onClick={() => {
              setMenuAnchor(null);
              setConfirmDeleteMal(true);
            }}
          >
            <ListItemIcon>
              <DeleteSweepIcon />
            </ListItemIcon>
            <ListItemText slotProps={{ primary: { color: "error" } }}>
              Delete MAL List
            </ListItemText>
          </MenuItem>
        )}

        <Divider />
        <MenuItem
          disabled={loggingOut}
          onClick={() => {
            setMenuAnchor(null);
            handleLogout();
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog
        open={confirmDeleteMal}
        onClose={() => setConfirmDeleteMal(false)}
        PaperProps={{ sx: { width: { xs: "100%", sm: "auto" } } }}
      >
        <DialogTitle>Delete MyAnimeList</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will remove every anime from your MyAnimeList account. This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteMal(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmDeleteMal(false);
              handleDeleteMalList();
            }}
          >
            Delete all
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
