import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAppStore } from "../store";
import { reqMe } from "@/app/services/user-api";
import { LinearProgress, Grid, Typography } from "@mui/material";
import { Dashboard } from "./Dashboard";

const Template = ({ children }: { children: React.ReactNode }) => (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{ minHeight: "100vh" }}
  >
    <Grid size={3}>
      <Typography sx={{ height: "100%" }} variant="h3" align="center">
        Doo Anime
      </Typography>
      {children}
    </Grid>
  </Grid>
);

const AuthGate = () => {
  const [input, setInput] = React.useState("");

  const { setUser, user, hasHydrated } = useAppStore();

  const handleConfirm = () => {
    reqMe(input).then((res) => {
      setUser(res.data);
    });
  };

  React.useEffect(() => {
    if (!user) return;
    reqMe(user.username).then((res) => {
      setUser(res.data);
    });
  }, [hasHydrated]);

  if (!hasHydrated)
    return (
      <Template>
        <LinearProgress color="secondary" />
      </Template>
    );

  if (user) return <Dashboard />;

  return (
    <Template>
      <Grid container spacing={1}>
        <Grid size={9}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
        </Grid>

        <Grid size={3} sx={{ margin: "auto" }}>
          <Button onClick={handleConfirm} variant="outlined" size="large">
            Go
          </Button>
        </Grid>
      </Grid>
    </Template>
  );
};

export default AuthGate;
