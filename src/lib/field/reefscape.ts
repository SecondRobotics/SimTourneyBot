import fs from "fs/promises";
import fsSync from "fs";
import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import type { Match } from "../match/reefscape";

const AUTO_RP_CORAL_SCORED = 6;
const AUTO_RP_LEAVE_ROBOTS = 3;
const CORAL_RP_CORAL_PER_LEVEL = 9;
const BARGE_RP_BARGE_POINTS = 24;

export async function getMatchData(
  scheduledMatch: GoogleSpreadsheetRow,
  dataDirectory: string,
  matchNumber: number
): Promise<Match> {
  if (!fsSync.existsSync(dataDirectory)) {
    throw new Error(`Data directory ${dataDirectory} does not exist`);
  }

  if (!fsSync.existsSync(`${dataDirectory}/Auto_leave_R.txt`)) {
    throw new Error(
      `Data directory ${dataDirectory} is not populated with data`
    );
  }

  const red1 = scheduledMatch["Red 1"];
  const red2 = scheduledMatch["Red 2"];
  const red3 = scheduledMatch["Red 3"];
  const blue1 = scheduledMatch["Blue 1"];
  const blue2 = scheduledMatch["Blue 2"];
  const blue3 = scheduledMatch["Blue 3"];

  // Read all the necessary files
  const [
    redAutoLeaveString,
    blueAutoLeaveString,
    redAutoL1String,
    redAutoL2String,
    redAutoL3String,
    redAutoL4String,
    blueAutoL1String,
    blueAutoL2String,
    blueAutoL3String,
    blueAutoL4String,
    redTeleL1String,
    redTeleL2String,
    redTeleL3String,
    redTeleL4String,
    blueTeleL1String,
    blueTeleL2String,
    blueTeleL3String,
    blueTeleL4String,
    redNetString,
    blueNetString,
    redTeleProcString,
    blueTeleProcString,
    redEndScoreString,
    blueEndScoreString,
    redMajFoulsString,
    blueMajFoulsString,
    redMinFoulsString,
    blueMinFoulsString,
    redResetsString,
    blueResetsString,
    redScoreString,
    blueScoreString,
  ] = await Promise.all([
    fs.readFile(`${dataDirectory}/Auto_leave_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_leave_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l1_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l2_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l3_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l4_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l1_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l2_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l3_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_l4_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l1_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l2_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l3_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l4_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l1_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l2_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l3_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_l4_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_net_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_net_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_proc_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_proc_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MajFouls_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MajFouls_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MinFouls_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MinFouls_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Resets_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Resets_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Score_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Score_B.txt`, "utf-8"),
  ]);

  // Parse the values
  const redLeaveCount = parseInt(redAutoLeaveString.trim());
  const blueLeaveCount = parseInt(blueAutoLeaveString.trim());
  const redAutoCoralCounts = [
    parseInt(redAutoL1String.trim()),
    parseInt(redAutoL2String.trim()),
    parseInt(redAutoL3String.trim()),
    parseInt(redAutoL4String.trim()),
  ];
  const blueAutoCoralCounts = [
    parseInt(blueAutoL1String.trim()),
    parseInt(blueAutoL2String.trim()),
    parseInt(blueAutoL3String.trim()),
    parseInt(blueAutoL4String.trim()),
  ];
  const redTeleCoralCounts = [
    parseInt(redTeleL1String.trim()),
    parseInt(redTeleL2String.trim()),
    parseInt(redTeleL3String.trim()),
    parseInt(redTeleL4String.trim()),
  ];
  const blueTeleCoralCounts = [
    parseInt(blueTeleL1String.trim()),
    parseInt(blueTeleL2String.trim()),
    parseInt(blueTeleL3String.trim()),
    parseInt(blueTeleL4String.trim()),
  ];
  const redAutoCoralCount = redAutoCoralCounts.reduce((a, b) => a + b, 0);
  const blueAutoCoralCount = blueAutoCoralCounts.reduce((a, b) => a + b, 0);
  const redAlgaeNetCount = parseInt(redNetString.trim());
  const blueAlgaeNetCount = parseInt(blueNetString.trim());
  const redAlgaeProcCount = parseInt(redTeleProcString.trim());
  const blueAlgaeProcCount = parseInt(blueTeleProcString.trim());
  const redBargeScore = parseInt(redEndScoreString.trim());
  const blueBargeScore = parseInt(blueEndScoreString.trim());
  const redMajFoulsCount = parseInt(redMajFoulsString.trim());
  const blueMajFoulsCount = parseInt(blueMajFoulsString.trim());
  const redMinFoulsCount = parseInt(redMinFoulsString.trim());
  const blueMinFoulsCount = parseInt(blueMinFoulsString.trim());
  const redResetsCount = parseInt(redResetsString.trim());
  const blueResetsCount = parseInt(blueResetsString.trim());
  const redScore = parseInt(redScoreString.trim());
  const blueScore = parseInt(blueScoreString.trim());

  // Calculate penalties
  const redPenalty =
    redMajFoulsCount * 6 + redMinFoulsCount * 2 + redResetsCount * 6;
  const bluePenalty =
    blueMajFoulsCount * 6 + blueMinFoulsCount * 2 + blueResetsCount * 6;

  // Calculate scores
  const redLeaveScore = redLeaveCount * 3;
  const blueLeaveScore = blueLeaveCount * 3;

  const redAutoCoralScore =
    redAutoCoralCounts[0] * 3 +
    redAutoCoralCounts[1] * 4 +
    redAutoCoralCounts[2] * 6 +
    redAutoCoralCounts[3] * 7;
  const blueAutoCoralScore =
    blueAutoCoralCounts[0] * 3 +
    blueAutoCoralCounts[1] * 4 +
    blueAutoCoralCounts[2] * 6 +
    blueAutoCoralCounts[3] * 7;

  const redAuto = redLeaveScore + redAutoCoralScore;
  const blueAuto = blueLeaveScore + blueAutoCoralScore;

  const redTeleCoralScore =
    redTeleCoralCounts[0] * 2 +
    redTeleCoralCounts[1] * 3 +
    redTeleCoralCounts[2] * 4 +
    redTeleCoralCounts[3] * 5;
  const blueTeleCoralScore =
    blueTeleCoralCounts[0] * 2 +
    blueTeleCoralCounts[1] * 3 +
    blueTeleCoralCounts[2] * 4 +
    blueTeleCoralCounts[3] * 5;

  const redCoralScore = redAutoCoralScore + redTeleCoralScore;
  const blueCoralScore = blueAutoCoralScore + blueTeleCoralScore;

  const redAlgaeScore = redAlgaeNetCount * 4 + redAlgaeProcCount * 6;
  const blueAlgaeScore = blueAlgaeNetCount * 4 + blueAlgaeProcCount * 6;

  // Calculate ranking points
  let redRP = 0;
  let blueRP = 0;
  let redBonusRP = 0;
  let blueBonusRP = 0;

  // Win RP
  if (redScore > blueScore) redRP += 3;
  else if (blueScore > redScore) blueRP += 3;
  else {
    redRP += 1;
    blueRP += 1;
  }

  // Auto RP - All robots leave and 6+ coral in auto
  if (
    redLeaveCount === AUTO_RP_LEAVE_ROBOTS &&
    redAutoCoralCount >= AUTO_RP_CORAL_SCORED
  ) {
    redRP += 1;
    redBonusRP += 1;
  }
  if (
    blueLeaveCount === AUTO_RP_LEAVE_ROBOTS &&
    blueAutoCoralCount >= AUTO_RP_CORAL_SCORED
  ) {
    blueRP += 1;
    blueBonusRP += 1;
  }

  // Coral RP - 9+ coral on each level
  const redCoralCounts = [
    redAutoCoralCounts[0] + redTeleCoralCounts[0],
    redAutoCoralCounts[1] + redTeleCoralCounts[1],
    redAutoCoralCounts[2] + redTeleCoralCounts[2],
    redAutoCoralCounts[3] + redTeleCoralCounts[3],
  ];
  const blueCoralCounts = [
    blueAutoCoralCounts[0] + blueTeleCoralCounts[0],
    blueAutoCoralCounts[1] + blueTeleCoralCounts[1],
    blueAutoCoralCounts[2] + blueTeleCoralCounts[2],
    blueAutoCoralCounts[3] + blueTeleCoralCounts[3],
  ];
  const redCoralRP = redCoralCounts.every(
    (level) => level >= CORAL_RP_CORAL_PER_LEVEL
  );
  const blueCoralRP = blueCoralCounts.every(
    (level) => level >= CORAL_RP_CORAL_PER_LEVEL
  );
  if (redCoralRP) {
    redRP += 1;
    redBonusRP += 1;
  }
  if (blueCoralRP) {
    blueRP += 1;
    blueBonusRP += 1;
  }

  // Barge RP - 24+ barge points
  if (redBargeScore >= BARGE_RP_BARGE_POINTS) {
    redRP += 1;
    redBonusRP += 1;
  }
  if (blueBargeScore >= BARGE_RP_BARGE_POINTS) {
    blueRP += 1;
    blueBonusRP += 1;
  }

  return {
    matchNumber,
    red1,
    red2,
    red3,
    blue1,
    blue2,
    blue3,
    redScore,
    blueScore,
    redPenalty,
    bluePenalty,
    redAuto,
    blueAuto,
    redLeave: redLeaveScore,
    blueLeave: blueLeaveScore,
    redCoral: redCoralScore,
    blueCoral: blueCoralScore,
    redAlgae: redAlgaeScore,
    blueAlgae: blueAlgaeScore,
    redBarge: redBargeScore,
    blueBarge: blueBargeScore,
    redRP,
    blueRP,
    redTiebreaker: redScore - redPenalty,
    blueTiebreaker: blueScore - bluePenalty,
    redBonusRP,
    blueBonusRP,
  };
}
