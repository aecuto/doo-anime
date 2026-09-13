import { STATUS } from "../constant";
import { IAnime } from "@/database/model";
import { apiService } from "./base";
import type { IItemAnime } from "@/app/components/Item";

export const reqCreate = (payload: Partial<IAnime>) => {
  return apiService.post("/anime/create", payload);
};

export const reqList = (status: string, user: string, mal?: boolean) => {
  return apiService.get<IItemAnime[]>("/anime/list", {
    params: { status, user, ...(mal ? { mal } : {}) },
  });
};

export const reqGetById = (id: string) => {
  return apiService.get<IAnime>(`/anime/${id}`);
};

export const reqUpdate = (id: string, payload: Partial<IAnime>) => {
  return apiService.put<IAnime>(`/anime/${id}`, payload);
};

export const reqUpdateEpisode = (id: string, episode: number) => {
  return apiService.put<IAnime>(`/anime/${id}`, {
    episode: episode <= 0 ? 0 : episode,
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

export interface ISyncMalResult {
  synced: number;
  failed: string[];
  total: number;
}

export const reqSyncToMal = () => {
  return apiService.post<ISyncMalResult>("/mal-user/sync");
};

export interface IDeleteMalResult {
  deleted: number;
  failed: string[];
  total: number;
}

export const reqDeleteMalList = () => {
  return apiService.post<IDeleteMalResult>("/mal-user/delete");
};
