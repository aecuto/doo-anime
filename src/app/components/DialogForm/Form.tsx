/* eslint-disable @next/next/no-img-element */
import {
  FilterOptionsState,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
  Skeleton,
  Box,
  Typography,
} from "@mui/material";

import { useFormik } from "formik";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";

import { reqCreate, reqUpdate } from "../../services/anime-api";
import { toast } from "react-toastify";

import { SyntheticEvent, useEffect, useState } from "react";
import { useAppStore } from "../../store";
import { STATUS } from "../../constant";

import { AxiosError } from "axios";
import { IAnime } from "@/database/model";
import { useDebounce } from "use-debounce";
import { useAnime, useAnimeSearch, useRefreshAnime } from "@/app/hooks/use-anime";
import { IMyAnimeList } from "@/app/types/myanimelist";

export const AnimeForm = ({ id }: { id?: string }) => {
  const setOpenDialog = useAppStore((s) => s.setOpenDialog);
  const user = useAppStore((s) => s.user);
  const refresh = useRefreshAnime();

  const { data: anime, isLoading: loading } = useAnime(id);

  const [nameInput, setNameInput] = useState("");
  const [debouncedQuery] = useDebounce(nameInput, 500);
  const { data: animeList = [] } = useAnimeSearch(debouncedQuery);

  const onUpdate = (id: string, values: Partial<IAnime>) => {
    toast.promise(
      reqUpdate(id, values).then(() => {
        refresh();
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
    toast.promise(
      reqCreate(values).then(() => {
        refresh();
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
    if (anime) {
      formik.setValues(anime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime]);

  const onInputChange = (
    event: SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setNameInput(value);
  };

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
              <Typography variant="body2" color="text.secondary" noWrap>
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

  if (loading) {
    return (
      <Box sx={{ width: 320, maxWidth: "100%" }}>
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
      </Box>
    );
  }

  return (
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
          label="Image URL"
          variant="outlined"
          value={formik.values.imageUrl}
          onChange={formik.handleChange}
          fullWidth
        />
      </FormControl>

      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={() => setOpenDialog(null)}>
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          {id ? "Update" : "Create"}
        </Button>
      </Box>
    </form>
  );
};
