import { Readable } from "stream";
import fetch from "node-fetch";
import { cookie } from "./cookie";

export interface ProgressReport {
  expected: number;
  downloaded: number;
}

export class Mp4Stream extends Readable {
  bytesDownloaded: number = 0;
  contentLength?: number;
  onProgress?: (progressReport: ProgressReport) => void;

  constructor(public url: string) {
    super();
  }

  private isRunning = false;
  async _read() {
    if (this.isRunning) return;

    this.isRunning = true;
    try {
      const response = await fetch(this.url, {
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7",
          range: "bytes=0-",
          referer: "https://vider.info/",
          "sec-fetch-dest": "video",
          "sec-fetch-mode": "no-cors",
          "sec-fetch-site": "same-site",
          cookie,
        },
      });

      this.contentLength = Number(response.headers.get("Content-Length"));

      response.body.on("data", (data) => {
        this.bytesDownloaded += data.length;
        if (this.onProgress)
          this.onProgress({
            downloaded: this.bytesDownloaded,
            expected: this.contentLength!,
          });
        this.push(data);
      });

      response.body.on("close", () => {
        this.push(null);
      });
    } catch (e) {
      this.destroy(e);
    }
  }
}
