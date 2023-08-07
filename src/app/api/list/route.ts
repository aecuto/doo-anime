import { NextRequest, NextResponse } from "next/server";
import { WatchingModel } from "../../../database/model";
import { connectDB } from "../../../database/mongodb";
import { parse } from "search-params";

interface IList {
  status: string;
  type: string;
  search: string;
  perPage: string;
  page: string;
  owner: string;
}

export async function GET(req: NextRequest) {
  await connectDB();
  const queryParams = parse(req.nextUrl.search);

  const { status, type, search, perPage, page, owner } =
    queryParams as unknown as IList;

  const query = {
    status: { $regex: `.*${String(status || "")}.*`.replace("all", "") },
    type: { $regex: `.*${String(type || "")}.*`.replace("all", "") },
    name: { $regex: `(?i).*${String(search || "")}.*`.replace("+", " ") },
    owner,
  };

  const limit = Number(perPage);
  const skip = Number(perPage) * (Number(page) - 1);

  const data = await WatchingModel.find(query)
    .limit(limit)
    .skip(skip)
    .sort({ updatedAt: "desc", _id: -1 });

  return NextResponse.json(data);
}
