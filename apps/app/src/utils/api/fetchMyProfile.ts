import type { CamelCasedPropertiesDeep } from "type-fest";
import { camelizeKeys } from "@/utils/camelizeKeys";

type RawProfile = {
  display_name: string;
  email: string;
  id: string;
};

type Profile = CamelCasedPropertiesDeep<RawProfile>;

export const fetchMyProfile = async (accessToken: string) => {
  const res = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return camelizeKeys(data) as Profile;
};
