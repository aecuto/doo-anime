import { IUser } from "@/database/model";
import { apiService } from "./base";

export const reqMe = (username: string) => {
  return apiService.get<IUser>(`/user/${username}`);
};
