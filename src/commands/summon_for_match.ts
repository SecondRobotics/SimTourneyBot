import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { getSoonestUnplayedMatch } from "../lib/googleSheet";
import { summonPlayersForMatch } from "../lib/summonPlayers";
import { setMatchNumber } from "../lib/field";

export const data = new SlashCommandBuilder()
  .setName("summon_for_match")
  .setDescription("Summon players into voice channels for a match")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("match_type")
      .setDescription("The type of match to summon players for")
      .setRequired(false)
      .setChoices(
        { name: "Qual", value: "Qual" },
        { name: "Playoff", value: "Playoff" }
      )
  )
  .addIntegerOption((option) =>
    option
      .setName("match")
      .setDescription("The match number to summon players for")
      .setRequired(false)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  // Get the current match number based on the matches sheet
  let { matchNumber: nextMatchNumber, secondMatchNumber } =
    await getSoonestUnplayedMatch(interaction.client.matchesSheet);
  let matchType: "Qual" | "Playoff" = "Qual";
  if (!nextMatchNumber) {
    const playoffMatches = await getSoonestUnplayedMatch(
      interaction.client.playoffMatchesSheet
    );
    nextMatchNumber = playoffMatches.matchNumber;
    secondMatchNumber = playoffMatches.secondMatchNumber;
    matchType = "Playoff";
  }
  let matchNumber = nextMatchNumber;

  // If the user specified a match number, use that instead
  const matchNumberOption = interaction.options.getInteger("match");
  if (matchNumberOption) {
    matchNumber = matchNumberOption;
  }

  // If the user specified a match type, use that instead
  const matchTypeOption = interaction.options.getString("match_type");
  if (matchTypeOption) {
    matchType = matchTypeOption as "Qual" | "Playoff";
  }

  const res = await summonPlayersForMatch(
    matchType,
    matchNumber,
    matchType === "Qual"
      ? interaction.client.scheduleSheet
      : interaction.client.playoffScheduleSheet,
    interaction.guild
  );
  if (res) {
    await interaction.editReply(res);
    return;
  }

  if (matchNumber) await setMatchNumber(matchType, matchNumber);

  if (matchNumber === nextMatchNumber && secondMatchNumber) {
    const res = await summonPlayersForMatch(
      matchType,
      secondMatchNumber,
      matchType === "Qual"
        ? interaction.client.scheduleSheet
        : interaction.client.playoffScheduleSheet,
      interaction.guild,
      true
    );
    if (!res) {
      await interaction.followUp(
        `✅ Summoned players for ${matchType} matches ${nextMatchNumber} and ${secondMatchNumber}!`
      );
      return;
    }
  }

  await interaction.editReply(
    `✅ Summoned players for ${matchType} match ${matchNumber}!`
  );
};
