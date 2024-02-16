import axios from "axios";

export interface IAnimeDetails {
  mal_id: number;
  title: string;
  title_english: string;
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
  titles: { type: string; title: string }[];
  broadcast: {
    day: string;
    time: string;
    timezone: string;
    string: string;
  };
  type: string;
  airing: boolean;
}
interface IRespone {
  data: IAnimeDetails[];
}

export const getAnimeSearch = async (name: string) => {
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
export const getAnimeById = async (animeId: number) => {
  const url = `https://api.jikan.moe/v4/anime/${animeId}`;

  return axios.get<IResponeById>(url);
};
