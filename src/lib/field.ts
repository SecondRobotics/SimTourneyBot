import fs from "fs";
import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getMatch } from "./googleSheet";
import type { Match } from "./match";

const CARGO_BONUS_RP = 60;
const ENDGAME_BONUS_RP = 22;

export async function getMatchData(
  scheduleSheet: GoogleSpreadsheetWorksheet,
  dataDirectory: string,
  matchNumber: number
) {
  if (!fs.existsSync(dataDirectory)) {
    throw new Error(`Data directory ${dataDirectory} does not exist`);
  }

  if (!fs.existsSync(`${dataDirectory}/ScoreR.txt`)) {
    throw new Error(
      `Data directory ${dataDirectory} is not populated with data`
    );
  }

  // Get the match from the schedule sheet
  const scheduledMatch = await getMatch(scheduleSheet, matchNumber);

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

  // Sort player contributions (OPR)
  const redAlphabetized = redAlliance.slice().sort();
  const blueAlphabetized = blueAlliance.slice().sort();

  const contribAlphabetized = fs
    .readFileSync(`${dataDirectory}/OPR.txt`, "utf8")
    .split("\n")
    .map((line) => line.split(": ")[1]);
  const unsortedContribRed = contribAlphabetized.slice(0, 3);
  const unsortedContribBlue = contribAlphabetized.slice(3, 6);
  const contribRed = unsortedContribRed.slice();
  const contribBlue = unsortedContribBlue.slice();

  for (let i = 0; i < 3; i++) {
    const redIndex = redAlliance.indexOf(redAlphabetized[i]);
    const blueIndex = blueAlliance.indexOf(blueAlphabetized[i]);
    contribRed[redIndex] = unsortedContribRed[i];
    contribBlue[blueIndex] = unsortedContribBlue[i];
  }

  // Count cargo
  const cargoRed =
    parseInt(fs.readFileSync(`${dataDirectory}/C_H_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/C_L_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/Auto_C_H_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/Auto_C_L_R.txt`, "utf8"));
  const cargoBlue =
    parseInt(fs.readFileSync(`${dataDirectory}/C_H_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/C_L_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/Auto_C_H_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/Auto_C_L_B.txt`, "utf8"));

  // Calculate ranking points
  const scoreRed = parseInt(
    fs.readFileSync(`${dataDirectory}/ScoreR.txt`, "utf8")
  );
  const scoreBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/ScoreB.txt`, "utf8")
  );

  const endRed = parseInt(fs.readFileSync(`${dataDirectory}/EndR.txt`, "utf8"));
  const endBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/EndB.txt`, "utf8")
  );

  const rpRedBonus =
    (endRed >= ENDGAME_BONUS_RP ? 1 : 0) + (cargoRed >= CARGO_BONUS_RP ? 1 : 0);
  const rpRed =
    rpRedBonus + (scoreRed > scoreBlue ? 2 : scoreRed === scoreBlue ? 1 : 0);

  const rpBlueBonus =
    (endBlue >= ENDGAME_BONUS_RP ? 1 : 0) +
    (cargoBlue >= CARGO_BONUS_RP ? 1 : 0);
  const rpBlue =
    rpBlueBonus + (scoreBlue > scoreRed ? 2 : scoreBlue === scoreRed ? 1 : 0);

  // Calculate tiebreakers
  const penaltyRed = parseInt(
    fs.readFileSync(`${dataDirectory}/PenR.txt`, "utf8")
  );
  const penaltyBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/PenB.txt`, "utf8")
  );

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
    redAuto: parseInt(fs.readFileSync(`${dataDirectory}/AutoR.txt`, "utf8")),
    blueAuto: parseInt(fs.readFileSync(`${dataDirectory}/AutoB.txt`, "utf8")),
    redTeleop: parseInt(fs.readFileSync(`${dataDirectory}/TeleR.txt`, "utf8")),
    blueTeleop: parseInt(fs.readFileSync(`${dataDirectory}/TeleB.txt`, "utf8")),
    redEnd: endRed,
    blueEnd: endBlue,
    red1Contribution: parseInt(contribRed[0]),
    red2Contribution: parseInt(contribRed[1]),
    red3Contribution: parseInt(contribRed[2]),
    blue1Contribution: parseInt(contribBlue[0]),
    blue2Contribution: parseInt(contribBlue[1]),
    blue3Contribution: parseInt(contribBlue[2]),
    redCargo: cargoRed,
    blueCargo: cargoBlue,
    redRP: rpRed,
    blueRP: rpBlue,
    redTiebreaker: tiebreakerRed,
    blueTiebreaker: tiebreakerBlue,
    redBonusRP: rpRedBonus,
    blueBonusRP: rpBlueBonus,
  };

  return match;
}

export function setMatchNumber(matchNumber: number) {
  fs.existsSync("TourneyData/") || fs.mkdirSync("TourneyData/");
  fs.writeFileSync("TourneyData/MatchNumber.txt", String(matchNumber));
}
