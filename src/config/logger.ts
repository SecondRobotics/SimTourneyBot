import pino from "pino";
import fs from "fs";

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

const transport = pino.transport({
  targets: [
    {
      level: "debug",
      target: "pino-pretty",
      options: {
        levelFirst: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
    {
      level: "info",
      target: "pino/file",
      options: {
        destination: "./logs/log.json",
      },
    },
  ],
});
const logger = pino(transport);

export default logger;
