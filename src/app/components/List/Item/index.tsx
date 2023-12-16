import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { IAnime } from "@/database/model";
import { Box, Chip } from "@mui/material";

import styled from "styled-components";

import InfoDialog from "@/app/components/List/Info";
import moment from "moment-timezone";
import EpisodeAction from "@/app/components/List/Item/episodeAction";
import ActionButton from "@/app/components/List/Item/actionButton";

const ChipV2 = styled(Chip)`
  && {
    margin-right: 10px;
    margin-bottom: 10px;
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

  return (
    <>
      <InfoDialog
        animeId={data.animeId}
        anime_id={data._id}
        open={openInfo}
        setOpen={setInfoOpen}
      />

      <Card sx={{ display: "flex" }}>
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
              {data.animeId ? (
                <ChipV2
                  label={`info`}
                  variant="outlined"
                  color="info"
                  onClick={handleClick}
                />
              ) : null}

              <ChipV2
                label={`episodes: ${data.totalEpisodes || "??"}`}
                variant="outlined"
                color="warning"
              />

              <ChipV2
                label={`${
                  data.episodeUpdated
                    ? moment(data.episodeUpdated).fromNow()
                    : "-"
                }`}
                variant="outlined"
                color="secondary"
              />
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
            <ActionButton data={data} />
          </CardContent>
        </Box>
      </Card>
    </>
  );
}
