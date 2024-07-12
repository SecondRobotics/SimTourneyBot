import { EmbedBuilder, type Guild } from "discord.js";
import type { Match } from "../match/rapidReact";
import { PLAYOFF_MATCHES_BEFORE_FINALS } from "../field";

const codeBlock = (str: string) => `\`\`\`\n${str}\n\`\`\``;

/**
 * Sends an embed to the discord channel with the match results
 * @param guild server to send the embed to
 * @param match object containing match data
 */
async function sendMatchResultEmbed(
  guild: Guild,
  match: Match,
  matchTitle: string
) {
  // Get the channel to send the embed to
  const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  const redAlliance = codeBlock(
    [match.red1, match.red2, match.red3]
      .map((x) => x.padEnd(10, " "))
      .join("\n")
  );
  const blueAlliance = codeBlock(
    [match.blue1, match.blue2, match.blue3]
      .map((x) => x.padEnd(10, " "))
      .join("\n")
  );

  const breakdownTitle = "Match Breakdown";
  let redAllianceTitle = "Red Alliance :red_square:";
  let blueAllianceTitle = ":blue_square: Blue Alliance";
  let color = 0x888888;

  if (match.redScore > match.blueScore) {
    redAllianceTitle = "Red Alliance :trophy:";
    color = 0xff0000;
  }

  if (match.blueScore > match.redScore) {
    blueAllianceTitle = ":trophy: Blue Alliance";
    color = 0x0000ff;
  }

  const {
    redAuto,
    redTeleop,
    redEnd,
    redPenalty,
    redGamePieces,
    redRP,
    blueAuto,
    blueTeleop,
    blueEnd,
    bluePenalty,
    blueGamePieces,
    blueRP,
  } = match;

  const breakdown = codeBlock(
    [
      [redAuto, " |      auto       | ", blueAuto],
      [redTeleop, " |     teleop      | ", blueTeleop],
      [redEnd, " |     endgame     | ", blueEnd],
      [redPenalty, " |    penalties    | ", bluePenalty],
      [redGamePieces, " |   game pieces   | ", blueGamePieces],
      ["", " |                 | ", ""],
      [redRP, " | ranking points  | ", blueRP],
    ]
      .map(
        (x) =>
          x[0].toString().padStart(3, " ") +
          x[1] +
          x[2].toString().padEnd(3, " ")
      )
      .join("\n")
  );

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(
      `${matchTitle.padEnd(24, " ")} ${match.redScore
        .toString()
        .padEnd(3, " ")} - ${match.blueScore.toString().padEnd(3, " ")}`
    )
    .addFields(
      { name: redAllianceTitle, value: redAlliance, inline: true },
      { name: blueAllianceTitle, value: blueAlliance, inline: true },
      { name: breakdownTitle, value: breakdown, inline: false }
    )
    .setTimestamp();

  if (channel?.isTextBased()) {
    await channel.send({ embeds: [embed] });
  }
}

export async function sendQualMatchEmbed(guild: Guild, match: Match) {
  await sendMatchResultEmbed(guild, match, `Qual ${match.matchNumber} Results`);
}

export async function sendPlayoffMatchEmbed(guild: Guild, match: Match) {
  await sendMatchResultEmbed(
    guild,
    match,
    match.matchNumber > PLAYOFF_MATCHES_BEFORE_FINALS
      ? `Finals ${match.matchNumber - PLAYOFF_MATCHES_BEFORE_FINALS} Results`
      : `Playoff ${match.matchNumber} Results`
  );
}
