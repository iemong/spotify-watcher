import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

const generateRandomString = (length: number) =>
  randomBytes(length).reduce((p, i) => p + (i % 32).toString(32), "");

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const state = generateRandomString(16);
  const scope = "user-read-currently-playing user-read-email";
  const client_id = process.env.CLIENT_ID || '';
  const redirect_uri = "http://localhost:3000/api/callback";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params}`);
}
