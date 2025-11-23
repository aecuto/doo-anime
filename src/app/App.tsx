"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Main } from "./components/Main";

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
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setSync: React.Dispatch<React.SetStateAction<Date>>;
  sync: Date;
  user: IUser | undefined;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  openDialog: string | null;
  setOpenDialog: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AppContext = createContext<IAppContext>({} as IAppContext);

function AppPage() {
  const [search, setSearch] = useState("");
  const [sync, setSync] = useState(new Date());
  const [user, setUser] = useState<IUser>();
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  useEffect(() => {
    reqSync();
  }, []);

  const handleSetOpenDialog = useCallback((value: React.SetStateAction<string | null>) => {
    setOpenDialog(value);
  }, []);

  const contextValue = useMemo(
    () => ({
      search,
      setSearch,
      sync,
      setSync,
      user,
      setUser,
      openDialog,
      setOpenDialog: handleSetOpenDialog,
    }),
    [search, sync, user, openDialog, handleSetOpenDialog]
  );

  return (
    <AppContext.Provider value={contextValue}>
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
