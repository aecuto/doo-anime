import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IAnime } from "@/database/model";
import { Box, Chip, Grid } from "@mui/material";

import styled from "styled-components";

import InfoDialog from "@/app/components/List/Info";
import moment from "moment-timezone";
import EpisodeAction from "@/app/components/List/Item/episodeAction";
import ActionButton from "@/app/components/List/Item/actionButton";

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

export default function ItemList({ data }: { data: IAnime }) {
  const [episode, setEpisode] = React.useState(data.episode || 0);
  const [openInfo, setInfoOpen] = React.useState(false);

  const handleClick = () => {
    setInfoOpen(true);
  };

  const displayEpisodeFromNow = () => {
    if (!data?.broadcast?.day || !data.episodeUpdated) return "-";

    const day = moment().day(data?.broadcast?.day).weekday() - 1;
    const newEpUpdate = moment(data.episodeUpdated).day(-day);

    return moment(newEpUpdate).fromNow();
  };

  return (
    <>
      <InfoDialog
        animeId={data.animeId}
        anime_id={data._id}
        open={openInfo}
        setOpen={setInfoOpen}
      />

      <Card
        sx={{ display: "flex", backgroundColor: "transparent" }}
        variant="outlined"
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
              }}
            >
              {data.name}
            </Typography>

            <Box>
              <ChipV2
                label={`Link`}
                variant="outlined"
                color="warning"
                onClick={() => window.open(data.link, "_blank", "noreferrer")}
                disabled={!data.link}
              />

              {data.animeId ? (
                <ChipV2
                  label={`info`}
                  variant="outlined"
                  color="info"
                  onClick={handleClick}
                />
              ) : null}

              <ChipV2
                label={displayEpisodeFromNow()}
                variant="outlined"
                color="success"
              />

              <ActionButton data={data} />
            </Box>

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
      </Card>
    </>
  );
}
