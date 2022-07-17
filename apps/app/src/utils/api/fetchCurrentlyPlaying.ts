import { camelizeKeys } from "@/utils/camelizeKeys";
import { CamelCasedPropertiesDeep } from "type-fest";

type RawCurrentTrack = {
  item: {
    album: {
      name: string;
      images: Array<{ width: number; height: number; url: string }>;
    };
  };
};

type CurrentTrack = CamelCasedPropertiesDeep<RawCurrentTrack>;

export const fetchCurrentlyPlaying = async (accessToken: string) => {
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  try {
    const data = await res.json();
    return camelizeKeys(data) as CurrentTrack;
  } catch (err) {
    console.error(err);
    const data = {
      item: {
        album: {
          name: "",
          images: [{ url: "" }],
        },
      },
    };
    return camelizeKeys(data) as CurrentTrack;
  }
};
