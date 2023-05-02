import logger from "./config/logger";
import {
  ChatInputCommandInteraction,
  Collection,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import fs from "fs";
import path from "path";

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
};

export const getCommands = () => {
  const commands: Collection<string, Command> = new Collection();

  const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(__dirname, "commands", file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath) as unknown;
    if (
      command &&
      typeof command === "object" &&
      "data" in command &&
      command.data instanceof SlashCommandBuilder &&
      "execute" in command &&
      typeof command.execute === "function"
    ) {
      commands.set(command.data.name, command as Command);
    } else {
      logger.warn(`Invalid command file: ${filePath}`);
    }
  }

  return commands;
};

export const registerCommands = async (
  commands: RESTPostAPIChatInputApplicationCommandsJSONBody[]
) => {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    logger.info(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    );

    if (data && typeof data === "object" && "length" in data) {
      logger.info(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    } else {
      logger.warn(`Invalid response from Discord API: ${data}`);
    }
  } catch (error) {
    logger.error(error);
  }
};
