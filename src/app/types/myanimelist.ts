export interface IMyAnimeList {
  id: number;
  title: string;
  main_picture: MainPicture;
  alternative_titles: AlternativeTitles;
  media_type: string;
  status: string;
  num_episodes: number;
  broadcast: Broadcast;
}

export interface MainPicture {
  medium: string;
  large: string;
}

export interface AlternativeTitles {
  synonyms: string[];
  en: string;
  ja: string;
}

export interface Broadcast {
  day_of_the_week: string;
  start_time: string;
}
