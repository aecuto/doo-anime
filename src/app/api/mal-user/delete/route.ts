import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, parseSession } from "../../auth/mal/session";
import { usersMe } from "../../myanimelist/api";

export async function POST(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session?.token) {
    return NextResponse.json(
      { error: "Sign in with MyAnimeList to manage your list." },
      { status: 401 },
    );
  }

  let entries: { node: { id: number; title: string } }[];

  try {
    const res = await usersMe.animelist.get(session.token);
    entries = res.data.data;
  } catch {
    return NextResponse.json(
      { error: "Could not fetch your MyAnimeList. Please sign in again." },
      { status: 401 },
    );
  }

  let deleted = 0;
  const failed: string[] = [];

  for (const { node } of entries) {
    try {
      await usersMe.animelist.deleteStatus(node.id, session.token);
      deleted += 1;
    } catch {
      failed.push(node.title);
    }
  }

  return NextResponse.json({ deleted, failed, total: entries.length });
}
