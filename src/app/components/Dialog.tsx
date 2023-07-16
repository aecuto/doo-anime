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
  const onClose = (event: object, reason: string) => {
    setOpen(false);
  };
  return (
    <Dialog open={open} onClose={onClose} disableEnforceFocus>
      <DialogTitle>{id ? "Update" : "Create"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>{children}</Box>
      </DialogContent>
    </Dialog>
  );
};
