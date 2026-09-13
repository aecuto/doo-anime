import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";
import type { IItemAnime } from "../../../components/Item";
import { STATUS } from "@/app/constant";

const UI_STATUS: Record<string, STATUS> = {
  watching: STATUS.WATCHING,
  completed: STATUS.DONE,
  dropped: STATUS.DROP,
};

export async function GET(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to view your list." },
      { status: 401 },
    );
  }

  try {
    const res = await usersMe.animelist.get(session.token);

    const list: IItemAnime[] = res.data.data.map(({ node }) => ({
      _id: `mal-${node.id}`,
      mal: true,
      name: node.title,
      status: UI_STATUS[node.list_status?.status ?? ""] ?? STATUS.WATCHING,
      episode: node.list_status?.num_episodes_watched ?? 0,
      totalEpisodes: node.num_episodes ?? 0,
      imageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? "",
      animeId: node.id,
    } as IItemAnime));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch your MyAnimeList. Please sign in again." },
      { status: 401 },
    );
  }
}
