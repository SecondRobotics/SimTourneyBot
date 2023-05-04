import { EmbedBuilder, type Guild } from "discord.js";
import type { Match } from "./match";

export async function sendMatchResultEmbed(guild: Guild, match: Match) {
  // TODO: Build the embed using the match data
  const embed = new EmbedBuilder().setTitle(
    `Match ${match.matchNumber} Results`
  );

  // Send embed to the results channel
  const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);
  if (channel?.isTextBased()) {
    await channel.send({ embeds: [embed] });
  }
}
