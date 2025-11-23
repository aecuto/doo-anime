import * as React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box } from "@mui/material";
import { AnimeForm } from "./Form";
import { AppContext } from "@/app/App";

interface IPros {
  id?: string;
}

export const DialogForm = ({ id }: IPros) => {
  const { openDialog, setOpenDialog } = React.useContext(AppContext);

  const onClose = (event: object, reason: string) => {
    setOpenDialog(null);
  };

  const isOpen = openDialog === (id || "create");

  return (
    <Dialog open={isOpen} onClose={onClose} disableEnforceFocus>
      <DialogTitle>{id ? "Update" : "Create"}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <AnimeForm id={id} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
