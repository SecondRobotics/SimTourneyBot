import "./config/env";
import logger from "./config/logger";
import { Client, Events, GatewayIntentBits } from "discord.js";

logger.info("Starting up...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.on(Events.ClientReady, (c) => {
  logger.info(`Client ready! Logged in as ${c.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
