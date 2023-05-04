import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { getSoonestUnplayedMatch } from "../lib/googleSheet";
import { summonPlayersForMatch } from "../lib/summonPlayers";

export const data = new SlashCommandBuilder()
  .setName("summon_for_match")
  .setDescription("Summon players into voice channels for a match")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false)
  .addIntegerOption((option) =>
    option
      .setName("match")
      .setDescription("The match number to summon players for")
      .setRequired(false)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  // Get the current match number based on the matches sheet
  const { matchNumber: nextMatchNumber, secondMatchNumber } =
    await getSoonestUnplayedMatch(interaction.client.matchesSheet);
  let matchNumber = nextMatchNumber;

  // If the user specified a match number, use that instead
  const matchNumberOption = interaction.options.getInteger("match");
  if (matchNumberOption) {
    matchNumber = matchNumberOption;
  }

  const res = await summonPlayersForMatch(
    matchNumber,
    interaction.client.scheduleSheet,
    interaction.guild
  );
  if (res) {
    await interaction.editReply(res);
    return;
  }

  if (matchNumber === nextMatchNumber && secondMatchNumber) {
    const res = await summonPlayersForMatch(
      secondMatchNumber,
      interaction.client.scheduleSheet,
      interaction.guild,
      true
    );
    if (!res) {
      await interaction.followUp(
        `✅ Summoned players for matches ${nextMatchNumber} and ${secondMatchNumber}!`
      );
      return;
    }
  }

  await interaction.editReply(`✅ Summoned players for match ${matchNumber}!`);
};
