import { IMyAnimeList } from "../types/myanimelist";
import { apiService } from "./base";

export const reqAnimeSearch = (name: string) => {
  return apiService.get<IMyAnimeList[]>(`/myanimelist`, {
    params: { q: name },
  });
};

export const reqAnimeById = (id: string) => {
  return apiService.get<IMyAnimeList>(`/myanimelist/${id}`);
};
