import { NextRequest, NextResponse } from "next/server";
import { getAnimeSearch } from "./api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const res = await getAnimeSearch(searchParams.toString());

  return NextResponse.json(res.data.data.map((data) => ({ ...data.node })));
}
