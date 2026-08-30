import { NextRequest, NextResponse } from "next/server";
import { getAnimeById } from "../api";

interface ISegment {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, seg: ISegment) {
  const { id } = await seg.params;

  const res = await getAnimeById(id);

  return NextResponse.json(res.data);
}
