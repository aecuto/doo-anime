import { Grid } from "@mui/material";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { reqList } from "../../services/anime-api";

import { IAnime } from "@/database/model";
import ItemList from "@/app/components/List/Item";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { STATUS } from "@/app/constant";

import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
interface AnimeList {
  [status: string]: IAnime[];
}

interface Expanded {
  [status: string]: Boolean;
}

export default function List() {
  const { search, sync, user } = useContext(AppContext);

  const [data, setData] = useState<AnimeList>({} as AnimeList);
  const [loading, seLoading] = useState(true);
  const [expanded, setExpanded] = useState<Expanded>({
    [STATUS.WATCHING]: true,
  } as Expanded);

  useEffect(() => {
    getAnimeList(STATUS.WATCHING).finally(() => {
      seLoading(false);
      getAnimeList(STATUS.DROP);
      getAnimeList(STATUS.DONE);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sync]);

  const getAnimeList = (status: STATUS) =>
    reqList(status, user?._id || "").then((res) => {
      setData((prev) => ({ ...prev, [status]: res.data }));
    });

  const handleChange =
    (panel: STATUS) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded((prev) => ({ ...prev, [panel]: isExpanded }));
    };

  const statusIcons = (status: STATUS) => {
    switch (status) {
      case STATUS.WATCHING:
        return <SmartDisplayIcon sx={{ marginRight: "5px" }} />;
      case STATUS.DROP:
        return <ThumbDownIcon sx={{ marginRight: "5px" }} />;
      case STATUS.DONE:
        return <CheckCircleIcon sx={{ marginRight: "5px" }} />;
      default:
        break;
    }
  };

  return (
    <>
      {Object.values(STATUS).map((status) => (
        <Accordion
          key={status}
          expanded={Boolean(expanded[status]) || Boolean(search)}
          onChange={handleChange(status)}
          TransitionProps={{
            timeout: 0,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            {statusIcons(status)} {status}
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {data[status]
                ?.filter((value) =>
                  search
                    ? value.name.toLowerCase().includes(search.toLowerCase())
                    : true
                )
                .map((value) => (
                  <Grid key={value._id} size={{ xs: 12, sm: 6 }}>
                    <ItemList data={value} />
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
