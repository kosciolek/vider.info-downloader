import fetch from "node-fetch";
import {cookie} from "./cookie";

export const fetchMp4Url = async (videoNumber: string) => {
  const link = await fetch(
    `https://stream.vider.info/video/${videoNumber}/v.mp4`,
    {
      headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7",
        Range: "bytes=0-",
        "Sec-Fetch-Dest": "video",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-site",
        Cookie: cookie,

        Referer: "https://vider.info/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
      },
      redirect: "manual",
    }
  );
  const mp4Url = link.headers.get("Location")!;

  return mp4Url;
};
