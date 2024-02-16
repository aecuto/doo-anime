/* eslint-disable @next/next/no-img-element */
import {
  Backdrop,
  Box,
  CircularProgress,
  FilterOptionsState,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import { useFormik } from "formik";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

import { reqCreate, reqGetById, reqUpdate } from "../../services/anime-api";
import { toast } from "react-toastify";

import { SyntheticEvent, useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { STATUS, TYPE } from "../../constant";

import { AxiosError } from "axios";
import { IAnime } from "@/database/model";
import { IAnimeDetails, getAnimeSearch } from "@/app/services/jikan";
import _ from "lodash";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

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
        pending: "Update is pending",
        success: "Update successfully",
        error: "Update is failed",
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
        pending: "Create is pending",
        success: "Create successfully",
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

  const onInputChange = useDebouncedCallback(
    (event: React.SyntheticEvent, value: string) => {
      getAnimeSearch(value).then((res) => {
        setAnimeList(res.data.data);
      });
    },
    500
  );

  const getOptionLabel = (option: IAnimeDetails) => {
    return option.title;
  };

  const onChange = (
    event: SyntheticEvent<Element, Event>,
    value: IAnimeDetails | null
  ) => {
    formik.setValues({
      ...formik.values,
      name: value?.title,
      totalEpisodes: value?.episodes || 0,
      animeId: value?.mal_id,
      imageUrl: value?.images?.webp?.image_url || "",
      broadcast: value?.broadcast,
    });
  };

  const filterOptions = (
    options: IAnimeDetails[],
    state: FilterOptionsState<IAnimeDetails>
  ) => {
    const { inputValue } = state;
    const isExisting = options.some((option) => inputValue === option.title);

    if (inputValue && !isExisting) {
      options.push({
        title: inputValue,
      } as IAnimeDetails);
    }

    return options;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: IAnimeDetails
  ) => {
    const image = option?.images?.webp.small_image_url;
    return (
      <li {...props}>
        {option.mal_id ? (
          <Grid container>
            <Grid item xs={2}>
              {image ? <img src={image} alt="cover" /> : null}
            </Grid>

            <Grid item xs>
              <Typography>{option.title}</Typography>
              <Typography variant="body2" color={`darkgray`}>
                {option.title_english}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          `Add "${option.title}"`
        )}
      </li>
    );
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
              renderOption={renderOption}
              options={animeList}
              getOptionLabel={getOptionLabel}
              onChange={onChange}
              onInputChange={onInputChange}
              filterOptions={filterOptions}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Name" />
              )}
            />
          </FormControl>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Status</FormLabel>
          <RadioGroup
            row
            name="status"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            {Object.values(STATUS).map((value) => (
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={value}
                key={value}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="episode"
            label="Episode"
            variant="outlined"
            value={formik.values.episode}
            onChange={formik.handleChange}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {formik.values.totalEpisodes
                    ? `/${formik.values.totalEpisodes}`
                    : ""}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {/* <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Type</FormLabel>
          <RadioGroup
            row
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {Object.values(TYPE).map((value) => (
              <FormControlLabel
                value={value}
                control={<Radio />}
                label={value}
                key={value}
              />
            ))}
          </RadioGroup>
        </FormControl> */}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="link"
            label="Link"
            variant="outlined"
            value={formik.values.link}
            onChange={formik.handleChange}
          />
        </FormControl>

        {/* <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="totalEpisodes"
            label="Total Episodes"
            variant="outlined"
            value={formik.values.totalEpisodes}
            onChange={formik.handleChange}
            fullWidth
          />
        </FormControl> */}

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
