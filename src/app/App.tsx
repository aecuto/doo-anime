"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useEffect, useState } from "react";
import { Main } from "./components/Main";

import { Welcome } from "./components/Welcome";
import "./App.css";
import { reqSync } from "@/app/services/anime-api";
import { ToastContainer } from "react-toastify";
import { useAppStore } from "./store";

const fontFamily = `'Noto Sans', sans-serif;`;

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: { fontFamily },
});

function AppPage() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    reqSync();
  }, []);

  if (!hasHydrated) return null;

  return (
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
  );
}

export default AppPage;
