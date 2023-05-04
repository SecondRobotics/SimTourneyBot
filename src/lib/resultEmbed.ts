import { EmbedBuilder, type Guild } from "discord.js";
import type { Match } from "./match";

export async function sendMatchResultEmbed(guild: Guild, match: Match) {
  // TODO: Build the embed using the match data
  // const embed = new EmbedBuilder().setTitle(
  //   `Match ${match.matchNumber} Results`
  // );

  // Send embed to the results channel
  const channel = guild.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

  const redAlliance =
    '```${match.red1.padEnd(10, " ")}\n' +
    '${match.red2.padEnd(10, " ")}\n' +
    '${match.red3.padEnd(10, " ")\n```';
  const blueAlliance =
    '```${match.blue1.padEnd(10, " ")}\n' +
    '${match.blue2.padEnd(10, " ")}\n' +
    '${match.blue3.padEnd(10, " ")\n```';

  let redAllianceTitle = "";
  let blueAllianceTitle = "";
  let color = 0x888888;

  const redscore = match.redScore;
  const bluescore = match.blueScore;

  const breakdownTitle = "Match Breakdown";

  if (match.redScore > match.blueScore) {
    redAllianceTitle = "Red Alliance :trophy:";
    color = 0xff0000;
  } else {
    redAllianceTitle = "Red Alliance :red_square:";
  }

  if (match.blueScore > match.redScore) {
    blueAllianceTitle = ":trophy: Blue Alliance";
    color = 0x0000ff;
  } else {
    blueAllianceTitle = ":blue_square: Blue Alliance";
  }

  const breakdown =
    '```${match.redAuto.toString().padStart(3, " ")} |       auto      | ${match.blueAuto.toString().padEnd(3, " ")}    \n' +
    '${match.redTeleop.toString().padStart(3, " ")} |      teleop     | ${match.blueTeleop.toString().padEnd(3, " ")}    \n' +
    '${match.redEnd.toString().padStart(3, " ")} |     endgame     | ${match.blueEnd.toString().padEnd(3, " ")}    \n' +
    '${match.redPenalty.toString().padStart(3, " ")} |    penalties    | ${match.bluePenalty.toString().padEnd(3, " ")}    \n' +
    '${match.redGamePieces.toString().padStart(3, " ")} |   game pieces   | ${match.blueGamePieces.toString().padEnd(3, " ")}    \n';
  "    |                 |    \n" +
    '${match.redRP.toString().padStart(3, " ")} | ranking points  | ${match.blueRP.toString().padEnd(3, " ")}    ```';

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(
      "Match ${match.matchNumber} Results" +
        "            " +
        redscore.toString().padEnd(3, " ") +
        " - " +
        bluescore.toString().padEnd(3, " ")
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
