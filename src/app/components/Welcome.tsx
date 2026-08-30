import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useAppStore } from "../store";
import { reqMe } from "@/app/services/user-api";
import { LinearProgress, Grid, Typography } from "@mui/material";

export const Welcome = () => {
  const [loading, setLoading] = React.useState(true);
  const [input, setInput] = React.useState("");

  const { setUser, user } = useAppStore();

  const getUserData = (username: string) => {
    if (!username) {
      setLoading(false);
      return;
    }

    setLoading(true);
    reqMe(username).then((res) => {
      setUser(res.data);
      setLoading(false);
    });
  };

  React.useEffect(() => {
    getUserData(user?.username || input);
  }, [user]);

  const handleConfirm = () => {
    getUserData(input);
  };

  return (
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

        <Grid container spacing={1}>
          {loading ? (
            <Grid size="grow">
              <LinearProgress color="secondary" />
            </Grid>
          ) : (
            <>
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
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};
