import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";

interface IPros {
  children: React.ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}

export const Modal = ({ children, setOpen, open, id }: IPros) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {id ? "Update" : "Create"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};
