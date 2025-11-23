import { Schema, model, models } from "mongoose";

interface Broadcast {
  day: string;
  time: string;
  timezone: string;
  string: string;
}

export interface IAnime {
  _id: string;
  updatedAt: Date;

  name: string;
  status: string;
  link: string;
  episode: number;
  totalEpisodes: number;
  completed: Date;
  animeId: number;
  imageUrl: string;
  user: string;
  airing: boolean;
  broadcast: Broadcast;
}

const AnimeSchema = new Schema(
  {
    name: String,
    status: String,
    link: String,
    episode: Number,
    totalEpisodes: Number,
    completed: Date,
    animeId: Number,
    imageUrl: String,
    airing: Boolean,
    broadcast: {
      day: String,
      time: String,
      timezone: String,
      string: String,
    },
    user: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

export const AnimeModel = models.anime || model<IAnime>("anime", AnimeSchema);

export interface IUser {
  _id: string;
  username: string;
}

const UserSchema = new Schema(
  {
    username: String,
  },
  { timestamps: true }
);

export const UserModel = models.user || model<IUser>("user", UserSchema);
