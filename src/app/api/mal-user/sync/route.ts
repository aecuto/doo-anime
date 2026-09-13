import { NextRequest, NextResponse } from "next/server";
import { AnimeModel, IAnime } from "../../../../database/model";
import { STATUS } from "@/app/constant";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";

const MAL_STATUS: Record<string, string> = {
  [STATUS.WATCHING]: "watching",
  [STATUS.DROP]: "dropped",
  [STATUS.DONE]: "completed",
};

export async function POST(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to sync your list." },
      { status: 401 },
    );
  }

  const list = (await AnimeModel.find({
    user: session.uid,
    animeId: { $ne: null },
  })) as IAnime[];

  let synced = 0;
  const failed: string[] = [];

  for (const anime of list) {
    try {
      await usersMe.animelist.updateStatus(
        anime.animeId,
        {
          status: MAL_STATUS[anime.status] ?? "watching",
          num_watched_episodes: anime.episode || 0,
        },
        session.token,
      );
      synced += 1;
    } catch {
      failed.push(anime.name);
    }
  }

  return NextResponse.json({ synced, failed, total: list.length });
}
