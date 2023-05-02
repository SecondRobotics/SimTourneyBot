import "./config/env";
import logger from "./config/logger";
import { getCommands, registerCommands } from "./commandManager";
import { Client, Events, GatewayIntentBits } from "discord.js";

logger.info("Starting up...");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = getCommands();
registerCommands(commands.map((c) => c.data.toJSON()));

client.on(Events.ClientReady, (c) => {
  logger.info(`Client ready! Logged in as ${c.user?.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  logger.info(`${interaction.user.tag} called /${interaction.commandName}`);

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.error(`Command not found: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
