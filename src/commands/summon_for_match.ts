import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";
import { getMatchPlayers, getSoonestUnplayedMatch } from "../lib/googleSheet";

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
  let { matchNumber } = await getSoonestUnplayedMatch(
    interaction.client.matchesSheet
  );

  // If the user specified a match number, use that instead
  const matchNumberOption = interaction.options.getInteger("match");
  if (matchNumberOption) {
    matchNumber = matchNumberOption;
  }

  // If we still don't have a match number, error out
  if (!matchNumber) {
    await interaction.editReply("⚠️ It looks like there are no matches left!");
    return;
  }

  // Get the match data from the schedule sheet (discord ids)
  const players = await getMatchPlayers(
    interaction.client.scheduleSheet,
    matchNumber
  );

  // Find the voice channels for this match
  // Voice channels are named "🔴 Match _" and "🔵 Match _"
  let redChannel = interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔴 Match ${matchNumber}`
  );
  let blueChannel = interaction.guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔵 Match ${matchNumber}`
  );

  // If the voice channels don't exist, create them (in category id process.env.DISCORD_CATEGORY_ID)
  if (!redChannel) {
    redChannel = await interaction.guild?.channels.create({
      name: `🔴 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
  }
  if (!blueChannel) {
    blueChannel = await interaction.guild?.channels.create({
      name: `🔵 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
  }

  if (!redChannel || !blueChannel) {
    await interaction.editReply("⚠️ Failed to create voice channels!");
    return;
  }

  // Move players into the voice channels
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const member = await interaction.guild?.members.fetch(player);
    if (member && member.voice.channel) {
      if (i < 3) {
        await member.voice.setChannel(redChannel.id);
      } else {
        await member.voice.setChannel(blueChannel.id);
      }
    }
  }

  await interaction.editReply(`✅ Summoned players for match ${matchNumber}!`);
};
