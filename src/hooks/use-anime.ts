"use client";

import { useCallback } from "react";
import useSWR, { useSWRConfig } from "swr";

import { STATUS } from "@/constants";
import { useAppStore } from "@/store";
import { reqGetById, reqList } from "@/services/anime-api";
import { reqAnimeById, reqAnimeSearch } from "@/services/myanimelist-api";

export const useAnimeList = (status: STATUS) => {
  const user = useAppStore((s) => s.user);
  const viewMal = useAppStore((s) => s.viewMal);

  return useSWR(
    user ? ["animeList", status, viewMal] : null,
    () => reqList(status, user!._id, viewMal).then((res) => res.data),
  );
};

export const useAnime = (id?: string) =>
  useSWR(
    id ? ["anime", id] : null,
    () => reqGetById(id!).then((res) => res.data),
  );

export const useAnimeSearch = (query: string) =>
  useSWR(
    query ? ["animeSearch", query] : null,
    () => reqAnimeSearch(query).then((res) => res.data),
    { keepPreviousData: true },
  );

export const useMalAnime = (id?: string | number) =>
  useSWR(
    id ? ["malAnime", String(id)] : null,
    () => reqAnimeById(String(id)).then((res) => res.data),
  );

export const useRefreshAnime = () => {
  const { mutate } = useSWRConfig();

  return useCallback(
    () =>
      mutate(
        (key) =>
          Array.isArray(key) &&
          (key[0] === "animeList" || key[0] === "anime"),
        undefined,
        { revalidate: true },
      ),
    [mutate],
  );
};
