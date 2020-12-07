import { fetchVideoMetadata } from "./fetchVideoMetadata";
import { fetchMp4Url } from "./fetchMp4Url";
import { Mp4Stream } from "./Mp4Stream";
import { createWriteStream } from "fs";
import {parseVideoCode} from "./parseVideoCode";

export const download = async (
  urlOrCode: string,
  opts?: { filename?: string; onProgress?: Mp4Stream["onProgress"] }
) => {
  const code = parseVideoCode(urlOrCode);
  if (!code) throw new Error("Invalid video url or code.");

  const { number, title } = await fetchVideoMetadata(code);
  const url = await fetchMp4Url(number);

  const stream = new Mp4Stream(url);
  stream.onProgress = opts?.onProgress;

  const fileStream = createWriteStream(opts?.filename || `${title}.mp4`);

  stream.pipe(fileStream);
};
