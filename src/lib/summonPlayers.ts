import { ChannelType, type Guild } from "discord.js";
import { getMatchPlayers } from "./googleSheet";
import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export async function summonPlayersForMatch(
  matchNumber: number | null,
  scheduleSheet: GoogleSpreadsheetWorksheet,
  guild: Guild | null
): Promise<string | undefined> {
  // If we don't have a match number, error out
  if (!matchNumber) {
    return "⚠️ It looks like there are no matches left!";
  }

  // Get the match data from the schedule sheet (discord ids)
  const players = await getMatchPlayers(scheduleSheet, matchNumber);

  // Find the voice channels for this match
  // Voice channels are named "🔴 Match _" and "🔵 Match _"
  let redChannel = guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔴 Match ${matchNumber}`
  );
  let blueChannel = guild?.channels.cache.find(
    (channel) =>
      channel.type === ChannelType.GuildVoice &&
      channel.name === `🔵 Match ${matchNumber}`
  );

  // If the voice channels don't exist, create them (in category id process.env.DISCORD_CATEGORY_ID)
  if (!redChannel) {
    redChannel = await guild?.channels.create({
      name: `🔴 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
  }
  if (!blueChannel) {
    blueChannel = await guild?.channels.create({
      name: `🔵 Match ${matchNumber}`,
      type: ChannelType.GuildVoice,
      parent: process.env.DISCORD_CATEGORY_ID,
    });
  }

  if (!redChannel || !blueChannel) {
    return "⚠️ Failed to create voice channels!";
  }

  // Move players into the voice channels
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const member = await guild?.members.fetch(player);
    if (member && member.voice.channel) {
      if (i < 3) {
        await member.voice.setChannel(redChannel.id);
      } else {
        await member.voice.setChannel(blueChannel.id);
      }
    }
  }

  return undefined;
}
