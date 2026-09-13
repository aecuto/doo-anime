import { IMyAnimeList } from "@/app/types/myanimelist";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.myanimelist.net/v2",
  headers: { "X-MAL-CLIENT-ID": process.env.MAL_CLIENT_ID },
});

const tokenInstance = axios.create({
  baseURL: "https://myanimelist.net/v1/oauth2",
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

export const exchangeToken = async (payload: {
  client_id: string;
  client_secret: string;
  grant_type: string;
  code: string;
  redirect_uri: string;
  code_verifier: string;
}) => {
  return tokenInstance.post<{ access_token?: string }>(
    "/token",
    new URLSearchParams(payload),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
  );
};

export interface IMyListEntry {
  node: {
    id: number;
    title: string;
    main_picture?: { large?: string; medium?: string };
    num_episodes?: number;
    list_status?: { status: string; num_episodes_watched: number };
  };
}

export interface IUpdateMyListStatus {
  status: string;
  num_watched_episodes?: number;
}

const withAuth = (accessToken: string) => ({
  headers: { Authorization: `Bearer ${accessToken}` },
});

export const usersMe = {
  get: (accessToken: string) =>
    instance.get<{ name?: string }>("/users/@me", withAuth(accessToken)),

  animelist: {
    get: (accessToken: string) =>
      instance.get<{ data: IMyListEntry[] }>("/users/@me/animelist", {
        params: {
          fields: "id,title,main_picture,num_episodes,list_status",
          limit: 1000,
        },
        ...withAuth(accessToken),
      }),

    deleteStatus: (animeId: number, accessToken: string) =>
      instance.delete(`/anime/${animeId}/my_list_status`, withAuth(accessToken)),

    updateStatus: (
      animeId: number,
      payload: IUpdateMyListStatus,
      accessToken: string,
    ) =>
      instance.put(
        `/anime/${animeId}/my_list_status`,
        new URLSearchParams({
          status: payload.status,
          num_watched_episodes: String(payload.num_watched_episodes ?? 0),
        }),
        {
          ...withAuth(accessToken),
          headers: {
            ...withAuth(accessToken).headers,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      ),
  },
};
