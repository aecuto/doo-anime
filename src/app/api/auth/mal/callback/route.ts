import { NextRequest, NextResponse } from "next/server";

import { UserModel } from "@/database/model";
import { usersMe, exchangeToken } from "../../../myanimelist/api";
import {
  SESSION_COOKIE,
  STATE_COOKIE,
  VERIFIER_COOKIE,
  cookieOptions,
  serializeSession,
} from "../session";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  const fail = (message: string) => {
    const response = NextResponse.redirect(
      new URL(`/?loginError=${encodeURIComponent(message)}`, origin),
    );
    response.cookies.set(VERIFIER_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
    response.cookies.set(STATE_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
    return response;
  };

  const clientId = process.env.MAL_CLIENT_ID;
  const clientSecret = process.env.MAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return fail("MyAnimeList login is not configured on the server.");
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const codeVerifier = request.cookies.get(VERIFIER_COOKIE)?.value;
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;

  if (oauthError) {
    return fail("MyAnimeList authorization was cancelled.");
  }

  if (
    !code ||
    !state ||
    !codeVerifier ||
    !expectedState ||
    state !== expectedState
  ) {
    return fail("Invalid login state. Please try again.");
  }

  const redirectUri = new URL(
    "/api/auth/mal/callback",
    origin,
  ).toString();

  let accessToken: string | undefined;

  try {
    const tokenResponse = await exchangeToken({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    });

    accessToken = tokenResponse.data.access_token;
  } catch (error: any) {
    console.error(
      "MAL token exchange failed:",
      error?.response?.status,
      error?.response?.data,
    );
    return fail("Could not exchange the authorization code with MyAnimeList.");
  }

  if (!accessToken) {
    return fail("MyAnimeList did not return an access token.");
  }

  let malName: string | undefined;

  try {
    const malUserResponse = await usersMe.get(accessToken);
    malName = malUserResponse.data.name;
  } catch {
    return fail("Could not fetch your MyAnimeList user.");
  }

  if (!malName) {
    return fail("MyAnimeList did not return a user name.");
  }

  let user = await UserModel.findOne({ username: malName });

  if (!user) {
    user = await UserModel.create({ username: malName });
  }

  const response = NextResponse.redirect(new URL("/", origin));

  response.cookies.set(
    SESSION_COOKIE,
    serializeSession({
      uid: user._id.toString(),
      username: user.username,
      token: accessToken,
      iat: Date.now() / 1000,
    }),
    cookieOptions(60 * 60 * 24 * 30),
  );
  response.cookies.set(VERIFIER_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
  response.cookies.set(STATE_COOKIE, "", { ...cookieOptions(), maxAge: 0 });

  return response;
}
