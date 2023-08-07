import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AppContext } from "../App";

export const InitForm = () => {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState("");

  const { setOwner } = React.useContext(AppContext);

  React.useEffect(() => {
    const value = localStorage.getItem("owner");
    setOwner(value || "");
    setOpen(!value);
  }, [setOwner]);

  const handleClose = (event: object, reason: string) => {
    if (reason) return;
    setOpen(false);
  };

  const handleConfirm = () => {
    localStorage.setItem("owner", data);
    setOwner(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <form>
        <DialogTitle>Please enter your name</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This name can be reference to your whatcing list. Anyone know this
            name can know your list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Whaching list name"
            fullWidth
            variant="standard"
            onChange={(e) => setData(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm} type="submit">
            Confirm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
