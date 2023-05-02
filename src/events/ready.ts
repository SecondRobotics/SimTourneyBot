import { type Client, Events } from "discord.js";
import logger from "src/config/logger";

// Called once when the bot is ready.
export const name = Events.ClientReady;
export const once = true;

export const execute = (client: Client) => {
  logger.info(`Ready! Logged in as ${client.user?.tag}`);
};
