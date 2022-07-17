import type { NextApiRequest, NextApiResponse } from "next";
import { fetchCurrentlyPlaying } from "../../util/api/fetchCurrentlyPlaying";

type Data = {
  // TODO
};

export const getCurrentlyPlayingTrackFromToken = async (
  refresh_token: string
) => {
  const client_id = process.env.CLIENT_ID || "";
  const client_secret = process.env.CLIENT_SECRET || "";

  const params = new URLSearchParams({
    refresh_token: refresh_token as string,
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

  const token = await tokenResponse.json();
  return await fetchCurrentlyPlaying(token.access_token);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = await getCurrentlyPlayingTrackFromToken(
    req.query.refresh_token as string
  );
  res.status(200).json(data);
}
