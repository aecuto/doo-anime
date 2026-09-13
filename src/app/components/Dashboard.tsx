"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import SyncIcon from "@mui/icons-material/Sync";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useAppStore } from "../store";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";
import { reqMalLogout, reqMalMe } from "@/app/services/user-api";
import { reqDeleteMalList, reqSyncToMal } from "@/app/services/anime-api";
import { toast } from "react-toastify";
import { useSWRConfig } from "swr";

export const Dashboard = () => {
  const { mutate } = useSWRConfig();
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const setUser = useAppStore((s) => s.setUser);
  const user = useAppStore((s) => s.user);
  const viewMal = useAppStore((s) => s.viewMal);
  const setViewMal = useAppStore((s) => s.setViewMal);
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [syncing, setSyncing] = React.useState(false);
  const [deletingMal, setDeletingMal] = React.useState(false);
  const [confirmDeleteMal, setConfirmDeleteMal] = React.useState(false);
  const [isMalSession, setIsMalSession] = React.useState<boolean | null>(null);

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
          mutate("malList");
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
          mutate("malList");
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

  return (
    <Box sx={{ p: { xs: 2, sm: 5 } }}>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { sm: "center" },
            gap: 2,
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, mr: "auto" }}>
            Doo Anime
          </Typography>

          <Box sx={{ width: { xs: "100%", sm: 320 } }}>
            <SearchField data={search} setData={setSearch} />
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog("create")}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Add Anime
          </Button>

          {isMalSession && (
            <Tooltip title="Show your MyAnimeList instead of your local list">
              <FormControlLabel
                sx={{ width: { xs: "100%", sm: "auto" }, mr: 0 }}
                control={
                  <Switch
                    checked={viewMal}
                    onChange={(e) => setViewMal(e.target.checked)}
                  />
                }
                label="MyAnimeList"
              />
            </Tooltip>
          )}

          {isMalSession && (
            <Tooltip title="Push your local anime list to your MyAnimeList account">
              <Button
                variant="outlined"
                startIcon={<SyncIcon />}
                onClick={handleSyncToMal}
                loading={syncing}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Sync to MAL
              </Button>
            </Tooltip>
          )}

          {isMalSession && (
            <Tooltip title="Remove every anime from your MyAnimeList account">
              <Button
                color="error"
                variant="outlined"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setConfirmDeleteMal(true)}
                loading={deletingMal}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                Delete MAL List
              </Button>
            </Tooltip>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: { xs: "100%", sm: "auto" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
            }}
          >
            {user?.username && (
              <Tooltip
                title={
                  isMalSession
                    ? "Signed in via MyAnimeList"
                    : "Signed in with username"
                }
              >
                <Chip
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
                  sx={{ height: "auto", maxWidth: 180 }}
                />
              </Tooltip>
            )}

            <Button
              variant="text"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              loading={loggingOut}
              sx={{ width: { xs: "auto", sm: "auto" } }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        <List />
        <DialogForm />

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
      </Container>
    </Box>
  );
};
