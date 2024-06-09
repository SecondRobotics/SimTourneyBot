import { type Client, Events } from "discord.js";
import logger from "../config/logger";

// Called once when the bot is ready.
export const name = Events.ClientReady;
export const once = true;

export const execute = (client: Client) => {
  logger.info(`Ready! Logged in as ${client.user?.tag}`);
  logger.info(
    `Configured for ${process.env.GAME_NAME} (${process.env.TEAMS_PER_ALLIANCE} player alliances)`
  );
  client.user?.setActivity("xRC Simulator");
};
