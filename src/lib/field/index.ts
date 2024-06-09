import fs from "fs/promises";
import fsSync from "fs";

import { getMatchData as chargedUpGetMatchData } from "./chargedUp";

export const PLAYOFF_MATCHES_BEFORE_FINALS = 13;

export async function setMatchNumber(matchType: string, matchNumber: number) {
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
}

let gameGetMatchData;

switch (process.env.GAME_NAME) {
  case "CHARGED UP":
  default:
    gameGetMatchData = chargedUpGetMatchData;
    break;
}

export const getMatchData = gameGetMatchData;
