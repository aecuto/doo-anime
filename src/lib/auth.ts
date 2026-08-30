import { betterAuth } from "better-auth";
import { genericOAuth } from "better-auth/plugins";

export const auth = betterAuth({
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "myanimelist",
          name: "MyAnimeList",

          clientId: process.env.MAL_CLIENT_ID!,
          clientSecret: process.env.MAL_CLIENT_SECRET!,

          authorizationUrl: "https://myanimelist.net/v1/oauth2/authorize",
          tokenUrl: "https://myanimelist.net/v1/oauth2/token",
          userInfoUrl: "https://api.myanimelist.net/v2/users/@me",

          scopes: [],
        },
      ],
    }),
  ],
});
