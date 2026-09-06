"use client";

import { useEffect } from "react";
import { useMediaQuery } from "@mui/material";

import { reqSync } from "@/app/services/anime-api";
import { ToastContainer } from "react-toastify";
import AuthGate from "./components/AuthGate";

function AppPage() {
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    reqSync();
  }, []);

  return (
    <>
      <AuthGate />
      <ToastContainer
        position={isMobile ? "top-center" : "top-right"}
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
    </>
  );
}

export default AppPage;
