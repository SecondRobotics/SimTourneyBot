import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";
import { type Match, headerValues, saveMatchToRow } from "./match";

export async function setupConnection() {
  const privateKey = process.env.GOOGLE_SHEET_PRIVATE_KEY.replace(/\\n/g, "\n");

  const creds = {
    client_email: process.env.GOOGLE_SHEET_CLIENT_EMAIL,
    private_key: privateKey,
  };

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_DOC_ID);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  let matchesSheet = doc.sheetsByTitle.Matches;
  if (!matchesSheet) {
    matchesSheet = await doc.addSheet({
      title: "Matches",
      gridProperties: {
        columnCount: headerValues.length,
        frozenRowCount: 1,
        rowCount: 2,
      },
      headerValues: headerValues,
    });
  }

  let scheduleSheet = doc.sheetsByTitle.Schedule;
  if (!scheduleSheet) {
    scheduleSheet = await doc.addSheet({
      title: "Schedule",
      gridProperties: {
        columnCount: 10,
        frozenRowCount: 1,
        rowCount: 2,
      },
      headerValues: [
        "Match Number",
        "Red 1",
        "Red 2",
        "Red 3",
        "Blue 1",
        "Blue 2",
        "Blue 3",
        "",
        "Discord Ids",
        "Display Names",
      ],
    });
  }

  let alliancesSheet = doc.sheetsByTitle.Alliances;
  if (!alliancesSheet) {
    alliancesSheet = await doc.addSheet({
      title: "Alliances",
      gridProperties: {
        columnCount: 3,
        frozenRowCount: 1,
        rowCount: 9,
      },
      headerValues: ["captain", "pick1", "pick2"],
    });
  }

  let playoffScheduleSheet = doc.sheetsByTitle["Playoff Schedule"];
  if (!playoffScheduleSheet) {
    playoffScheduleSheet = await doc.addSheet({
      title: "Playoff Schedule",
      gridProperties: {
        columnCount: 7,
        frozenRowCount: 1,
        rowCount: 2,
      },
      headerValues: [
        "Match Number",
        "Red 1",
        "Red 2",
        "Red 3",
        "Blue 1",
        "Blue 2",
        "Blue 3",
      ],
    });
  }

  let playoffMatchesSheet = doc.sheetsByTitle["Playoff Matches"];
  if (!playoffMatchesSheet) {
    playoffMatchesSheet = await doc.addSheet({
      title: "Playoff Matches",
      gridProperties: {
        columnCount: headerValues.length,
        frozenRowCount: 1,
        rowCount: 2,
      },
      headerValues: headerValues,
    });
  }

  return {
    matchesSheet,
    scheduleSheet,
    alliancesSheet,
    playoffScheduleSheet,
    playoffMatchesSheet,
    sheetTitle: doc.title,
  };
}

export async function updateMatch(
  matchesSheet: GoogleSpreadsheetWorksheet,
  match: Match
) {
  const rows = await matchesSheet.getRows();

  const row = rows.find((r) => r["Match Number"] == match.matchNumber);
  if (!row) {
    throw new Error(`Could not find match ${match.matchNumber}`);
  }

  saveMatchToRow(match, row);
  await row.save();

  return row;
}

export async function isAlreadyPlayed(
  matchesSheet: GoogleSpreadsheetWorksheet,
  matchNumber: number
) {
  const rows = await matchesSheet.getRows();

  const row = rows.find((r) => r["Match Number"] == matchNumber);
  if (!row) {
    return false;
  }

  return !!row["Red Score"] || !!row["Blue Score"];
}

export async function getSoonestUnplayedMatch(
  matchesSheet: GoogleSpreadsheetWorksheet
) {
  const rows = await matchesSheet.getRows();

  const row = rows.find((r) => !r["Red Score"] && !r["Blue Score"]);
  if (!row || row["Red 1"] === "TBD" || row["Blue 1"] === "TBD") {
    return { row: null, matchNumber: null, secondMatchNumber: null };
  }
  const matchNumber = parseInt(row["Match Number"]);

  const secondRow = rows.find(
    (r) =>
      !r["Red Score"] && !r["Blue Score"] && r["Match Number"] != matchNumber
  );
  const secondMatchNumber =
    !secondRow || secondRow["Red 1"] === "TBD" || secondRow["Blue 1"] === "TBD"
      ? null
      : parseInt(secondRow["Match Number"]);

  return { row, matchNumber, secondMatchNumber };
}

export async function getMatch(
  scheduleSheet: GoogleSpreadsheetWorksheet,
  matchNumber: number
) {
  const rows = await scheduleSheet.getRows();

  const row = rows.find((r) => r["Match Number"] == matchNumber);
  if (!row) {
    throw new Error(`Could not find match ${matchNumber}`);
  }

  return row;
}

export async function getMatchPlayers(
  scheduleSheet: GoogleSpreadsheetWorksheet,
  matchNumber: number
): Promise<string[]> {
  const row = await getMatch(scheduleSheet, matchNumber);

  return [
    ...Array.from(
      { length: process.env.TEAMS_PER_ALLIANCE },
      (_, i) => row[`Red ${i + 1}`]
    ),
    ...Array.from(
      { length: process.env.TEAMS_PER_ALLIANCE },
      (_, i) => row[`Blue ${i + 1}`]
    ),
  ];
}

export async function copyScheduleToMatchesSheet(
  matchesSheet: GoogleSpreadsheetWorksheet,
  scheduleSheet: GoogleSpreadsheetWorksheet
) {
  const scheduleRows = await scheduleSheet.getRows();
  const matchRows = await matchesSheet.getRows();

  // discord id to display name map
  const players = new Map<string, string>();
  for (const row of scheduleRows) {
    const discordIds = row["Discord Ids"];
    const displayNames = row["Display Names"];
    players.set(discordIds, displayNames);
  }

  for (const row of scheduleRows) {
    const matchNumber = row["Match Number"];
    if (!Number.isInteger(parseInt(matchNumber))) {
      continue;
    }

    const matchRow = matchRows.find((r) => r["Match Number"] == matchNumber);
    if (!matchRow) {
      await matchesSheet.addRow([
        matchNumber,
        players.get(row["Red 1"]) ?? "",
        players.get(row["Red 2"]) ?? "",
        players.get(row["Red 3"]) ?? "",
        players.get(row["Blue 1"]) ?? "",
        players.get(row["Blue 2"]) ?? "",
        players.get(row["Blue 3"]) ?? "",
      ]);
    } else {
      matchRow["Red 1"] = players.get(row["Red 1"]) ?? "";
      matchRow["Red 2"] = players.get(row["Red 2"]) ?? "";
      matchRow["Red 3"] = players.get(row["Red 3"]) ?? "";
      matchRow["Blue 1"] = players.get(row["Blue 1"]) ?? "";
      matchRow["Blue 2"] = players.get(row["Blue 2"]) ?? "";
      matchRow["Blue 3"] = players.get(row["Blue 3"]) ?? "";
      await matchRow.save();
    }
  }
}

export async function postSchedule(
  scheduleSheet: GoogleSpreadsheetWorksheet,
  schedule: { number: number; teams: string[] }[],
  playerIds: string[],
  playerNames: string[]
) {
  const rows = await scheduleSheet.getRows();

  let i = 0;
  for (const match of schedule) {
    const row = rows.find((r) => r["Match Number"] == match.number);
    if (row) {
      for (let i = 0; i < process.env.TEAMS_PER_ALLIANCE; i++) {
        row[`Red ${i + 1}`] = match.teams[i];
        row[`Blue ${i + 1}`] = match.teams[i + process.env.TEAMS_PER_ALLIANCE];
      }
      row["Discord Ids"] = playerIds[i];
      row["Display Names"] = playerNames[i];

      await row.save();
    } else {
      await scheduleSheet.addRow([
        match.number,
        ...match.teams.slice(0, process.env.TEAMS_PER_ALLIANCE),
        ...Array.from({ length: 3 - process.env.TEAMS_PER_ALLIANCE }, () => ""),
        ...match.teams.slice(process.env.TEAMS_PER_ALLIANCE),
        ...Array.from({ length: 3 - process.env.TEAMS_PER_ALLIANCE }, () => ""),
        "",
        playerIds[i],
        playerNames[i],
      ]);
    }
    i++;
  }
}
