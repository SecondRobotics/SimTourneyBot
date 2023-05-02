import { Events, type Interaction } from "discord.js";
import logger from "src/config/logger";

export const name = Events.InteractionCreate;
export const once = false;

export const execute = async (interaction: Interaction) => {
  if (!interaction.isChatInputCommand()) return;
  logger.info(`${interaction.user.tag} called /${interaction.commandName}`);

  const command = interaction.client.commands.get(interaction.commandName);
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
};
