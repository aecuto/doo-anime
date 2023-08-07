import { Schema, model, models } from "mongoose";

export interface IWatching {
  _id: string;
  name: string;
  status: string;
  type: string;
  link: string;
  episode: number;
  totalEpisodes: number;
  completed: Date;
  owner: string;
  animeId: number;
  imageUrl: string;
}

const schema = new Schema(
  {
    name: String,
    status: String,
    type: String,
    link: String,
    episode: Number,
    totalEpisodes: Number,
    completed: Date,
    owner: String,
    animeId: Number,
    imageUrl: String,
  },
  { timestamps: true }
);

export const WatchingModel =
  models.Watching || model<IWatching>("Watching", schema);
