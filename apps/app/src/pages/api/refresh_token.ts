import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCurrentlyPlaying } from "../../utils/api/fetchCurrentlyPlaying";
import { CamelCasedPropertiesDeep } from "type-fest";
import { camelizeKeys } from "@/utils/camelizeKeys";
import prisma from "@/libs/prisma";

type RawToken = {
  access_token: string;
  token_type: "Bearer";
  scope: string;
  expires_in: number;
};

type Token = CamelCasedPropertiesDeep<RawToken>;

export const getCurrentlyPlayingTrackFromToken = async (key: string) => {
  const client_id = process.env.CLIENT_ID || "";
  const client_secret = process.env.CLIENT_SECRET || "";

  const user = await prisma.user.findUnique({
    where: { key },
  }).catch(() => {
    throw new Error('user not found')
  });

  if (user === null) {
    throw new Error('user not found')
  }

  const params = new URLSearchParams({
    refresh_token: user.refreshToken,
    grant_type: "refresh_token",
  });

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const token = camelizeKeys(await tokenResponse.json()) as Token;
  return await fetchCurrentlyPlaying(token.accessToken);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.query.uid === undefined) {
    res.status(404);
  }
  try {
    const data = await getCurrentlyPlayingTrackFromToken(req.query.uid as string);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: 'エラーが発生しました'}})
  }
}
