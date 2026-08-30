"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { useEffect } from "react";

import { Welcome } from "./components/Welcome";
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

function AppPage() {
  useEffect(() => {
    reqSync();
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Welcome />

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
