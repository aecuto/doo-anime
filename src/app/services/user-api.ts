import { apiService } from "./base";

export const reqMe = (username: string) => {
  return apiService.get(`/user/${username}`);
};
