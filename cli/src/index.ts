import * as yargs from "yargs";
import { download } from "@vider-downloader/core";

yargs.command(
  ["download <urlOrCode>", "$0 <urlOrCode>"],
  "Download a video given its URL or code.",
  (builder) =>
    builder.positional("urlOrCode", {
      describe:
        "Either the full URL of a video (https://vider.info/vid/xxxxxx), or its code (xxxxxx)",
      type: "string",
      demandOption: true,
    }),
  ({ urlOrCode }) => {
    download(urlOrCode, { onProgress: console.log });
  }
).argv;
