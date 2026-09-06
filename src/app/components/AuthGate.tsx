import * as React from "react";
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useAppStore } from "../store";
import { reqMe } from "@/app/services/user-api";
import { Dashboard } from "./Dashboard";

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

const AuthGate = () => {
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { setUser, user, hasHydrated } = useAppStore();

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

  React.useEffect(() => {
    if (!user) return;
    reqMe(user.username).then((res) => {
      setUser(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

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
      </Paper>
    </Template>
  );
};

export default AuthGate;
