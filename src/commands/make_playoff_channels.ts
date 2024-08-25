import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import logger from "../config/logger";

export const data = new SlashCommandBuilder()
  .setName("make_playoff_channels_2")
  .setDescription("Creates voice channels for each alliance in the playoffs")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .addIntegerOption((option) =>
    option
      .setName("num_alliances")
      .setDescription("Number of alliances in the playoffs")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(8)
  )
  .setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  const numAlliances = interaction.options.getInteger("num_alliances") ?? 8;

  for (let i = 1; i <= numAlliances; i++) {
    const channel = await interaction.guild?.channels.create({
      name: `Alliance ${i}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
    if (!channel) {
      logger.error(`Failed to create voice channel for alliance ${i}`);
      await interaction.followUp(
        `❌ Failed to create voice channel for alliance ${i}`
      );
      return;
    }
  }

  await interaction.followUp(`✅ Successfully created playoff voice channels!`);
};
