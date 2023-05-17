import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import {
  getMatch,
  getMatchPlayers,
  getSoonestUnplayedMatch,
} from "../lib/googleSheet";
import { saveField } from "../lib/saver";
import { summonPlayersForMatch } from "../lib/summonPlayers";
import { sendQualMatchEmbed } from "../lib/resultEmbed";
import { setMatchNumber } from "../lib/field";
import logger from "../config/logger";

export const data = new SlashCommandBuilder()
  .setName("save_match_results")
  .setDescription(
    "Save the results of a completed match, and get ready for the next one"
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false)
  .addIntegerOption((option) =>
    option
      .setName("field")
      .setDescription("The field the match was played on")
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(6)
  )
  .addIntegerOption((option) =>
    option
      .setName("match")
      .setDescription("The match number to save results for")
      .setRequired(false)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  // Get the current match number based on the matches sheet
  let { row, matchNumber } = await getSoonestUnplayedMatch(
    interaction.client.matchesSheet
  );

  // If the user specified a match number, use that instead
  const matchNumberOption = interaction.options.getInteger("match");
  if (matchNumberOption) {
    matchNumber = matchNumberOption;
    row = await getMatch(interaction.client.scheduleSheet, matchNumber);
  }

  // If we still don't have a match number, error out
  if (!matchNumber) {
    await interaction.editReply("⚠️ It looks like there are no matches left!");
    return;
  } else if (!row) {
    await interaction.editReply("⚠️ Could not find that match!");
    return;
  }

  // Get the field the match was played on
  const field = interaction.options.getInteger("field");
  if (!field) {
    await interaction.editReply("⚠️ You must specify a field!");
    return;
  }

  // Save the match results to the matches sheet
  const match = await saveField(
    interaction.client.matchesSheet,
    matchNumber,
    field,
    row
  );
  if (!match) {
    await interaction.editReply(
      "⚠️ Something went wrong saving the match results! (check the logs)"
    );
    return;
  }

  await interaction.editReply(`✅ Saved match ${matchNumber} results!`);

  // Send an embed with the match results
  if (interaction.guild) sendQualMatchEmbed(interaction.guild, match);

  // Get the match data from the schedule sheet (discord ids)
  const players = await getMatchPlayers(
    interaction.client.scheduleSheet,
    matchNumber
  );

  // Move players back to the lobby
  const lobbyChannel = interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === "🤖Event Lobby🤖"
  );
  if (lobbyChannel) {
    for (const player of players) {
      const member = await interaction.guild?.members.fetch(player);
      if (member && member.voice.channel) {
        await member.voice
          .setChannel(lobbyChannel.id)
          .catch(() =>
            logger.error(`Failed to move ${member.user.tag} back to the lobby`)
          );
      }
    }
  }

  // Delete the voice channels for this match
  // Voice channels are named "🔴 Match _" and "🔵 Match _"
  const redChannel = interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔴 Match ${matchNumber}`
  );
  const blueChannel = interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔵 Match ${matchNumber}`
  );
  if (redChannel) {
    await redChannel.delete();
  }
  if (blueChannel) {
    await blueChannel.delete();
  }

  // Get the next two match numbers based on the matches sheet
  const { matchNumber: nextMatchNumber, secondMatchNumber } =
    await getSoonestUnplayedMatch(interaction.client.matchesSheet);

  // Summon players for the next match
  const res = await summonPlayersForMatch(
    nextMatchNumber,
    interaction.client.scheduleSheet,
    interaction.guild
  );
  if (res) {
    await interaction.followUp(res);
    return;
  }

  if (nextMatchNumber) await setMatchNumber(nextMatchNumber);

  // If there is a second match, summon players for that one too
  if (secondMatchNumber) {
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

  await interaction.followUp(
    `✅ Summoned players for match ${nextMatchNumber}!`
  );
};
