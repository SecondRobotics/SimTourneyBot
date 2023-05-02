import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import logger from "../config/logger";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("Reloads a command.")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("command")
      .setDescription("The command to reload.")
      .setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const commandName = interaction.options
    .getString("command", true)
    .toLowerCase();
  const command = interaction.client.commands.get(commandName);

  if (!command) {
    interaction.reply(`There is no command with name \`${commandName}\`!`);
    return;
  }

  delete require.cache[require.resolve(`./${command.data.name}`)];

  try {
    interaction.client.commands.delete(command.data.name);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const newCommand = require(`./${command.data.name}`);
    interaction.client.commands.set(newCommand.data.name, newCommand);
    await interaction.reply({
      content: `Command \`${newCommand.data.name}\` was reloaded!`,
      ephemeral: true,
    });
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content:
        "There was an error while reloading a command: ```js\n" + error + "```",
      ephemeral: true,
    });
  }
};
