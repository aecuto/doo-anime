import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AppContext } from "../App";
import { reqMe } from "@/app/services/user-api";

export const WelcomeForm = () => {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const { user, setUser } = React.useContext(AppContext);

  const getUserData = (username: string) => {
    reqMe(username).then((res) => {
      setUser(res.data);
      setOpen(!res.data);
    });
  };

  React.useEffect(() => {
    const username = localStorage.getItem("username") || "";

    if (!username) {
      setOpen(true);
      return;
    }

    getUserData(username);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleClose = (event: object, reason: string) => {
    if (reason) return;
    setOpen(false);
  };

  const handleConfirm = () => {
    localStorage.setItem("username", username);
    getUserData(username);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form>
        <DialogTitle>Please enter username</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This name can be reference to your anime list. Anyone know this name
            which can view your list.
          </DialogContentText>
          <TextField
            margin="dense"
            label="username"
            fullWidth
            variant="standard"
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
