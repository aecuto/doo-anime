import { IAnime, AnimeModel } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";

import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const body = (await request.json()) as IAnime;

  const exist = await AnimeModel.findOne({ name: body.name, user: body.user });
  if (exist)
    return NextResponse.json(
      { message: "anime's name is exists" },
      { status: 400 }
    );

  const data = await AnimeModel.create(body);

  return NextResponse.json(data);
}
