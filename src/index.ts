import "./config/env";
import "./config/client";
import logger from "./config/logger";
import { getCommands, registerCommands } from "./commandManager";
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./eventManager";

logger.info("Starting up...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Register bot slash commands.
client.commands = getCommands();
registerCommands(client.commands.map((c) => c.data.toJSON()));

// Register bot events.
registerEvents(client);

client.login(process.env.DISCORD_TOKEN);
