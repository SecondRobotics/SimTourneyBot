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
  logger.debug(`Saving field ${field} for match ${matchNumber}`);

  let match;
  try {
    match = await getMatchData(scheduleSheet, `Data${field}`, matchNumber);
  } catch (e) {
    logger.error(e);
    return;
  }

  logger.debug(`Saving match ${matchNumber} to sheet`);

  try {
    await updateMatch(matchesSheet, match);
  } catch (e) {
    logger.error(e);
    return;
  }
}

export async function buildMatchSheet(
  matchesSheet: GoogleSpreadsheetWorksheet,
  scheduleSheet: GoogleSpreadsheetWorksheet
) {
  logger.debug("Building match sheet");

  try {
    await copyScheduleToMatchesSheet(matchesSheet, scheduleSheet);
  } catch (e) {
    logger.error(e);
    return;
  }
}
