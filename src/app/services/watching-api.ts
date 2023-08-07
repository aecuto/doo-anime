import axios from "axios";
import { STATUS } from "../constant";
import { IWatching } from "@/database/model";
import { omit } from "lodash";

const instance = axios.create({
  baseURL: "/api",
});

export const reqCreate = (payload: Partial<IWatching>) => {
  return instance.post("/create", payload);
};

export const reqList = async (
  search: string,
  status: string,
  type: string,
  page: number,
  perPage: number,
  owner: string
) => {
  return instance.get<IWatching[]>("/list", {
    params: { search, status, type, page, perPage, owner },
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
