import type { GoogleSpreadsheetRow } from "google-spreadsheet";

export interface Match {
  matchNumber: number;

  red1: string;
  red2: string;
  red3: string;
  blue1: string;
  blue2: string;
  blue3: string;

  redScore: number;
  blueScore: number;
  redAuto: number;
  blueAuto: number;
  redTele: number;
  blueTele: number;
  redEnd: number; 
  blueEnd: number;  
  redBonusRP: number;
  blueBonusRP: number;
}

export const headerValues = [
  "Match",
  "Red 1",
  "Red 2",
  "Red 3",
  "Blue 1",
  "Blue 2",
  "Blue 3",
  "Red Score",
  "Blue Score",
  "Red Auto",
  "Blue Auto",
  "Red Tele",
  "Blue Tele",
  "Red End",
  "Blue End", 
  "Red Bonus RP",
  "Blue Bonus RP",
];

export function matchToArray(match: Match): (string | number)[] {
  return [
    match.matchNumber,
    match.red1,
    match.red2,
    match.red3,
    match.blue1,
    match.blue2,
    match.blue3,
    match.redScore,
    match.blueScore,
    match.redAuto,
    match.blueAuto,
    match.redTele,
    match.blueTele,
    match.redEnd,
    match.blueEnd,
    match.redBonusRP,
    match.blueBonusRP,
  ];
}

export function saveMatchToRow(match: Match, row: GoogleSpreadsheetRow) {
  row["Match"] = match.matchNumber;
  row["Red 1"] = match.red1;
  row["Red 2"] = match.red2;
  row["Red 3"] = match.red3;
  row["Blue 1"] = match.blue1;
  row["Blue 2"] = match.blue2;
  row["Blue 3"] = match.blue3;
  row["Red Score"] = match.redScore;
  row["Blue Score"] = match.blueScore;
  row["Red Auto"] = match.redAuto;
  row["Blue Auto"] = match.blueAuto;
  row["Red Tele"] = match.redTele;
  row["Blue Tele"] = match.blueTele;
  row["Red End"] = match.redEnd;
  row["Blue End"] = match.blueEnd;
  row["Red Bonus RP"] = match.redBonusRP;
  row["Blue Bonus RP"] = match.blueBonusRP;
}
