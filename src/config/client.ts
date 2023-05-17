import type {
  ChatInputCommandInteraction,
  Collection,
  SlashCommandBuilder,
} from "discord.js";
import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet";

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

// extend the Client class to add a commands property
declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command>;
    scheduleSheet: GoogleSpreadsheetWorksheet;
    matchesSheet: GoogleSpreadsheetWorksheet;
    alliancesSheet: GoogleSpreadsheetWorksheet;
    playoffsSheet: GoogleSpreadsheetWorksheet;
  }
}
