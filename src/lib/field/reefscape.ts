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
    redAutoLeave,
    blueAutoLeave,
    redAutoL1,
    redAutoL2,
    redAutoL3,
    redAutoL4,
    blueAutoL1,
    blueAutoL2,
    blueAutoL3,
    blueAutoL4,
    redNet,
    blueNet,
    redEndFile,
    blueEndFile,
    redMajFouls,
    blueMajFouls,
    redMinFouls,
    blueMinFouls,
    redResets,
    blueResets,
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
    fs.readFile(`${dataDirectory}/Tele_net_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_net_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MajFouls_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MajFouls_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MinFouls_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/MinFouls_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Resets_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Resets_B.txt`, "utf-8"),
  ]);

  // Parse the values
  const redLeave = parseInt(redAutoLeave.trim());
  const blueLeave = parseInt(blueAutoLeave.trim());
  const redAutoCoral = [
    parseInt(redAutoL1.trim()),
    parseInt(redAutoL2.trim()),
    parseInt(redAutoL3.trim()),
    parseInt(redAutoL4.trim()),
  ].reduce((a, b) => a + b, 0);
  const blueAutoCoral = [
    parseInt(blueAutoL1.trim()),
    parseInt(blueAutoL2.trim()),
    parseInt(blueAutoL3.trim()),
    parseInt(blueAutoL4.trim()),
  ].reduce((a, b) => a + b, 0);
  const redAlgae = parseInt(redNet.trim());
  const blueAlgae = parseInt(blueNet.trim());
  const redBarge = parseInt(redEndFile.trim());
  const blueBarge = parseInt(blueEndFile.trim());
  const redMajFoulsCount = parseInt(redMajFouls.trim());
  const blueMajFoulsCount = parseInt(blueMajFouls.trim());
  const redMinFoulsCount = parseInt(redMinFouls.trim());
  const blueMinFoulsCount = parseInt(blueMinFouls.trim());
  const redResetsCount = parseInt(redResets.trim());
  const blueResetsCount = parseInt(blueResets.trim());

  // Calculate penalties
  const redPenalty =
    redMajFoulsCount * 6 + redMinFoulsCount * 2 + redResetsCount * 6;
  const bluePenalty =
    blueMajFoulsCount * 6 + blueMinFoulsCount * 2 + blueResetsCount * 6;

  // Calculate scores
  const redAuto = redAutoCoral;
  const blueAuto = blueAutoCoral;
  const redScore = redAuto + redBarge - redPenalty;
  const blueScore = blueAuto + blueBarge - bluePenalty;

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
    redLeave === AUTO_RP_LEAVE_ROBOTS &&
    redAutoCoral >= AUTO_RP_CORAL_SCORED
  ) {
    redRP += 1;
    redBonusRP += 1;
  }
  if (
    blueLeave === AUTO_RP_LEAVE_ROBOTS &&
    blueAutoCoral >= AUTO_RP_CORAL_SCORED
  ) {
    blueRP += 1;
    blueBonusRP += 1;
  }

  // Coral RP - 9+ coral on each level
  const redCoralRP = [redAutoL1, redAutoL2, redAutoL3, redAutoL4].every(
    (level) => parseInt(level.trim()) >= CORAL_RP_CORAL_PER_LEVEL
  );
  const blueCoralRP = [blueAutoL1, blueAutoL2, blueAutoL3, blueAutoL4].every(
    (level) => parseInt(level.trim()) >= CORAL_RP_CORAL_PER_LEVEL
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
  if (redBarge >= BARGE_RP_BARGE_POINTS) {
    redRP += 1;
    redBonusRP += 1;
  }
  if (blueBarge >= BARGE_RP_BARGE_POINTS) {
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
    redLeave,
    blueLeave,
    redCoral: redAutoCoral,
    blueCoral: blueAutoCoral,
    redAlgae,
    blueAlgae,
    redBarge,
    blueBarge,
    redRP,
    blueRP,
    redTiebreaker: redScore - redPenalty,
    blueTiebreaker: blueScore - bluePenalty,
    redBonusRP,
    blueBonusRP,
  };
}
