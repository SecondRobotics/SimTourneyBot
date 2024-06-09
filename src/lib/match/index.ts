import type { GoogleSpreadsheetRow } from "google-spreadsheet";
import {
  type Match as chargedUpMatch,
  headerValues as chargedUpHeaderValues,
  matchToArray as chargedUpMatchToArray,
  saveMatchToRow as chargedUpSaveMatchToRow,
} from "./chargedUp";

import {
  type Match as crescendoMatch,
  headerValues as crescendoHeaderValues,
  matchToArray as crescendoMatchToArray,
  saveMatchToRow as crescendoSaveMatchToRow,
} from "./crescendo";

let gameHeaderValues: string[];
let gameMatchToArray: (match: never) => (string | number)[];
let gameSaveMatchToRow: (match: never, row: GoogleSpreadsheetRow) => void;

switch (process.env.GAME_NAME) {
  case "CHARGED UP":
    gameHeaderValues = chargedUpHeaderValues;
    gameMatchToArray = chargedUpMatchToArray;
    gameSaveMatchToRow = chargedUpSaveMatchToRow;
    break;
  case "CRESCENDO":
  default:
    gameHeaderValues = crescendoHeaderValues;
    gameMatchToArray = crescendoMatchToArray;
    gameSaveMatchToRow = crescendoSaveMatchToRow;
    break;
}

export type Match = chargedUpMatch | crescendoMatch;
export const headerValues = gameHeaderValues;
export const matchToArray = (match: Match) => {
  return gameMatchToArray(match as never);
};
export const saveMatchToRow = (match: Match, row: GoogleSpreadsheetRow) => {
  return gameSaveMatchToRow(match as never, row);
};
