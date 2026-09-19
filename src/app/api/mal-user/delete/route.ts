import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";

// Vercel Hobby allows up to 60s; deletion is chunked client-side so each
// request only drains one page and finishes well within limits.
export const maxDuration = 60;

const PAGE_SIZE = 50;
const CONCURRENCY = 4;
const RETRY_DELAY_MS = 800;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const deleteWithRetry = (animeId: number, token: string) =>
  usersMe.animelist
    .deleteStatus(animeId, token)
    .catch((error: { response?: { status?: number } }) => {
      const status = error?.response?.status;
      if (status === 429 || (status && status >= 500)) {
        return sleep(RETRY_DELAY_MS).then(() =>
          usersMe.animelist.deleteStatus(animeId, token),
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
      { error: "Sign in with MyAnimeList to manage your list." },
      { status: 401 },
    );
  }

  const token = session.token;

  let page: { node: { id: number; title: string } }[];

  try {
    const res = await usersMe.animelist.getPage(token, PAGE_SIZE);
    page = res.data.data;
  } catch {
    return NextResponse.json(
      { error: "Could not fetch your MyAnimeList. Please sign in again." },
      { status: 401 },
    );
  }

  const failed: string[] = [];
  let deleted = 0;

  await runPool(page, CONCURRENCY, async ({ node }) => {
    try {
      await deleteWithRetry(node.id, token);
      deleted += 1;
    } catch {
      failed.push(node.title);
    }
  });

  // The list is drained from the top: fetch the first page, delete it, repeat.
  // Stop when the list is empty, or when nothing progressed so permanently
  // failing entries cannot loop the client forever.
  const done = page.length === 0 || (deleted === 0 && failed.length > 0);

  return NextResponse.json({ deleted, failed, done });
}
