import { STATUS } from "../constant";
import { IAnime } from "@/database/model";
import { apiService } from "./base";

export const reqCreate = (payload: Partial<IAnime>) => {
  return apiService.post("/anime/create", payload);
};

export const reqList = async (status: string, user: string) => {
  return apiService.get<IAnime[]>("/anime/list", {
    params: { status, user },
  });
};

export const reqGetById = (id: string) => {
  return apiService.get<IAnime>(`/anime/${id}`);
};

export const reqUpdate = (id: string, payload: Partial<IAnime>) => {
  return apiService.put<IAnime>(`/anime/${id}`, payload);
};

export const reqUpdateEpisode = (
  id: string,
  episode: number,
  episodeAt: Date
) => {
  return apiService.put<IAnime>(`/anime/${id}`, {
    episode: episode <= 0 ? 0 : episode,
    episodeAt,
  });
};

export const reqUpdateComplete = (id: string) => {
  const newPayload = {
    completed: new Date(),
    status: STATUS.DONE,
  };
  return apiService.put<IAnime>(`/anime/${id}`, newPayload);
};

export const reqUpdateReplay = (id: string) => {
  const newPayload = {
    status: STATUS.WATCHING,
  };
  return apiService.put<IAnime>(`/anime/${id}`, newPayload);
};

export const reqDelete = (id: string) => {
  return apiService.delete<IAnime>(`/anime/${id}`);
};

export const reqSync = () => {
  return apiService.get<IAnime>(`/anime/sync`);
};
