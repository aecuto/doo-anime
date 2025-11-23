import { NextRequest, NextResponse } from "next/server";
import { AnimeModel } from "../../../../database/model";
import { connectDB } from "../../../../database/mongodb";
import { parse } from "search-params";

interface IList {
  status: string;
  user: string;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const queryParams = parse(req.nextUrl.search);

  const { status, user } = queryParams as unknown as IList;

  const query = {
    status,
    $or: [
      {
        user,
      },
    ],
  };

  const data = await AnimeModel.find(query).sort({
    _id: -1,
  });

  return NextResponse.json(data);
}
