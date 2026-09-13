"use client";

import * as React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppStore } from "../store";
import SearchField from "./SearchField";
import List from "./List";
import { DialogForm } from "./DialogForm";
import { reqMalLogout, reqMalMe } from "@/app/services/user-api";

export const Dashboard = () => {
  const search = useAppStore((s) => s.search);
  const setSearch = useAppStore((s) => s.setSearch);
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const setUser = useAppStore((s) => s.setUser);
  const user = useAppStore((s) => s.user);
  const [loggingOut, setLoggingOut] = React.useState(false);
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
      </Container>
    </Box>
  );
};
