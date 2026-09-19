import { NextRequest, NextResponse } from "next/server";
import { AnimeModel } from "@/database/model";
import { STATUS } from "@/constants";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";

// Vercel Hobby allows up to 60s; sync is chunked client-side so each
// request only handles one small batch and finishes well within limits.
export const maxDuration = 60;

const MAL_STATUS: Record<string, string> = {
  [STATUS.WATCHING]: "watching",
  [STATUS.DROPPED]: "dropped",
  [STATUS.DONE]: "completed",
};

const BATCH_SIZE = 20;
const CONCURRENCY = 4;
const RETRY_DELAY_MS = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const updateWithRetry = (
  animeId: number,
  payload: { status: string; num_watched_episodes: number },
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

async function runPool<T>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<void>,
) {
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (index < items.length) {
        const item = items[index++];
        await task(item);
      }
    }),
  );
}

export async function POST(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to sync your list." },
      { status: 401 },
    );
  }

  const token = session.token;

  const body = (await request.json().catch(() => ({}))) as { cursor?: string };
  const cursor = typeof body.cursor === "string" ? body.cursor : undefined;

  const baseFilter = {
    user: session.uid,
    animeId: { $ne: null as null },
  };

  const batchFilter = {
    ...baseFilter,
    ...(cursor ? { _id: { $gt: cursor } } : {}),
  };

  const [total, batch] = await Promise.all([
    AnimeModel.countDocuments(baseFilter),
    AnimeModel.find(batchFilter)
      .sort({ _id: 1 })
      .limit(BATCH_SIZE)
      .select("name animeId status episode")
      .lean(),
  ]);

  const failed: string[] = [];
  let synced = 0;

  await runPool(batch, CONCURRENCY, async (anime) => {
    try {
      await updateWithRetry(
        anime.animeId,
        {
          status: MAL_STATUS[anime.status] ?? "watching",
          num_watched_episodes: anime.episode || 0,
        },
        token,
      );
      await AnimeModel.updateOne({ _id: anime._id }, { mal: true });
      synced += 1;
    } catch {
      failed.push(anime.name);
    }
  });

  const done = batch.length < BATCH_SIZE;

  return NextResponse.json({
    synced,
    failed,
    total,
    nextCursor: done ? null : String(batch[batch.length - 1]._id),
    done,
  });
}
