import fs from "fs/promises";
import fsSync from "fs";
import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import type { Match } from "../match/rebuilt";

const ENERGIZED_RP_THRESHOLD = 360;
const SUPERCHARGED_RP_THRESHOLD = 500;
const TRAVERSAL_RP_THRESHOLD = 50;
const AUTO_CLIMB_POINTS = 15;

export async function getMatchData(
  scheduledMatch: GoogleSpreadsheetRow,
  dataDirectory: string,
  matchNumber: number
): Promise<Match> {
  if (!fsSync.existsSync(dataDirectory)) {
    throw new Error(`Data directory ${dataDirectory} does not exist`);
  }

  if (!fsSync.existsSync(`${dataDirectory}/Auto_R.txt`)) {
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

  const [
    redAutoString,
    blueAutoString,
    redAutoFuelString,
    blueAutoFuelString,
    redAutoLvl1String,
    blueAutoLvl1String,
    redTeleString,
    blueTeleString,
    redTeleFuelString,
    blueTeleFuelString,
    redEndString,
    blueEndString,
    redScoreString,
    blueScoreString,
  ] = await Promise.all([
    fs.readFile(`${dataDirectory}/Auto_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_Fuel_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_Fuel_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_lvl_1_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Auto_lvl_1_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_Fuel_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Tele_Fuel_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/End_B.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Score_R.txt`, "utf-8"),
    fs.readFile(`${dataDirectory}/Score_B.txt`, "utf-8"),
  ]);

  // Parse values
  const redAuto = parseInt(redAutoString.trim());
  const blueAuto = parseInt(blueAutoString.trim());
  const redAutoFuel = parseInt(redAutoFuelString.trim());
  const blueAutoFuel = parseInt(blueAutoFuelString.trim());
  const redAutoLvl1 = parseInt(redAutoLvl1String.trim());
  const blueAutoLvl1 = parseInt(blueAutoLvl1String.trim());
  const redTele = parseInt(redTeleString.trim());
  const blueTele = parseInt(blueTeleString.trim());
  const redTeleFuel = parseInt(redTeleFuelString.trim());
  const blueTeleFuel = parseInt(blueTeleFuelString.trim());
  const redEnd = parseInt(redEndString.trim());
  const blueEnd = parseInt(blueEndString.trim());
  const redScore = parseInt(redScoreString.trim());
  const blueScore = parseInt(blueScoreString.trim());



  // Calculate total fuel (auto + tele)
  const redTotalFuel = redAutoFuel + redTeleFuel;
  const blueTotalFuel = blueAutoFuel + blueTeleFuel;

  // Calculate ranking points
  let redBonusRP = 0;
  let blueBonusRP = 0;


  // Energized RP - 360+ total fuel
  if (redTotalFuel >= ENERGIZED_RP_THRESHOLD) {
    redBonusRP += 1;
  }
  if (blueTotalFuel >= ENERGIZED_RP_THRESHOLD) {
    blueBonusRP += 1;
  }

  // Supercharged RP - 500+ total fuel
  if (redTotalFuel >= SUPERCHARGED_RP_THRESHOLD) {
    redBonusRP += 1;
  }
  if (blueTotalFuel >= SUPERCHARGED_RP_THRESHOLD) {
    blueBonusRP += 1;
  }

  // Traversal RP - 50+ climb points (end climb points + (auto climbs * 15))
  const redClimbPoints = redEnd + redAutoLvl1 * AUTO_CLIMB_POINTS;
  const blueClimbPoints = blueEnd + blueAutoLvl1 * AUTO_CLIMB_POINTS;
  if (redClimbPoints >= TRAVERSAL_RP_THRESHOLD) {
    redBonusRP += 1;
  }
  if (blueClimbPoints >= TRAVERSAL_RP_THRESHOLD) {
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
    redAuto,
    blueAuto,
    redTele,
    blueTele,
    redEnd,
    blueEnd,
    redBonusRP,
    blueBonusRP,
  };
}