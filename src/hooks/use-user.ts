"use client";

import useSWR from "swr";

import { reqMe } from "@/services/user-api";

export const useMe = (username?: string) =>
  useSWR(
    username ? "me" : null,
    () => reqMe(username!).then((res) => res.data),
  );
