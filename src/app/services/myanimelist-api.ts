import { IMyAnimeList } from "../types/myanimelist";
import { apiService } from "./base";
import type { IItemAnime } from "@/app/components/Item";

export const reqAnimeSearch = (name: string) => {
  return apiService.get<IMyAnimeList[]>(`/myanimelist`, {
    params: { q: name },
  });
};

export const reqAnimeById = (id: string) => {
  return apiService.get<IMyAnimeList>(`/myanimelist/${id}`);
};

export const reqMalList = () => {
  return apiService.get<IItemAnime[]>("/mal-user/animelist");
};
