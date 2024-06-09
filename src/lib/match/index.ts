import {
  type Match as chargedUpMatch,
  headerValues as chargedUpHeaderValues,
  matchToArray as chargedUpMatchToArray,
  saveMatchToRow as chargedUpSaveMatchToRow,
} from "./chargedUp";

let gameHeaderValues;
let gameMatchToArray;
let gameSaveMatchToRow;

switch (process.env.GAME_NAME) {
  case "CHARGED UP":
  default:
    gameHeaderValues = chargedUpHeaderValues;
    gameMatchToArray = chargedUpMatchToArray;
    gameSaveMatchToRow = chargedUpSaveMatchToRow;
    break;
}

export type Match = chargedUpMatch; // | otherMatch;
export const headerValues = gameHeaderValues;
export const matchToArray = gameMatchToArray;
export const saveMatchToRow = gameSaveMatchToRow;
