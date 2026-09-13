import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const VERIFIER_COOKIE = "mal_verifier";
export const STATE_COOKIE = "mal_state";
export const SESSION_COOKIE = "mal_session";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export const cookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge,
});

export const randomToken = () => randomBytes(32).toString("base64url");

// MAL only supports the "plain" PKCE method: code_challenge === code_verifier
export const createCodeChallenge = (codeVerifier: string) => codeVerifier;

interface ISessionPayload {
  uid: string;
  username: string;
  iat: number;
}

const sign = (value: string) =>
  createHmac("sha256", String(process.env.AUTH_SECRET)).update(value).digest("base64url");

export const serializeSession = (payload: ISessionPayload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
};

export const parseSession = (value?: string | null): ISessionPayload | null => {
  if (!value) return null;

  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expected = new Uint8Array(Buffer.from(sign(body)));
  const actual = new Uint8Array(Buffer.from(signature));
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as ISessionPayload;
    if (Date.now() / 1000 - payload.iat > SESSION_MAX_AGE) return null;
    return payload;
  } catch {
    return null;
  }
};
