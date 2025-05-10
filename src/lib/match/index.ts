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

import {
  type Match as rapidReactMatch,
  headerValues as rapidReactHeaderValues,
  matchToArray as rapidReactMatchToArray,
  saveMatchToRow as rapidReactSaveMatchToRow,
} from "./rapidReact";

import {
  type Match as reefscapeMatch,
  headerValues as reefscapeHeaderValues,
  matchToArray as reefscapeMatchToArray,
  saveMatchToRow as reefscapeSaveMatchToRow,
} from "./reefscape";

let gameHeaderValues: string[];
let gameMatchToArray: (match: never) => (string | number)[];
let gameSaveMatchToRow: (match: never, row: GoogleSpreadsheetRow) => void;

switch (process.env.GAME_NAME) {
  case "RAPID REACT":
    gameHeaderValues = rapidReactHeaderValues;
    gameMatchToArray = rapidReactMatchToArray;
    gameSaveMatchToRow = rapidReactSaveMatchToRow;
    break;
  case "CHARGED UP":
    gameHeaderValues = chargedUpHeaderValues;
    gameMatchToArray = chargedUpMatchToArray;
    gameSaveMatchToRow = chargedUpSaveMatchToRow;
    break;
  case "CRESCENDO":
    gameHeaderValues = crescendoHeaderValues;
    gameMatchToArray = crescendoMatchToArray;
    gameSaveMatchToRow = crescendoSaveMatchToRow;
    break;
  case "REEFSCAPE":
  default:
    gameHeaderValues = reefscapeHeaderValues;
    gameMatchToArray = reefscapeMatchToArray;
    gameSaveMatchToRow = reefscapeSaveMatchToRow;
    break;
}

export type Match =
  | chargedUpMatch
  | crescendoMatch
  | rapidReactMatch
  | reefscapeMatch;
export const headerValues = gameHeaderValues;
export const matchToArray = (match: Match) => {
  return gameMatchToArray(match as never);
};
export const saveMatchToRow = (match: Match, row: GoogleSpreadsheetRow) => {
  return gameSaveMatchToRow(match as never, row);
};
