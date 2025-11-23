import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IAnime } from "@/database/model";
import { Box, Chip } from "@mui/material";

import styled from "styled-components";

import InfoDialog from "@/app/components/List/Info";
import EpisodeAction from "@/app/components/Item/episodeAction";
import { Info, Edit, Delete, Replay, Link } from "@mui/icons-material";
import { DialogForm } from "@/app/components/DialogForm";
import { reqUpdateReplay, reqDelete } from "@/app/services/anime-api";
import { toast } from "react-toastify";
import { AppContext } from "@/app/App";
import { STATUS } from "@/app/constant";

const ChipV2 = styled(Chip)`
  && {
    margin: auto;
    margin-right: 5px;
  }
`;

const EmptyImage = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  border: 1px solid darkslategray;
  color: darkslategray;
`;

const ActionButtonsContainer = styled(Box)`
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
`;

const StyledCard = styled(Card)<{ $hasLink: boolean }>`
  &:hover ${ActionButtonsContainer} {
    opacity: 1;
  }

  &:hover {
    border-color: ${(props) =>
      props.$hasLink ? "lightblue" : "lightcoral"} !important;
    box-shadow: 0 0 8px
      ${(props) => (props.$hasLink ? "lightblue" : "lightcoral")};
  }
`;

export default function ItemList({ data }: { data: IAnime }) {
  const { setSync, setOpenDialog } = React.useContext(AppContext);
  const [episode, setEpisode] = React.useState(data.episode || 0);
  const [openInfo, setInfoOpen] = React.useState(false);

  const handleClick = () => {
    setInfoOpen(true);
  };

  const handleOpen = () => {
    setOpenDialog(true);
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
      <InfoDialog
        animeId={data.animeId}
        open={openInfo}
        setOpen={setInfoOpen}
      />

      <DialogForm id={data._id} />

      <StyledCard
        $hasLink={!!data.link}
        sx={{
          display: "flex",
          backgroundColor: "transparent",
          cursor: data.link ? "pointer" : "default",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        variant="outlined"
        onClick={(e) => {
          // Only open link if clicking on the card itself, not on buttons
          if (
            e.target === e.currentTarget ||
            (e.target as HTMLElement).closest(
              ".MuiCardContent-root, .MuiCardMedia-root, .MuiBox-root:not(button)"
            )
          ) {
            if (data.link) {
              window.open(data.link, "_blank", "noreferrer");
            }
          }
        }}
      >
        <Box sx={{ width: "250px", height: "250px" }}>
          {data.imageUrl ? (
            <CardMedia component="img" image={data.imageUrl} height={`100%`} />
          ) : (
            <EmptyImage>
              <Typography align="center">No Image</Typography>
            </EmptyImage>
          )}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <CardContent
            sx={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <Typography
              variant="body1"
              sx={{
                maxHeight: "70px",
                overflow: "hidden",
                marginBottom: "5px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {data.name}
            </Typography>

            <ActionButtonsContainer onClick={(e) => e.stopPropagation()}>
              {data.animeId ? (
                <ChipV2
                  icon={<Info />}
                  label={`info`}
                  variant="outlined"
                  color="info"
                  onClick={handleClick}
                />
              ) : null}

              <ChipV2
                icon={<Edit />}
                label="Edit"
                variant="outlined"
                color="primary"
                onClick={handleOpen}
              />

              {[STATUS.DROP].includes(data.status as STATUS) && (
                <ChipV2
                  icon={<Replay />}
                  label="Replay"
                  variant="outlined"
                  color="success"
                  onClick={onReplay}
                />
              )}

              <ChipV2
                icon={<Delete />}
                label="Delete"
                variant="outlined"
                color="error"
                onClick={handleDelete}
              />
            </ActionButtonsContainer>

            <Box
              sx={{
                display: "flex",
                mt: "auto",
                justifyContent: "center",
              }}
            >
              <EpisodeAction
                episode={episode}
                setEpisode={setEpisode}
                data={data}
              />
            </Box>
          </CardContent>
        </Box>
      </StyledCard>
    </>
  );
}
