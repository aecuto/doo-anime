import { NextRequest, NextResponse } from "next/server";

import { UserModel } from "@/database/model";
import { SESSION_COOKIE, parseSession } from "../session";

export async function GET(request: NextRequest) {
  const session = parseSession(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const user = await UserModel.findById(session.uid);

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  return NextResponse.json(user);
}
