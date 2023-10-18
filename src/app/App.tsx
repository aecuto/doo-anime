"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import List from "./components/List";
import SearchField from "./components/SearchField";
import { Box, Button, Container, Grid } from "@mui/material";
import Filter from "./components/Filter";
import { createContext, useState } from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { STATUS, TYPE } from "./constant";
import { DialogForm } from "./components/DialogForm";
import { Welcome } from "./components/Welcome";
import { IUser } from "@/database/model";
import "./App.css";

const fontFamily = `'Noto Sans', sans-serif;`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: { fontFamily },
});

interface IAppContext {
  search: string;
  status: string;
  type: string;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setSync: React.Dispatch<React.SetStateAction<Date>>;
  sync: Date;
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

function AppPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [sync, setSync] = useState(new Date());
  const [user, setUser] = useState<IUser>();

  const Main = () => {
    return (
      <Box sx={{ p: 5 }}>
        <Container>
          <Button
            variant="outlined"
            color="success"
            onClick={() => {
              setOpen(true);
              setId("");
            }}
            sx={{ mb: 3 }}
          >
            Add
          </Button>

          <DialogForm id={id} setOpen={setOpen} open={open} />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={8}>
              <SearchField data={search} setData={setSearch} />
            </Grid>
            <Grid item xs>
              <Filter
                data={status}
                setData={setStatus}
                options={Object.values(STATUS)}
                label="Status"
                defaultValue={STATUS.WATCHING}
              />
            </Grid>
            <Grid item xs>
              <Filter
                data={type}
                setData={setType}
                options={Object.values(TYPE)}
                label="Type"
                defaultValue={TYPE.ANIME}
              />
            </Grid>
          </Grid>

          <List />
        </Container>
      </Box>
    );
  };

  return (
    <AppContext.Provider
      value={{
        search,
        status,
        type,
        setId,
        setOpen,
        open,
        sync,
        setSync,
        user,
        setUser,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {user ? Main() : <Welcome />}

        <ToastContainer
          position="top-right"
          autoClose={3000}
          limit={2}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="dark"
        />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default AppPage;
