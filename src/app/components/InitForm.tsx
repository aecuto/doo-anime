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

  const { setCreatedBy } = React.useContext(AppContext);

  React.useEffect(() => {
    const value = localStorage.getItem("createdBy");
    setCreatedBy(value || "");
    setOpen(!value);
  }, [setCreatedBy]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    localStorage.setItem("createdBy", data);
    setCreatedBy(data);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
