import type { Guild } from "discord.js";
import {
  sendQualMatchEmbed as chargedUpSendQualMatchEmbed,
  sendPlayoffMatchEmbed as chargedUpSendPlayoffMatchEmbed,
} from "./chargedUp";
import type { Match } from "../match";

let gameSendQualMatchEmbed: (guild: Guild, match: never) => void;
let gameSendPlayoffMatchEmbed: (guild: Guild, match: never) => void;

switch (process.env.GAME_NAME) {
  case "CHARGED UP":
  default:
    gameSendQualMatchEmbed = chargedUpSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = chargedUpSendPlayoffMatchEmbed;
    break;
}

export const sendQualMatchEmbed = (guild: Guild, match: Match) => {
  return gameSendQualMatchEmbed(guild, match as never);
};
export const sendPlayoffMatchEmbed = (guild: Guild, match: Match) => {
  return gameSendPlayoffMatchEmbed(guild, match as never);
};
