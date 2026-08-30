import { IMyAnimeList } from "@/app/types/myanimelist";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.myanimelist.net/v2",
  headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
});

const fields =
  "fields=id,title,main_picture,alternative_titles,media_type,status,num_episodes,broadcast";

export const getAnimeSearch = async (queryString: string) => {
  let url = `/anime?${queryString}&${fields}`;

  return instance.get<{ data: { node: IMyAnimeList }[] }>(url);
};

export const getAnimeById = async (animeId: string) => {
  const url = `/anime/${animeId}?${fields}`;

  return instance.get<IMyAnimeList>(url);
};
