"use client";

import { useEffect } from "react";

import "./App.css";
import { reqSync } from "@/app/services/anime-api";
import { ToastContainer } from "react-toastify";
import Welcome from "./components/Welcome";

function AppPage() {
  useEffect(() => {
    reqSync();
  }, []);

  return (
    <>
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
    </>
  );
}

export default AppPage;
