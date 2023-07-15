import { Schema, model, models } from "mongoose";

export interface IWatching {
  _id: string;
  name: string;
  status: string;
  type: string;
  link: string;
  episode: number;
  completed: Date;
}

const schema = new Schema(
  {
    name: String,
    status: String,
    type: String,
    link: String,
    episode: Number,
    completed: Date,
  },
  { timestamps: true }
);

export const WatchingModel =
  models.Watching || model<IWatching>("Watching", schema);
