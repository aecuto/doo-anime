import { NextResponse } from "next/server";
import { AnimeModel } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";
import { STATUS } from "@/app/constant";
import moment from "moment-timezone";
import axios from "axios";

const getAnimeById = async (animeId: number) => {
  const url = `https://api.jikan.moe/v4/anime/${animeId}`;

  return axios.get(url);
};

export async function GET() {
  await connectDB();

  const query = {
    animeId: { $ne: null },
    status: STATUS.WATCHING,
    updatedAt: { $lt: moment().subtract(1, "day").toDate() },
  };

  const list = await AnimeModel.find(query);

  const sync = [];
  for (const value of list) {
    const req = await getAnimeById(value.animeId);
    const anime = req.data.data;
    await AnimeModel.findByIdAndUpdate(value._id, {
      totalEpisodes: anime?.episodes || 0,
      imageUrl: anime?.images?.webp?.image_url || "",
      broadcast: anime?.broadcast,
      airing: anime?.airing,
    });
    sync.push(anime?.title);
  }

  return NextResponse.json({
    sync,
    ok: 200,
  });
}
