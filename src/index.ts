import "./config/env";
import "./config/client";
import { getCommands, registerCommands } from "./commandManager";
import { Client, GatewayIntentBits } from "discord.js";
import { registerEvents } from "./eventManager";
import { setupGoogleSheets } from "./lib/setup";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Setup Google Sheets connection.
setupGoogleSheets().then((sheets) => {
  client.scheduleSheet = sheets.scheduleSheet;
  client.matchesSheet = sheets.matchesSheet;
  client.alliancesSheet = sheets.alliancesSheet;
  client.playoffsSheet = sheets.playoffsSheet;
});

// Register bot slash commands.
client.commands = getCommands();
registerCommands(client.commands.map((c) => c.data.toJSON()));

// Register bot events.
registerEvents(client);

client.login(process.env.DISCORD_TOKEN);
