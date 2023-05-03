import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!");

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const sent = await interaction.reply({
    content: "Pong!",
    fetchReply: true,
  });
  interaction.editReply(
    `Pong! (${sent.createdTimestamp - interaction.createdTimestamp}ms)`
  );
};
