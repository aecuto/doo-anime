import { NextRequest, NextResponse } from "next/server";
import { AnimeModel } from "@/database/model";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";

export const maxDuration = 60;

const RETRY_DELAY_MS = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const updateWithRetry = (
  animeId: number,
  payload: { status?: string; num_watched_episodes: number },
  token: string,
) =>
  usersMe.animelist
    .updateStatus(animeId, payload, token)
    .catch((error: { response?: { status?: number } }) => {
      const status = error?.response?.status;
      if (status === 429 || (status && status >= 500)) {
        return sleep(RETRY_DELAY_MS).then(() =>
          usersMe.animelist.updateStatus(animeId, payload, token),
        );
      }
      throw error;
    });

interface IBody {
  animeId?: number;
  episode?: number;
  status?: string;
}

// Single-anime incremental sync used after local episode updates. Only the
// watched-episode count (and optionally the status) is pushed, so the rest of
// the MAL entry stays untouched.
export async function POST(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to sync your list." },
      { status: 401 },
    );
  }

  const body = (await request.json().catch(() => ({}))) as IBody;

  if (!body.animeId) {
    return NextResponse.json(
      { error: "animeId is required." },
      { status: 400 },
    );
  }

  try {
    await updateWithRetry(
      body.animeId,
      {
        ...(body.status ? { status: body.status } : {}),
        num_watched_episodes: body.episode ?? 0,
      },
      session.token,
    );
    await AnimeModel.updateOne(
      { user: session.uid, animeId: body.animeId },
      { mal: true },
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not update MyAnimeList. Use Sync to MAL later." },
      { status: 502 },
    );
  }
}
