import { UserModel } from "../../../../database/model";

import { NextRequest, NextResponse } from "next/server";

interface ISegment {
  params: Promise<{ username: string }>;
}

export async function GET(request: NextRequest, seg: ISegment) {
  const { username } = await seg.params;

  let data = await UserModel.findOne({ username });

  if (!data && username) {
    data = await UserModel.create({ username });
  }

  return NextResponse.json(data);
}
