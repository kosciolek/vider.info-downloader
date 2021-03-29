import * as yargs from "yargs";
import { download } from "@vider-downloader/core";
import cliProgress from "cli-progress";
import colors from "colors";

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
    const bar = new cliProgress.SingleBar(
      {
        etaBuffer: 100,
        format: `Downloading ${urlOrCode} |${colors.cyan(
          "{bar}"
        )}| ${colors.red("{percentage}%")} || ${colors.blue(
          "{value}/{total} MBs"
        )} || ${colors.yellow("ETA: {eta}s")}`,
      },
      cliProgress.Presets.shades_classic
    );
    let isBarStarted = false;
    bar.start(100, 0);
    download(urlOrCode, {
      onProgress: ({ downloaded, expected }) => {
        if (!isBarStarted) {
          isBarStarted = true;
          bar.setTotal(expected);
        }

        bar.update(downloaded);
        if (downloaded === expected) {
          bar.stop();
        }
      },
    });
  }
).argv;
