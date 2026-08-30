import { apiService } from "./base";

export const reqAnimeSearch = (name: string) => {
  return apiService.get(`/myanimelist`, {
    params: { q: name },
  });
};

export const reqAnimeById = (id: string) => {
  return apiService.get(`/myanimelist/${id}`);
};
