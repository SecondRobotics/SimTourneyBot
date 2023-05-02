import logger from "./config/logger";
import type { Client } from "discord.js";
import fs from "fs";
import path from "path";

/**
 * Automatically loads and registers all events from the events folder.
 * All events must be in the form of a `.ts` module with a `name`, `once`, and `execute` property.
 */
export const registerEvents = (client: Client) => {
  const eventFiles = fs
    .readdirSync(path.join(__dirname, "events"))
    .filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(__dirname, "events", file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const event = require(filePath);
    if (
      event &&
      typeof event === "object" &&
      "name" in event &&
      typeof event.name === "string" &&
      "once" in event &&
      typeof event.once === "boolean" &&
      "execute" in event &&
      typeof event.execute === "function"
    ) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    } else {
      logger.warn(`Invalid event file: ${filePath}`);
    }
  }
};
