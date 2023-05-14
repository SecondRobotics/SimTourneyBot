import fs from "fs";
import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import type { Match } from "./match";

const SUSTAINABILITY_BONUS_RP = 9;
const ACTIVATION_BONUS_RP = 32;

export async function getMatchData(
  scheduledMatch: GoogleSpreadsheetRow,
  dataDirectory: string,
  matchNumber: number
) {
  if (!fs.existsSync(dataDirectory)) {
    throw new Error(`Data directory ${dataDirectory} does not exist`);
  }

  if (!fs.existsSync(`${dataDirectory}/Score_R.txt`)) {
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

  // Count game pieces
  const piecesRed =
    parseInt(fs.readFileSync(`${dataDirectory}/ABotC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/AMidC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/ATopC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TBotC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TMidC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TTopC_R.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TSuper_R.txt`, "utf8"));
  const piecesBlue =
    parseInt(fs.readFileSync(`${dataDirectory}/ABotC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/AMidC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/ATopC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TBotC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TMidC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TTopC_B.txt`, "utf8")) +
    parseInt(fs.readFileSync(`${dataDirectory}/TSuper_B.txt`, "utf8"));

  // Calculate endgame points
  const endRed =
    parseInt(fs.readFileSync(`${dataDirectory}/TParkC_R.txt`, "utf8")) * 2 +
    parseInt(fs.readFileSync(`${dataDirectory}/TDockC_R.txt`, "utf8")) * 6 +
    parseInt(fs.readFileSync(`${dataDirectory}/TEngC_R.txt`, "utf8")) * 10;
  const endBlue =
    parseInt(fs.readFileSync(`${dataDirectory}/TParkC_B.txt`, "utf8")) * 2 +
    parseInt(fs.readFileSync(`${dataDirectory}/TDockC_B.txt`, "utf8")) * 6 +
    parseInt(fs.readFileSync(`${dataDirectory}/TEngC_B.txt`, "utf8")) * 10;

  // Calculate charge station points
  const chargeRed =
    endRed +
    parseInt(fs.readFileSync(`${dataDirectory}/ADockC_R.txt`, "utf8")) * 8 +
    parseInt(fs.readFileSync(`${dataDirectory}/AEngC_R.txt`, "utf8")) * 12;
  const chargeBlue =
    endBlue +
    parseInt(fs.readFileSync(`${dataDirectory}/ADockC_B.txt`, "utf8")) * 8 +
    parseInt(fs.readFileSync(`${dataDirectory}/AEngC_B.txt`, "utf8")) * 12;

  // Count links
  const linksRed = parseInt(
    fs.readFileSync(`${dataDirectory}/TLinkC_R.txt`, "utf8")
  );
  const linksBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/TLinkC_B.txt`, "utf8")
  );

  // Calculate ranking points
  const scoreRed = parseInt(
    fs.readFileSync(`${dataDirectory}/Score_R.txt`, "utf8")
  );
  const scoreBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/Score_B.txt`, "utf8")
  );

  const rpRedBonus =
    (linksRed >= SUSTAINABILITY_BONUS_RP ? 1 : 0) +
    (chargeRed >= ACTIVATION_BONUS_RP ? 1 : 0);
  const rpRed =
    rpRedBonus + (scoreRed > scoreBlue ? 2 : scoreRed === scoreBlue ? 1 : 0);

  const rpBlueBonus =
    (linksBlue >= SUSTAINABILITY_BONUS_RP ? 1 : 0) +
    (chargeBlue >= ACTIVATION_BONUS_RP ? 1 : 0);
  const rpBlue =
    rpBlueBonus + (scoreBlue > scoreRed ? 2 : scoreBlue === scoreRed ? 1 : 0);

  // Calculate tiebreakers
  const penaltyRed = parseInt(
    fs.readFileSync(`${dataDirectory}/Fouls_R.txt`, "utf8")
  );
  const penaltyBlue = parseInt(
    fs.readFileSync(`${dataDirectory}/Fouls_B.txt`, "utf8")
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
    redAuto: parseInt(fs.readFileSync(`${dataDirectory}/Auto_R.txt`, "utf8")),
    blueAuto: parseInt(fs.readFileSync(`${dataDirectory}/Auto_B.txt`, "utf8")),
    redTeleop: parseInt(fs.readFileSync(`${dataDirectory}/Tele_R.txt`, "utf8")),
    blueTeleop: parseInt(
      fs.readFileSync(`${dataDirectory}/Tele_B.txt`, "utf8")
    ),
    redEnd: endRed,
    blueEnd: endBlue,
    redLinks: linksRed,
    blueLinks: linksBlue,
    redChargeStation: chargeRed,
    blueChargeStation: chargeBlue,
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

export function setMatchNumber(matchNumber: number) {
  fs.existsSync("TourneyData/") || fs.mkdirSync("TourneyData/");
  fs.writeFileSync("TourneyData/MatchNumber.txt", `Quals ${matchNumber}`);
}
