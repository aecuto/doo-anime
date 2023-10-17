import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AppContext } from "../App";
import { reqMe } from "@/app/services/user-api";
import { LinearProgress, Grid, Typography } from "@mui/material";

export const Welcome = () => {
  const [loading, setLoading] = React.useState(true);
  const [username, setUsername] = React.useState("");

  const { setUser } = React.useContext(AppContext);

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
    const username = localStorage.getItem("username") || "";
    getUserData(username);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleConfirm = () => {
    localStorage.setItem("username", username);
    getUserData(username);
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
      <Grid item xs={3}>
        <Typography sx={{ height: "100%" }} variant="h3" align="center">
          Doo Anime
        </Typography>

        <Grid container spacing={1}>
          {loading ? (
            <Grid item xs>
              <LinearProgress color="secondary" />
            </Grid>
          ) : (
            <>
              <Grid item xs={9}>
                <TextField
                  label="Username"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  defaultValue={username}
                />
              </Grid>

              <Grid item xs={3} sx={{ margin: "auto" }}>
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
