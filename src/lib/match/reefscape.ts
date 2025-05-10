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

  redLeave: number;
  blueLeave: number;
  redCoral: number;
  blueCoral: number;
  redAlgae: number;
  blueAlgae: number;
  redBarge: number;
  blueBarge: number;

  redRP: number;
  blueRP: number;
  redTiebreaker: number;
  blueTiebreaker: number;
  redBonusRP: number;
  blueBonusRP: number;
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
  "Red Leave",
  "Blue Leave",
  "Red Coral",
  "Blue Coral",
  "Red Algae",
  "Blue Algae",
  "Red Barge",
  "Blue Barge",
  "Red RP",
  "Blue RP",
  "Red Tiebreaker",
  "Blue Tiebreaker",
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
    match.redPenalty,
    match.bluePenalty,
    match.redAuto,
    match.blueAuto,
    match.redLeave,
    match.blueLeave,
    match.redCoral,
    match.blueCoral,
    match.redAlgae,
    match.blueAlgae,
    match.redBarge,
    match.blueBarge,
    match.redRP,
    match.blueRP,
    match.redTiebreaker,
    match.blueTiebreaker,
    match.redBonusRP,
    match.blueBonusRP,
  ];
}

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
  row["Red Leave"] = match.redLeave;
  row["Blue Leave"] = match.blueLeave;
  row["Red Coral"] = match.redCoral;
  row["Blue Coral"] = match.blueCoral;
  row["Red Algae"] = match.redAlgae;
  row["Blue Algae"] = match.blueAlgae;
  row["Red Barge"] = match.redBarge;
  row["Blue Barge"] = match.blueBarge;
  row["Red RP"] = match.redRP;
  row["Blue RP"] = match.blueRP;
  row["Red Tiebreaker"] = match.redTiebreaker;
  row["Blue Tiebreaker"] = match.blueTiebreaker;
  row["Red Bonus RP"] = match.redBonusRP;
  row["Blue Bonus RP"] = match.blueBonusRP;
}
