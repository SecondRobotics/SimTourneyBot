import {
  sendQualMatchEmbed as chargedUpSendQualMatchEmbed,
  sendPlayoffMatchEmbed as chargedUpSendPlayoffMatchEmbed,
} from "./chargedUp";

let gameSendQualMatchEmbed;
let gameSendPlayoffMatchEmbed;

switch (process.env.GAME_NAME) {
  case "CHARGED UP":
  default:
    gameSendQualMatchEmbed = chargedUpSendQualMatchEmbed;
    gameSendPlayoffMatchEmbed = chargedUpSendPlayoffMatchEmbed;
    break;
}

export const sendQualMatchEmbed = gameSendQualMatchEmbed;
export const sendPlayoffMatchEmbed = gameSendPlayoffMatchEmbed;
