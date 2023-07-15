import { IWatching, WatchingModel } from "../../../database/model";
import { connectDB } from "../../../database/mongodb";

import { NextResponse } from "next/server";

export async function POST(req: { body: IWatching }) {
  await connectDB();

  const body = req.body;
  const exist = await WatchingModel.findOne({ name: body.name });
  if (exist)
    return NextResponse.json(
      {},
      { status: 400, statusText: "this name is exists" }
    );

  const data = await WatchingModel.create(body);

  return NextResponse.json(data);
}
