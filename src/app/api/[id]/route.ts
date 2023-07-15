import { IWatching, WatchingModel } from "../../../database/model";
import { connectDB } from "../../../database/mongodb";

import { NextRequest, NextResponse } from "next/server";

interface ISegment {
  params: { id: string };
}

export async function GET(request: NextRequest, seg: ISegment) {
  await connectDB();

  const { id } = seg.params;

  const found = await WatchingModel.findOne({ _id: id });
  if (!found)
    return NextResponse.json({}, { status: 404, statusText: "not found" });

  return NextResponse.json(found);
}

export async function PUT(request: { body: IWatching }, seg: ISegment) {
  await connectDB();

  const { id } = seg.params;

  const data = await WatchingModel.findByIdAndUpdate(id, request.body, {
    new: true,
  });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, seg: ISegment) {
  await connectDB();

  const { id } = seg.params;
  const data = await WatchingModel.findByIdAndDelete({ _id: id });
  return NextResponse.json(data);
}
