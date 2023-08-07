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
    return NextResponse.json({ message: "anime not found" }, { status: 404 });

  return NextResponse.json(found);
}

export async function PUT(request: NextRequest, seg: ISegment) {
  await connectDB();

  const { id } = seg.params;

  const body = await request.json();

  if (body.name) {
    const exist = await WatchingModel.findOne({ name: body.name });
    if (exist && String(exist._id) !== id)
      return NextResponse.json(
        { message: "anime's name is exists" },
        { status: 400 }
      );
  }

  const data = await WatchingModel.findByIdAndUpdate(id, body, {
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
