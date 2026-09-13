import { NextRequest, NextResponse } from "next/server";

import {
  STATE_COOKIE,
  VERIFIER_COOKIE,
  cookieOptions,
  createCodeChallenge,
  randomToken,
} from "./session";

export async function GET(request: NextRequest) {
  const clientId = process.env.MAL_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "MAL_CLIENT_ID is not configured" },
      { status: 500 },
    );
  }

  const redirectUri = new URL(
    "/api/auth/mal/callback",
    request.nextUrl.origin,
  ).toString();

  const codeVerifier = randomToken();
  const state = randomToken();

  const authorizeUrl = new URL("https://myanimelist.net/v1/oauth2/authorize");
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("code_challenge", createCodeChallenge(codeVerifier));
  authorizeUrl.searchParams.set("code_challenge_method", "plain");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl.toString());

  response.cookies.set(
    VERIFIER_COOKIE,
    codeVerifier,
    cookieOptions(10 * 60),
  );
  response.cookies.set(STATE_COOKIE, state, cookieOptions(10 * 60));

  return response;
}
