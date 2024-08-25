import fs from "fs/promises";
import fsSync from "fs";
import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import type { Match } from "../match/crescendo";

const MELODY_BONUS_RP = 30;
const ENSEMBLE_BONUS_RP = 15;

export async function getMatchData(
  scheduledMatch: GoogleSpreadsheetRow,
  dataDirectory: string,
  matchNumber: number
) {
  if (!fsSync.existsSync(dataDirectory)) {
    throw new Error(`Data directory ${dataDirectory} does not exist`);
  }

  if (!fsSync.existsSync(`${dataDirectory}/Score_R.txt`)) {
    throw new Error(
      `Data directory ${dataDirectory} is not populated with data`
    );
  }

  const redAlliance = [
    scheduledMatch["Red 1"],
    scheduledMatch["Red 2"],
    scheduledMatch["Red 3"],
  ];
  const blueAlliance = [
    scheduledMatch["Blue 1"],
    scheduledMatch["Blue 2"],
    scheduledMatch["Blue 3"],
  ];

  // // Sort player contributions (OPR)
  // const redAlphabetized = redAlliance.slice().sort();
  // const blueAlphabetized = blueAlliance.slice().sort();

  // const contribAlphabetized = fs
  //   .readFileSync(`${dataDirectory}/OPR.txt`, "utf8")
  //   .split("\n")
  //   .map((line) => line.split(": ")[1]);
  // const unsortedContribRed = contribAlphabetized.slice(0, 3);
  // const unsortedContribBlue = contribAlphabetized.slice(3, 6);
  // const contribRed = unsortedContribRed.slice();
  // const contribBlue = unsortedContribBlue.slice();

  // for (let i = 0; i < 3; i++) {
  //   const redIndex = redAlliance.indexOf(redAlphabetized[i]);
  //   const blueIndex = blueAlliance.indexOf(blueAlphabetized[i]);
  //   contribRed[redIndex] = unsortedContribRed[i];
  //   contribBlue[blueIndex] = unsortedContribBlue[i];
  // }

  // Count game pieces (notes)
  const piecesRed =
    parseInt(await fs.readFile(`${dataDirectory}/Aamp_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Aspeaker_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tamp_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tspeaker_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tspeakeramp_R.txt`, "utf8"));
  const piecesBlue =
    parseInt(await fs.readFile(`${dataDirectory}/Aamp_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Aspeaker_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tamp_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tspeaker_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/Tspeakeramp_B.txt`, "utf8"));

  // Calculate endgame points
  const endRed = parseInt(
    await fs.readFile(`${dataDirectory}/End_R.txt`, "utf8")
  );
  const endBlue = parseInt(
    await fs.readFile(`${dataDirectory}/End_B.txt`, "utf8")
  );

  // Calculate auto points
  const autoRed = parseInt(
    await fs.readFile(`${dataDirectory}/Auto_R.txt`, "utf8")
  );
  const autoBlue = parseInt(
    await fs.readFile(`${dataDirectory}/Auto_B.txt`, "utf8")
  );

  // Calculate ranking points
  const scoreRed = parseInt(
    await fs.readFile(`${dataDirectory}/Score_R.txt`, "utf8")
  );
  const scoreBlue = parseInt(
    await fs.readFile(`${dataDirectory}/Score_B.txt`, "utf8")
  );

  const rpRedBonus =
    (piecesRed >= MELODY_BONUS_RP ? 1 : 0) +
    (endRed >= ENSEMBLE_BONUS_RP ? 1 : 0);
  const rpRed =
    rpRedBonus + (scoreRed > scoreBlue ? 2 : scoreRed === scoreBlue ? 1 : 0);

  const rpBlueBonus =
    (piecesBlue >= MELODY_BONUS_RP ? 1 : 0) +
    (endBlue >= ENSEMBLE_BONUS_RP ? 1 : 0);
  const rpBlue =
    rpBlueBonus + (scoreBlue > scoreRed ? 2 : scoreBlue === scoreRed ? 1 : 0);

  // Calculate tiebreakers
  const penaltyRed =
    (parseInt(await fs.readFile(`${dataDirectory}/Fouls_R.txt`, "utf8")) +
      parseInt(await fs.readFile(`${dataDirectory}/Resets_R.txt`, "utf8"))) *
    5;
  const penaltyBlue =
    (parseInt(await fs.readFile(`${dataDirectory}/Fouls_B.txt`, "utf8")) +
      parseInt(await fs.readFile(`${dataDirectory}/Resets_B.txt`, "utf8"))) *
    5;

  const tiebreakerRed = scoreRed - penaltyRed;
  const tiebreakerBlue = scoreBlue - penaltyBlue;

  const match: Match = {
    matchNumber,
    red1: redAlliance[0],
    red2: redAlliance[1],
    red3: redAlliance[2],
    blue1: blueAlliance[0],
    blue2: blueAlliance[1],
    blue3: blueAlliance[2],
    redScore: scoreRed,
    blueScore: scoreBlue,
    redPenalty: penaltyRed,
    bluePenalty: penaltyBlue,
    redAuto: autoRed,
    blueAuto: autoBlue,
    redTeleop: parseInt(
      await fs.readFile(`${dataDirectory}/Tele_R.txt`, "utf8")
    ),
    blueTeleop: parseInt(
      await fs.readFile(`${dataDirectory}/Tele_B.txt`, "utf8")
    ),
    redEnd: endRed,
    blueEnd: endBlue,
    redGamePieces: piecesRed,
    blueGamePieces: piecesBlue,
    redRP: rpRed,
    blueRP: rpBlue,
    redTiebreaker: tiebreakerRed,
    blueTiebreaker: tiebreakerBlue,
    redBonusRP: rpRedBonus,
    blueBonusRP: rpBlueBonus,
  };

  return match;
}
