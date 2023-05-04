import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getMatchData } from "./field";
import { copyScheduleToMatchesSheet, updateMatch } from "./googleSheet";
import logger from "../config/logger";

export async function saveField(
  scheduleSheet: GoogleSpreadsheetWorksheet,
  matchesSheet: GoogleSpreadsheetWorksheet,
  matchNumber: number,
  field: number
) {
  let match;
  try {
    match = await getMatchData(scheduleSheet, `Data${field}`, matchNumber);
  } catch (e) {
    logger.error(e);
    return false;
  }

  try {
    await updateMatch(matchesSheet, match);
  } catch (e) {
    logger.error(e);
    return false;
  }

  return true;
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
