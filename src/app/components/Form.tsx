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

import { reqCreate, reqGetById, reqUpdate } from "../services/watching-api";
import { toast } from "react-toastify";

import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { STATUS, TYPE } from "../constant";

import { AxiosError } from "axios";
import { IWatching } from "@/database/model";

export const WatchingListForm = ({ id }: { id?: string }) => {
  const { setOpen, setSync, owner } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const onUpdate = (id: string, values: Partial<IWatching>) => {
    const share = String(values.share).split(",");

    const payload = {
      ...values,
      share,
    };

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

  const onCreate = (values: Partial<IWatching>) => {
    const payload = {
      ...values,
      owner,
    };
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
      totalEpisodes: 12,
      share: [],
      rating: 0
    },
    onSubmit: (values: Partial<IWatching>) => {
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

  return (
    <>
      {loading ? (
        <Backdrop open={true} sx={{ zIndex: 10 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : null}

      <form onSubmit={formik.handleSubmit} style={{ width: "100%" }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
          />
        </FormControl>
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
          <InputLabel>{"Type"}</InputLabel>
          <Select
            label={"Type"}
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
          >
            {Object.values(TYPE).map((option) => (
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

        {id ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              name="share"
              label="Share"
              variant="outlined"
              value={formik.values.share}
              onChange={formik.handleChange}
              fullWidth
              helperText="ex. waennoi,aecuto"
            />
          </FormControl>
        ) : null}

        {id ? (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              name="rating"
              label="Rating"
              variant="outlined"
              value={formik.values.rating}
              onChange={formik.handleChange}
              fullWidth
              type="number"
              InputProps={{ inputProps: { min: 0, max: 5 } }}
            />
          </FormControl>
        ) : null}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <Button type="submit" variant="outlined">
            {id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </form>
    </>
  );
};
