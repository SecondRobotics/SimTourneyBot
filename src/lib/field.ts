import fs from "fs/promises";
import fsSync from "fs";
import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import type { Match } from "./match";

const SUSTAINABILITY_BONUS_RP = 9;
const ACTIVATION_BONUS_RP = 32;

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

  // Count game pieces
  const piecesRed =
    parseInt(await fs.readFile(`${dataDirectory}/ABotC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/AMidC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/ATopC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TBotC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TMidC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TTopC_R.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TSuper_R.txt`, "utf8"));
  const piecesBlue =
    parseInt(await fs.readFile(`${dataDirectory}/ABotC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/AMidC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/ATopC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TBotC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TMidC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TTopC_B.txt`, "utf8")) +
    parseInt(await fs.readFile(`${dataDirectory}/TSuper_B.txt`, "utf8"));

  // Calculate endgame points
  const endRed =
    parseInt(await fs.readFile(`${dataDirectory}/TParkC_R.txt`, "utf8")) * 2 +
    parseInt(await fs.readFile(`${dataDirectory}/TDockC_R.txt`, "utf8")) * 6 +
    parseInt(await fs.readFile(`${dataDirectory}/TEngC_R.txt`, "utf8")) * 10;
  const endBlue =
    parseInt(await fs.readFile(`${dataDirectory}/TParkC_B.txt`, "utf8")) * 2 +
    parseInt(await fs.readFile(`${dataDirectory}/TDockC_B.txt`, "utf8")) * 6 +
    parseInt(await fs.readFile(`${dataDirectory}/TEngC_B.txt`, "utf8")) * 10;

  // Calculate charge station points
  const chargeRed =
    endRed +
    parseInt(await fs.readFile(`${dataDirectory}/ADockC_R.txt`, "utf8")) * 8 +
    parseInt(await fs.readFile(`${dataDirectory}/AEngC_R.txt`, "utf8")) * 12;
  const chargeBlue =
    endBlue +
    parseInt(await fs.readFile(`${dataDirectory}/ADockC_B.txt`, "utf8")) * 8 +
    parseInt(await fs.readFile(`${dataDirectory}/AEngC_B.txt`, "utf8")) * 12;

  // Count links
  const linksRed = parseInt(
    await fs.readFile(`${dataDirectory}/TLinkC_R.txt`, "utf8")
  );
  const linksBlue = parseInt(
    await fs.readFile(`${dataDirectory}/TLinkC_B.txt`, "utf8")
  );

  // Calculate ranking points
  const scoreRed = parseInt(
    await fs.readFile(`${dataDirectory}/Score_R.txt`, "utf8")
  );
  const scoreBlue = parseInt(
    await fs.readFile(`${dataDirectory}/Score_B.txt`, "utf8")
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
    await fs.readFile(`${dataDirectory}/Fouls_R.txt`, "utf8")
  );
  const penaltyBlue = parseInt(
    await fs.readFile(`${dataDirectory}/Fouls_B.txt`, "utf8")
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
    redAuto: parseInt(await fs.readFile(`${dataDirectory}/Auto_R.txt`, "utf8")),
    blueAuto: parseInt(
      await fs.readFile(`${dataDirectory}/Auto_B.txt`, "utf8")
    ),
    redTeleop: parseInt(
      await fs.readFile(`${dataDirectory}/Tele_R.txt`, "utf8")
    ),
    blueTeleop: parseInt(
      await fs.readFile(`${dataDirectory}/Tele_B.txt`, "utf8")
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

export async function setMatchNumber(matchNumber: number) {
  fsSync.existsSync("TourneyData/") || (await fs.mkdir("TourneyData/"));
  await fs.writeFile("TourneyData/MatchNumber.txt", `Quals ${matchNumber}`);
  await fs.writeFile(
    "TourneyData/PrevMatchNumber.txt",
    `Quals ${matchNumber - 1}`
  );
}
