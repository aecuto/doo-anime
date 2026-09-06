import AppPage from "@/app/App";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Doo Anime",
  description: "Personal anime watchlist tracker",
};

export const viewport: Viewport = {
  themeColor: "#0f1115",
};

export default function Home() {
  return (
    <main>
      <AppPage />
    </main>
  );
}
