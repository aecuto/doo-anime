import * as React from "react";
import Button from "@mui/material/Button";
import { IAnime } from "@/database/model";
import { Box } from "@mui/material";

import { reqUpdateReplay, reqDelete } from "@/app/services/anime-api";

import { toast } from "react-toastify";

import { AppContext } from "@/app/App";
import { STATUS } from "@/app/constant";

interface Props {
  data: IAnime;
}

const ActionButton = ({ data }: Props) => {
  const { setId, setOpen, setSync } = React.useContext(AppContext);

  const handleOpen = () => {
    setOpen(true);
    setId(data._id);
  };

  const onReplay = () => {
    toast.promise(
      reqUpdateReplay(data._id).then(() => {
        setSync(new Date());
      }),
      {
        pending: "Update is pending",
        success: "Update status to watching",
        error: "Update is failed",
      }
    );
  };

  const onLink = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noreferrer");
  };

  const handleDelete = () => {
    toast.promise(
      reqDelete(data._id).then(() => {
        setSync(new Date());
      }),
      {
        pending: "Delete is pending",
        success: "Delete status to watching",
        error: "Delete is failed",
      }
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {[STATUS.WAIT, STATUS.DROP].includes(data.status as STATUS) ? (
        <Button size="small" color="warning" onClick={() => onReplay()}>
          Replay
        </Button>
      ) : null}

      <Button size="small" color="info" onClick={() => onLink(data.link)}>
        Link
      </Button>
      <Button size="small" onClick={() => handleOpen()}>
        Edit
      </Button>
      <Button size="small" onClick={() => handleDelete()} color="error">
        Del
      </Button>
    </Box>
  );
};

export default ActionButton;
