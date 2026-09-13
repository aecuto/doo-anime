import { NextRequest, NextResponse } from "next/server";
import { AnimeModel } from "@/database/model";
import { parse } from "search-params";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";
import type { IItemAnime } from "@/types/anime";
import { STATUS } from "@/constants";

interface IList {
  status: string;
  user: string;
  mal?: string | boolean;
}

const MAL_STATUS: Record<string, STATUS> = {
  watching: STATUS.WATCHING,
  completed: STATUS.DONE,
  dropped: STATUS.DROPPED,
};

async function getMalList(req: NextRequest, status?: string) {
  const session = parseSession(req.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to view your list." },
      { status: 401 },
    );
  }

  try {
    const res = await usersMe.animelist.get(session.token);

    const list: IItemAnime[] = res.data.data
      .map(
        ({ node, list_status }) =>
          ({
            _id: `mal-${node.id}`,
            name: node.title,
            status: MAL_STATUS[list_status?.status ?? ""] ?? STATUS.WATCHING,
            episode: list_status?.num_episodes_watched ?? 0,
            totalEpisodes: node.num_episodes ?? 0,
            imageUrl:
              node.main_picture?.large ?? node.main_picture?.medium ?? "",
            animeId: node.id,
          }) as IItemAnime,
      )
      .filter((value) => (status ? value.status === status : true));

    return NextResponse.json(list);
  } catch {
    return NextResponse.json(
      { error: "Could not fetch your MyAnimeList. Please sign in again." },
      { status: 401 },
    );
  }
}

export async function GET(req: NextRequest) {
  const queryParams = parse(req.nextUrl.search);

  const { status, user, mal } = queryParams as unknown as IList;

  if (mal) {
    return getMalList(req, status);
  }

  const query = {
    status,
    $or: [
      {
        user,
      },
    ],
  };

  const data = await AnimeModel.find(query).sort({
    _id: -1,
  });

  return NextResponse.json(data);
}
