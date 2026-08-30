/* eslint-disable @next/next/no-img-element */
import {
  Backdrop,
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

import { SyntheticEvent, useEffect, useState } from "react";
import { useAppStore } from "../../store";
import { STATUS } from "../../constant";

import { AxiosError } from "axios";
import { IAnime } from "@/database/model";
import _ from "lodash";
import { useDebouncedCallback } from "use-debounce";
import { reqAnimeSearch } from "@/app/services/myanimelist-api";
import { IMyAnimeList } from "@/app/types/myanimelist";

export const AnimeForm = ({ id }: { id?: string }) => {
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const setSync = useAppStore((s) => s.setSync);
  const user = useAppStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [animeList, setAnimeList] = useState<IMyAnimeList[]>([]);

  console.log(animeList);

  const onUpdate = (id: string, values: Partial<IAnime>) => {
    const payload = values;
    toast.promise(
      reqUpdate(id, payload).then(() => {
        setSync(new Date());
        setOpenDialog(null);
      }),
      {
        pending: "Update is pending",
        success: "Update successfully",
        error: "Update is failed",
      },
    );
  };

  const onCreate = (values: Partial<IAnime>) => {
    const payload = values;
    toast.promise(
      reqCreate(payload).then(() => {
        setSync(new Date());
        setOpenDialog(null);
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
      },
    );
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      status: STATUS.WATCHING,
      link: "",
      episode: 1,
      imageUrl: "",
      totalEpisodes: 0,
      episodeOffset: 0,
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
      if (!value) return;
      reqAnimeSearch(value).then((res) => {
        setAnimeList(res.data);
      });
    },
    500,
  );

  const getOptionLabel = (option: IMyAnimeList) => {
    return option.title;
  };

  const onChange = (
    event: SyntheticEvent<Element, Event>,
    value: IMyAnimeList | null,
  ) => {
    formik.setValues({
      ...formik.values,
      name: value?.title,
      animeId: value?.id,
      totalEpisodes: value?.num_episodes || 0,
      imageUrl: value?.main_picture?.large || "",
    });
  };

  const filterOptions = (
    options: IMyAnimeList[],
    state: FilterOptionsState<IMyAnimeList>,
  ) => {
    const { inputValue } = state;

    const isExisting = options.some((option) => inputValue === option.title);

    if (inputValue && !isExisting) {
      options.push({
        title: inputValue,
      } as IMyAnimeList);
    }

    return options;
  };

  const renderOption = (
    props: React.HTMLAttributes<HTMLLIElement>,
    option: IMyAnimeList,
  ) => {
    const { key, ...otherProps } =
      props as React.HTMLAttributes<HTMLLIElement> & { key: string };
    const image = option?.main_picture?.large;
    return (
      <li key={key} {...otherProps}>
        {option.id ? (
          <Grid container spacing={2} alignItems="center">
            <Grid size="auto">
              {image ? (
                <img
                  src={image}
                  alt="cover"
                  style={{
                    width: "80px",
                    height: "112px",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              ) : null}
            </Grid>

            <Grid size="grow">
              <Typography noWrap>{option.title}</Typography>
              <Typography variant="body2" color={`darkgray`} noWrap>
                {option?.alternative_titles?.en}
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

        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="episodeOffset"
            label="Episode Offset"
            variant="outlined"
            type="number"
            value={formik.values.episodeOffset}
            onChange={formik.handleChange}
            fullWidth
            helperText="For Part 2, set this to the last episode of Part 1 (e.g., 13)"
          />
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
