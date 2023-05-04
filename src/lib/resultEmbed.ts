import { EmbedBuilder, type Guild } from "discord.js";
import type { Match } from "./match";

const codeBlock = (str: string) => `\`\`\`${str}\`\`\``;

/**
 * Sends an embed to the discord channel with the match results
 * @param guild server to send the embed to
 * @param match object containing match data
 */
export async function sendMatchResultEmbed(guild: Guild, match: Match) {
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

  let redAllianceTitle: string;
  let blueAllianceTitle: string;
  let color = 0x888888;

  const { redScore, blueScore } = match;

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

  // FIXME: Needs to use `template strings` in order to use ${} syntax
  // FIXME: Use the codeBlock() helper and consider mapping over arrays to better clean up the code
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
        redScore.toString().padEnd(3, " ") +
        " - " +
        blueScore.toString().padEnd(3, " ")
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
