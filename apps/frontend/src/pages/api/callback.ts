import type { NextApiRequest, NextApiResponse } from "next";
import {fetchCurrentlyPlaying} from "../../util/api/fetchCurrentlyPlaying";

type Data = {
  access_token: string;
  token_type: 'Bearer';
  scope: string;
  expires_in: number;
  refresh_token: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    const params = new URLSearchParams({
      error: "state_mismatch",
    });
    res.redirect(`/#${params}`);
  } else {
    const client_id = process.env.CLIENT_ID || '';
    const client_secret = process.env.CLIENT_SECRET || '';
    const redirect_uri = "http://localhost:3000/api/callback";

    const params = new URLSearchParams({
      code: code as string,
      redirect_uri,
      grant_type: "authorization_code",
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
    const data = await fetchCurrentlyPlaying(token.access_token)
    res.status(200).json(data);
  }
}
