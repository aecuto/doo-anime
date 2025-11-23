"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import List from "./components/List";
import SearchField from "./components/SearchField";
import { Box, Button, Container, Grid } from "@mui/material";
import { createContext, useEffect, useState } from "react";

import dynamic from "next/dynamic";
import { Welcome } from "./components/Welcome";
import { IUser } from "@/database/model";
import "./App.css";
import { reqSync } from "@/app/services/anime-api";
import { ToastContainer } from "react-toastify";

const fontFamily = `'Noto Sans', sans-serif;`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: { fontFamily },
});

interface IAppContext {
  search: string;
  setSync: React.Dispatch<React.SetStateAction<Date>>;
  sync: Date;
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

function AppPage() {
  const [search, setSearch] = useState("");
  const [sync, setSync] = useState(new Date());
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    reqSync();
  }, []);

  const Main = () => {
    return (
      <Box sx={{ p: 5 }}>
        <Container>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size="grow">
              <SearchField data={search} setData={setSearch} />
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
        sync,
        setSync,
        user,
        setUser,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        {user ? <Main /> : <Welcome />}

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
