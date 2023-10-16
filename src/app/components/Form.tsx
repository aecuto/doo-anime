import {
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { useFormik } from "formik";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

import { reqCreate, reqGetById, reqUpdate } from "../services/anime-api";
import { toast } from "react-toastify";

import {
  SetStateAction,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppContext } from "../App";
import { STATUS, TYPE } from "../constant";

import { AxiosError } from "axios";
import { IAnime } from "@/database/model";
import { IAnimeDetails, getAnimeSearch } from "@/app/services/jikan";
import _ from "lodash";

export const AnimeForm = ({ id }: { id?: string }) => {
  const { setOpen, setSync, user } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState<IAnimeDetails[]>([]);

  const onUpdate = (id: string, values: Partial<IAnime>) => {
    const payload = values;
    toast.promise(
      reqUpdate(id, payload).then(() => {
        setSync(new Date());
        setOpen(false);
      }),
      {
        pending: "update is pending",
        success: "update successfully",
        error: "update is failed",
      }
    );
  };

  const onCreate = (values: Partial<IAnime>) => {
    const payload = values;
    toast.promise(
      reqCreate(payload).then(() => {
        setSync(new Date());
        setOpen(false);
      }),
      {
        pending: "create is pending",
        success: "create successfully",
        error: {
          render(props) {
            const error = props.data as AxiosError<{ message: string }>;
            return error.response?.data?.message;
          },
        },
      }
    );
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      status: STATUS.WATCHING,
      type: TYPE.ANIME,
      link: "",
      episode: 1,
      imageUrl: "",
      totalEpisodes: 0,
      user: user?._id,
    },
    onSubmit: (values: Partial<IAnime>) => {
      if (id) {
        onUpdate(id, values);
      } else {
        onCreate(values);
      }
    },
  });

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    reqGetById(id).then((res) => {
      formik.setValues(res.data);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    getAnimeSearch(formik.values.name || "").then((res) =>
      setAnimeList(res.data.data)
    );
  }, [formik.values.name]);

  const getOptionLabel = (option: IAnimeDetails) => {
    return option.title;
  };
  const onAutocomplete = (
    event: SyntheticEvent<Element, Event>,
    value: IAnimeDetails | null
  ) => {
    formik.setValues({
      ...formik.values,
      name: value?.title,
      totalEpisodes: value?.episodes || 0,
      animeId: value?.mal_id,
      imageUrl: value?.images.webp.image_url,
    });
  };

  return (
    <>
      {loading ? (
        <Backdrop open={true} sx={{ zIndex: 10 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        {id ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              value={formik.values.name}
              variant="outlined"
              label="Name"
              disabled
            />
          </FormControl>
        ) : (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <Autocomplete
              options={animeList}
              getOptionLabel={getOptionLabel}
              onChange={onAutocomplete}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Name" />
              )}
            />
          </FormControl>
        )}
        {id ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              name="episode"
              label="Episode"
              variant="outlined"
              value={formik.values.episode}
              onChange={formik.handleChange}
              fullWidth
            />
          </FormControl>
        ) : null}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{"Status"}</InputLabel>
          <Select
            label={"Status"}
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            {Object.values(STATUS).map((option) => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            value={formik.values.link}
            onChange={formik.handleChange}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="totalEpisodes"
            label="Total Episodes"
            variant="outlined"
            value={formik.values.totalEpisodes}
            onChange={formik.handleChange}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="imageUrl"
            label="Image Url"
            variant="outlined"
            value={formik.values.imageUrl}
            onChange={formik.handleChange}
            fullWidth
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Button type="submit" variant="outlined">
            {id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </form>
    </>
  );
};
