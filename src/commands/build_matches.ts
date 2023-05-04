import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { buildMatchSheet } from "../lib/saver";

export const data = new SlashCommandBuilder()
  .setName("build_match_sheet")
  .setDescription("Copies the match schedule to the match sheet")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  const res = await buildMatchSheet(
    interaction.client.matchesSheet,
    interaction.client.scheduleSheet
  );

  if (!res) {
    await interaction.editReply({
      content: "❌ Failed to update match sheet",
    });
    return;
  }

  await interaction.editReply({
    content: "✅ Match sheet updated!",
  });
};
