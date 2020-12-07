import fetch from "node-fetch";
import {cookie} from "./cookie";

export const fetchVideoMetadata = async (videoCode:string) => {
  const res = await fetch(`https://vider.info/embed/video/${videoCode}`, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7",
      "cache-control": "max-age=0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "none",
      "referer": "https://vider.info/",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie
    }
  }).then(resp => resp.text());

  try{
    const [, number] = res.match(/data-video-url="https:\/\/stream\.vider\.info\/video\/(\d+)\/v\.mp4"/)!;
    const [, title] = res.match(/<meta name="title" content="(.*?)" \/>/)!;
    return {number, title};
  } catch (e) {
    throw new Error("Couldn't extract video number and video title.");
  }

}