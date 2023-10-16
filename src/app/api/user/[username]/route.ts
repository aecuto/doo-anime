import { UserModel } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";

import { NextRequest, NextResponse } from "next/server";

interface ISegment {
  params: { username: string };
}

export async function GET(request: NextRequest, seg: ISegment) {
  await connectDB();

  const { username } = seg.params;

  let data = await UserModel.findOne({ username });

  if (!data && username) {
    data = await UserModel.create({ username });
  }

  return NextResponse.json(data);
}
