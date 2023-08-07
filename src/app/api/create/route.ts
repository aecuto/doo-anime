import { IWatching, WatchingModel } from "../../../database/model";
import { connectDB } from "../../../database/mongodb";

import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();

  const body = (await request.json()) as IWatching;

  const exist = await WatchingModel.findOne({ name: body.name });
  if (exist)
    return NextResponse.json(
      { message: "anime's name is exists" },
      { status: 400 }
    );

  const data = await WatchingModel.create(body);

  return NextResponse.json(data);
}
