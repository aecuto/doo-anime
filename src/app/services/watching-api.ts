import axios from "axios";
import { STATUS } from "../constant";
import { IWatching } from "@/database/model";

const instance = axios.create({
  baseURL: "/api",
});

export const reqCreate = (payload: Partial<IWatching>) => {
  return instance.post("/create", payload);
};

export const reqList = (
  search: string,
  status: string,
  type: string,
  page: number,
  perPage: number,
  createdBy: string
) => {
  return instance.get<IWatching[]>("/list", {
    params: { search, status, type, page, perPage, createdBy },
  });
};

export const reqGetById = (id: string) => {
  return instance.get<IWatching>(`/${id}`);
};

export const reqUpdate = (id: string, payload: Partial<IWatching>) => {
  return instance.put<IWatching>(`/${id}`, payload);
};

export const reqUpdateEpisode = (id: string, episode: number) => {
  return instance.put<IWatching>(`/${id}`, {
    episode: episode <= 0 ? 0 : episode,
  });
};

export const reqUpdateComplete = (id: string) => {
  const newPayload = {
    completed: new Date(),
    status: STATUS.DONE,
  };
  return instance.put<IWatching>(`/${id}`, newPayload);
};

export const reqUpdateReplay = (id: string) => {
  const newPayload = {
    status: STATUS.WATCHING,
  };
  return instance.put<IWatching>(`/${id}`, newPayload);
};
