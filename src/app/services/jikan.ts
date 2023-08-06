import axios from "axios";

export interface IAnimeDetails {
  mal_id: number;
  title: string;
  episodes: number;
  status: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
}
interface IRespone {
  data: IAnimeDetails[];
}
export const getAnimeSearch = (name: string) => {
  const url =
    `https://api.jikan.moe/v4/anime?` +
    new URLSearchParams({
      q: name,
      sort: "desc",
    });

  return axios.get<IRespone>(url);
};

interface IResponeById {
  data: IAnimeDetails;
}
export const getAnimeById = (animeId: number) => {
  const url = `https://api.jikan.moe/v4/anime/${animeId}`;

  return axios.get<IResponeById>(url);
};
