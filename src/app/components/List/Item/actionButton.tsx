import * as React from "react";
import Button from "@mui/material/Button";
import { IAnime } from "@/database/model";
import { Box, IconButton } from "@mui/material";

import { reqUpdateReplay, reqDelete } from "@/app/services/anime-api";

import { toast } from "react-toastify";

import { AppContext } from "@/app/App";
import { STATUS } from "@/app/constant";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface Props {
  data: IAnime;
}

const ActionButton = ({ data }: Props) => {
  const { setId, setOpen, setSync } = React.useContext(AppContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    handleClose();

    setOpen(true);
    setId(data._id);
  };

  const onReplay = () => {
    handleClose();

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
    <>
      <IconButton onClick={handleClick} color="secondary">
        <MoreVertIcon />
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleOpen()}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete()}>Delete</MenuItem>
        <MenuItem
          onClick={() => onReplay()}
          disabled={![STATUS.DROP].includes(data.status as STATUS)}
        >
          Replay
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionButton;
