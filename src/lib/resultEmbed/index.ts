import type { Guild } from "discord.js";
import {
  sendQualMatchEmbed as chargedUpSendQualMatchEmbed,
  sendPlayoffMatchEmbed as chargedUpSendPlayoffMatchEmbed,
} from "./chargedUp";
import {
  sendQualMatchEmbed as crescendoSendQualMatchEmbed,
  sendPlayoffMatchEmbed as crescendoSendPlayoffMatchEmbed,
} from "./crescendo";
import {
  sendQualMatchEmbed as rapidReactSendQualMatchEmbed,
  sendPlayoffMatchEmbed as rapidReactSendPlayoffMatchEmbed,
} from "./rapidReact";
import {
  sendQualMatchEmbed as reefscapeSendQualMatchEmbed,
  sendPlayoffMatchEmbed as reefscapeSendPlayoffMatchEmbed,
} from "./reefscape";

import type { Match } from "../match";

let gameSendQualMatchEmbed: (guild: Guild, match: never) => void;
let gameSendPlayoffMatchEmbed: (guild: Guild, match: never) => void;

switch (process.env.GAME_NAME) {
  case "RAPID REACT":
    gameSendQualMatchEmbed = rapidReactSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = rapidReactSendPlayoffMatchEmbed;
    break;
  case "CHARGED UP":
    gameSendQualMatchEmbed = chargedUpSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = chargedUpSendPlayoffMatchEmbed;
    break;
  case "CRESCENDO":
    gameSendQualMatchEmbed = crescendoSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = crescendoSendPlayoffMatchEmbed;
    break;
  case "REEFSCAPE":
  default:
    gameSendQualMatchEmbed = reefscapeSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = reefscapeSendPlayoffMatchEmbed;
    break;
}

export const sendQualMatchEmbed = (guild: Guild, match: Match) => {
  return gameSendQualMatchEmbed(guild, match as never);
};
export const sendPlayoffMatchEmbed = (guild: Guild, match: Match) => {
  return gameSendPlayoffMatchEmbed(guild, match as never);
};
