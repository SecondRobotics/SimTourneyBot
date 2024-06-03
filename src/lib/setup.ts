import logger from "../config/logger";
import { setupConnection } from "./googleSheet";

export async function setupGoogleSheets() {
  let sheets;

  try {
    sheets = await setupConnection();
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }

  const sheetsUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_DOC_ID}`;
  logger.info(
    `Connected to Google Sheets at ${sheets.sheetTitle} (${sheetsUrl})`
  );

  return sheets;
}
