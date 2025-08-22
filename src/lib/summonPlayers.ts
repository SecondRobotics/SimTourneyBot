import { ChannelType, type GuildBasedChannel, type Guild } from "discord.js";
import { getMatchPlayers } from "./googleSheet";
import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import logger from "../config/logger";

export async function summonPlayersForMatch(
  matchType: "Qual" | "Playoff",
  matchNumber: number | null,
  scheduleSheet: GoogleSpreadsheetWorksheet,
  guild: Guild | null,
  onDeck?: boolean
): Promise<string | undefined> {
  // If we don't have a match number, error out
  if (!matchNumber) {
    return "⚠️ It looks like there are no matches left!";
  }

  // Get the match data from the schedule sheet (discord ids)
  let players: string[];
  try {
    players = await getMatchPlayers(scheduleSheet, matchNumber);
  } catch (e) {
    logger.error(e);
    return "⚠️ Failed to get the match from the schedule sheet!";
  }

  const handleVoice = matchType === "Qual";
  let redChannel: GuildBasedChannel | undefined;
  let blueChannel: GuildBasedChannel | undefined;

  if (handleVoice) {
    // Find the voice channels for this match
    // Voice channels are named "🔴 Match _" and "🔵 Match _"
    redChannel = guild?.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildVoice &&
        channel.name === `🔴 Match ${matchNumber}`
    );
    blueChannel = guild?.channels.cache.find(
      (channel) =>
        channel.type === ChannelType.GuildVoice &&
        channel.name === `🔵 Match ${matchNumber}`
    );

    // If the voice channels don't exist, create them (in category id process.env.DISCORD_CATEGORY_ID)
    redChannel ??= await guild?.channels.create({
      name: `🔴 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
    blueChannel ??= await guild?.channels.create({
      name: `🔵 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });

    if (!redChannel || !blueChannel) {
      return "⚠️ Failed to create voice channels!";
    }
  }

  // Move players into the voice channels and send them a DM
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const member = await guild?.members.fetch(player);
    if (member) {
      if (i < 3) {
        if (member.voice.channel && redChannel)
          await member.voice
            .setChannel(redChannel.id)
            .catch(() => logger.error(`Failed to move ${member.user.tag}`));
        const server = redChannel ? `<#${redChannel.id}>` : `the game server`;
        await member
          .send(
            onDeck
              ? `🔴 You are on deck for ${matchType} Match ${matchNumber}, where you will be playing on the red alliance! Please join ${server}.`
              : `🔴 You are up in ${matchType} Match ${matchNumber} on the red alliance! Please join ${server}.`
          )
          .catch(() => logger.error(`Failed to send DM to ${member.user.tag}`));
      } else {
        if (member.voice.channel && blueChannel)
          await member.voice
            .setChannel(blueChannel.id)
            .catch(() => logger.error(`Failed to move ${member.user.tag}`));
        const server = blueChannel ? `<#${blueChannel.id}>` : `the game server`;
        await member
          .send(
            onDeck
              ? `🔵 You are on deck for ${matchType} Match ${matchNumber}, where you will be playing on the blue alliance! Please join ${server}.`
              : `🔵 You are up in ${matchType} Match ${matchNumber} on the blue alliance! Please join ${server}.`
          )
          .catch(() => logger.error(`Failed to send DM to ${member.user.tag}`));
      }
    }
  }

  return undefined;
}
