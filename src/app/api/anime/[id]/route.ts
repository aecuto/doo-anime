import { AnimeModel } from "../../../../database/model";

import { NextRequest, NextResponse } from "next/server";

interface ISegment {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, seg: ISegment) {
  const { id } = await seg.params;

  const found = await AnimeModel.findOne({ _id: id });
  if (!found)
    return NextResponse.json({ message: "anime not found" }, { status: 404 });

  return NextResponse.json(found);
}

export async function PUT(request: NextRequest, seg: ISegment) {
  const { id } = await seg.params;

  const body = await request.json();

  if (body.name) {
    const exist = await AnimeModel.findOne({ name: body.name });
    if (exist && String(exist._id) !== id)
      return NextResponse.json(
        { message: "anime's name is exists" },
        { status: 400 }
      );
  }

  const data = await AnimeModel.findByIdAndUpdate(id, body, {
    new: true,
  });
  return NextResponse.json(data);
}

export async function DELETE(request: NextRequest, seg: ISegment) {
  const { id } = await seg.params;
  const data = await AnimeModel.findByIdAndDelete({ _id: id });
  return NextResponse.json(data);
}
