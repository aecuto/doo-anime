import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AnimeForm } from "./Form";
import { useAppStore } from "@/app/store";

interface IPros {
  id?: string;
}

export const DialogForm = ({ id }: IPros) => {
  const openDialog = useAppStore((s) => s.openDialog);
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);

  const onClose = () => {
    setOpenDialog(null);
  };

  const isOpen = openDialog === (id || "create");

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: "100%", sm: "auto" } } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {id ? "Edit anime" : "Add anime"}
        <IconButton aria-label="Close" size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <AnimeForm id={id} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
