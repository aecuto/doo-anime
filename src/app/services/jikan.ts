import axios from "axios";

export interface IAnimeDetails {
  title: string;
  episodes: number;
}
interface IRespone {
  data: IAnimeDetails[];
}
export const getAnimeDetails = (name: string) => {
  const url =
    `https://api.jikan.moe/v4/anime?` +
    new URLSearchParams({
      q: name,
      type: "tv",
    });

  return axios.get<IRespone>(url);
};
