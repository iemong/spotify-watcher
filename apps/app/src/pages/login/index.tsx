import React from "react";
import { GetServerSideProps } from "next";
import { randomBytes } from "crypto";

const Login: React.VFC = () => {
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const generateRandomString = (length: number) =>
    randomBytes(length).reduce((p, i) => p + (i % 32).toString(32), "");

  const state = generateRandomString(16);
  const scope = "user-read-currently-playing user-read-email";
  const client_id = process.env.CLIENT_ID || "";
  const redirect_uri = "http://localhost:3000/api/callback";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  });

  return {
    redirect: {
      permanent: true,
      destination: `https://accounts.spotify.com/authorize?${params}`,
    },
  };
};

export default Login;
