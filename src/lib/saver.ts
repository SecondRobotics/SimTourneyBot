import type {
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { getMatchData } from "./field";
import { copyScheduleToMatchesSheet, updateMatch } from "./googleSheet";
import logger from "../config/logger";
import type { Match } from "./match";

export async function saveField(
  matchesSheet: GoogleSpreadsheetWorksheet,
  matchNumber: number,
  field: number,
  row: GoogleSpreadsheetRow
) {
  let match: Match;
  try {
    match = await getMatchData(row, `Data${field}`, matchNumber);
  } catch (e) {
    logger.error(e);
    return null;
  }

  try {
    await updateMatch(matchesSheet, match);
  } catch (e) {
    logger.error(e);
    return null;
  }

  return match;
}

export async function buildMatchSheet(
  matchesSheet: GoogleSpreadsheetWorksheet,
  scheduleSheet: GoogleSpreadsheetWorksheet
) {
  try {
    await copyScheduleToMatchesSheet(matchesSheet, scheduleSheet);
  } catch (e) {
    logger.error(e);
    return false;
  }

  return true;
}
