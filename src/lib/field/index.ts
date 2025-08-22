import fs from "fs/promises";
import fsSync from "fs";
import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { getMatchPlayers } from "../googleSheet";

import { getMatchData as chargedUpGetMatchData } from "./chargedUp";
import { getMatchData as crescendoGetMatchData } from "./crescendo";
import { getMatchData as rapidReactGetMatchData } from "./rapidReact";
import { getMatchData as reefscapeGetMatchData } from "./reefscape";

export const PLAYOFF_MATCHES_BEFORE_FINALS = 13;

export async function setMatchNumber(
  matchType: string,
  matchNumber: number,
  matchesSheet: GoogleSpreadsheetWorksheet
) {
  const type =
    matchType === "Qual"
      ? "Quals"
      : matchNumber > PLAYOFF_MATCHES_BEFORE_FINALS
      ? "Finals"
      : "Playoff";

  fsSync.existsSync("TourneyData/") || (await fs.mkdir("TourneyData/"));
  await fs.writeFile("TourneyData/MatchNumber.txt", `${type} ${matchNumber}`);
  await fs.writeFile(
    "TourneyData/PrevMatchNumber.txt",
    `${type} ${matchNumber - 1}`
  );

  let redPlayers: string[] = [];
  let bluePlayers: string[] = [];
  try {
    const players = await getMatchPlayers(matchesSheet, matchNumber);
    redPlayers = players.slice(0, process.env.TEAMS_PER_ALLIANCE);
    bluePlayers = players.slice(process.env.TEAMS_PER_ALLIANCE);
  } catch {
    // Likely no matches left, so we'll just write empty files
  }

  await fs.writeFile("TourneyData/RedPlayers.txt", redPlayers.join("\n"));
  await fs.writeFile("TourneyData/BluePlayers.txt", bluePlayers.join("\n"));
}

let gameGetMatchData;

switch (process.env.GAME_NAME) {
  case "RAPID REACT":
    gameGetMatchData = rapidReactGetMatchData;
    break;
  case "CHARGED UP":
    gameGetMatchData = chargedUpGetMatchData;
    break;
  case "CRESCENDO":
    gameGetMatchData = crescendoGetMatchData;
    break;
  case "REEFSCAPE":
  default:
    gameGetMatchData = reefscapeGetMatchData;
    break;
}

export const getMatchData = gameGetMatchData;
