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
  const { setOpen, setSync } = useContext(AppContext);
  const [loading, setLoading] = useState(true);

  const onUpdate = (id: string, values: Partial<IWatching>) => {
    toast.promise(
      reqUpdate(id, values).then(() => {
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
    toast.promise(
      reqCreate(values).then(() => {
        setSync(new Date());
        setOpen(false);
      }),
      {
        pending: "create is pending",
        success: "create successfully",
        error: {
          render(props) {
            const error = props.data as AxiosError;
            return error.response?.statusText;
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
          <Button type="submit" variant="outlined">
            {id ? "Update" : "Create"}
          </Button>
        </FormControl>
      </form>
    </>
  );
};
