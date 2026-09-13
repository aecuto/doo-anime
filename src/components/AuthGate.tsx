import * as React from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAppStore } from "@/store";
import { reqMalMe, reqMe } from "@/services/user-api";
import { useMe } from "@/hooks/use-user";
import { Dashboard } from "@/components/Dashboard";

const Template = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      p: 2,
    }}
  >
    {children}
  </Box>
);

export const AuthGate = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { setUser, user, hasHydrated } = useAppStore();

  const { data: me } = useMe(hasHydrated ? user?.username : undefined);

  React.useEffect(() => {
    if (me) {
      setUser(me);
    }
  }, [me, setUser]);

  React.useEffect(() => {
    if (!hasHydrated || user) return;

    const searchParams = new URLSearchParams(window.location.search);
    const loginError = searchParams.get("loginError");

    if (loginError) {
      setError(loginError);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }

    let cancelled = false;

    reqMalMe()
      .then((res) => {
        if (!cancelled && res.data) {
          setUser(res.data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, user, setUser]);

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault();
    const username = input.trim();
    if (!username || loading) return;

    setLoading(true);
    setError(null);
    try {
      const res = await reqMe(username);
      setUser(res.data);
    } catch {
      setError("Could not find that username. Please check it and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasHydrated)
    return (
      <Template>
        <LinearProgress
          color="secondary"
          sx={{ width: "100%", maxWidth: 420 }}
        />
      </Template>
    );

  if (user) return <Dashboard />;

  return (
    <Template>
      <Paper
        component="form"
        onSubmit={handleConfirm}
        elevation={8}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 420,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" align="center" sx={{ fontWeight: 700 }}>
            Doo Anime
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Track your anime watchlist
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="MyAnimeList username"
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
          disabled={!input.trim()}
        >
          Sign in
        </Button>

        <Divider>
          <Typography variant="body2" color="text.secondary">
            or
          </Typography>
        </Divider>

        <Button
          component="a"
          href="/api/auth/mal"
          variant="outlined"
          size="large"
          disabled={loading}
        >
          Sign in with MyAnimeList
        </Button>
      </Paper>
    </Template>
  );
};
