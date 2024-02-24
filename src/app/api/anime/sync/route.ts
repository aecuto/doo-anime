import { NextRequest, NextResponse } from "next/server";
import { AnimeModel } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";
import { getAnimeById } from "@/app/services/jikan";
import { STATUS } from "@/app/constant";
import moment from "moment-timezone";

export async function GET(req: NextRequest) {
  await connectDB();

  const query = {
    animeId: { $ne: null },
    status: STATUS.WATCHING,
  };

  const list = await AnimeModel.find(query);

  for (const value of list) {
    const req = await getAnimeById(value.animeId);
    const anime = req.data.data;
    await AnimeModel.findByIdAndUpdate(value._id, {
      totalEpisodes: anime?.episodes || 0,
      imageUrl: anime?.images?.webp?.image_url || "",
      broadcast: anime?.broadcast,
      airing: anime?.airing,
    });
  }

  return NextResponse.json({
    ok: 200,
    list,
  });
}
