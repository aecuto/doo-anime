import { NextResponse } from "next/server";
import { AnimeModel, IAnime } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";
import { STATUS } from "@/app/constant";
import moment from "moment-timezone";
import { getAnimeById } from "../../myanimelist/api";

export async function GET() {
  await connectDB();

  const query = {
    animeId: { $ne: null },
    status: STATUS.WATCHING,
    updatedAt: { $lt: moment().subtract(1, "day").toDate() },
  };

  const list = await AnimeModel.find(query);

  for (const value of list) {
    const req = await getAnimeById(value.animeId);
    const anime = req.data;
    await AnimeModel.findByIdAndUpdate(value._id, {
      totalEpisodes: anime?.num_episodes || 0,
      imageUrl: anime?.main_picture?.large || "",
      animeId: anime?.id,
      name: anime?.title,
    } as IAnime);
  }

  return NextResponse.json({
    list: list.map((data) => data?.name),
    ok: 200,
  });
}
