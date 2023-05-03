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

  redPenalty: number;
  bluePenalty: number;
  redAuto: number;
  blueAuto: number;
  redTeleop: number;
  blueTeleop: number;
  redEnd: number;
  blueEnd: number;

  red1Contribution: number;
  red2Contribution: number;
  red3Contribution: number;
  blue1Contribution: number;
  blue2Contribution: number;
  blue3Contribution: number;

  redCargo: number;
  blueCargo: number;

  redRP: number;
  blueRP: number;
  redTiebreaker: number;
  blueTiebreaker: number;
  redBonusRP: number;
  blueBonusRP: number;
}

export function matchToArray(match: Match) {
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
    match.redPenalty,
    match.bluePenalty,
    match.redAuto,
    match.blueAuto,
    match.redTeleop,
    match.blueTeleop,
    match.redEnd,
    match.blueEnd,
    match.red1Contribution,
    match.red2Contribution,
    match.red3Contribution,
    match.blue1Contribution,
    match.blue2Contribution,
    match.blue3Contribution,
    match.redCargo,
    match.blueCargo,
    match.redRP,
    match.blueRP,
    match.redTiebreaker,
    match.blueTiebreaker,
    match.redBonusRP,
    match.blueBonusRP,
  ];
}

export const headerValues = [
  "Match Number",
  "Red 1",
  "Red 2",
  "Red 3",
  "Blue 1",
  "Blue 2",
  "Blue 3",
  "Red Score",
  "Blue Score",
  "Red Penalty",
  "Blue Penalty",
  "Red Auto",
  "Blue Auto",
  "Red Teleop",
  "Blue Teleop",
  "Red End",
  "Blue End",
  "Red 1 Contribution",
  "Red 2 Contribution",
  "Red 3 Contribution",
  "Blue 1 Contribution",
  "Blue 2 Contribution",
  "Blue 3 Contribution",
  "Red Cargo",
  "Blue Cargo",
  "Red RP",
  "Blue RP",
  "Red Tiebreaker",
  "Blue Tiebreaker",
  "Red Bonus RP",
  "Blue Bonus RP",
];

export function saveMatchToRow(match: Match, row: GoogleSpreadsheetRow) {
  row["Match Number"] = match.matchNumber;
  row["Red 1"] = match.red1;
  row["Red 2"] = match.red2;
  row["Red 3"] = match.red3;
  row["Blue 1"] = match.blue1;
  row["Blue 2"] = match.blue2;
  row["Blue 3"] = match.blue3;
  row["Red Score"] = match.redScore;
  row["Blue Score"] = match.blueScore;
  row["Red Penalty"] = match.redPenalty;
  row["Blue Penalty"] = match.bluePenalty;
  row["Red Auto"] = match.redAuto;
  row["Blue Auto"] = match.blueAuto;
  row["Red Teleop"] = match.redTeleop;
  row["Blue Teleop"] = match.blueTeleop;
  row["Red End"] = match.redEnd;
  row["Blue End"] = match.blueEnd;
  row["Red 1 Contribution"] = match.red1Contribution;
  row["Red 2 Contribution"] = match.red2Contribution;
  row["Red 3 Contribution"] = match.red3Contribution;
  row["Blue 1 Contribution"] = match.blue1Contribution;
  row["Blue 2 Contribution"] = match.blue2Contribution;
  row["Blue 3 Contribution"] = match.blue3Contribution;
  row["Red Cargo"] = match.redCargo;
  row["Blue Cargo"] = match.blueCargo;
  row["Red RP"] = match.redRP;
  row["Blue RP"] = match.blueRP;
  row["Red Tiebreaker"] = match.redTiebreaker;
  row["Blue Tiebreaker"] = match.blueTiebreaker;
  row["Red Bonus RP"] = match.redBonusRP;
  row["Blue Bonus RP"] = match.blueBonusRP;
}
