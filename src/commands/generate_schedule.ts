import {
  type ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";
import { spawn } from "child_process";
import fs from "fs/promises";
import fsSync from "fs";
import { postSchedule } from "../lib/googleSheet";
import fetch from "node-fetch";
import logger from "../config/logger";

export const data = new SlashCommandBuilder()
  .setName("generate_schedule")
  .setDescription("Generates a new match schedule for an event")
  .addRoleOption((option) =>
    option
      .setName("participants")
      .setDescription("The role containing all participants")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("rounds")
      .setDescription("The number of matches each participant should play")
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName("quality")
      .setDescription("The quality of the generated schedule")
      .setRequired(false)
      .setChoices(
        { name: "Fair", value: "-f" },
        { name: "Good", value: "-g" },
        { name: "Best", value: "-b" }
      )
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
  .setDMPermission(false);

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const participants = interaction.options.getRole("participants");
  const rounds = interaction.options.getInteger("rounds");
  const quality = interaction.options.getString("quality") ?? "-f";

  if (!participants || !rounds || !interaction.guild) {
    await interaction.reply({
      content: "Please provide all required options",
      ephemeral: true,
    });
    return;
  }

  await interaction.deferReply();

  // Get the number of users with the participant role
  await interaction.guild.members.fetch();
  const participantRole = await interaction.guild.roles.fetch(participants.id);
  if (!participantRole) {
    await interaction.editReply("Could not find the participant role");
    return;
  }
  const participantCount = participantRole.members.size;

  interaction.editReply(
    `Generating a schedule for ${participantCount} participants playing ${rounds} rounds...`
  );

  // Call MatchMaker by Idle Loop to generate a schedule
  const matchMaker = spawn("./MatchMaker", [
    "-t",
    String(participantCount),
    "-r",
    String(rounds),
    quality,
    "-q",
  ]);

  // Pipe the output of MatchMaker to a file
  const out = fsSync.createWriteStream("./schedule.txt");
  matchMaker.stdout.pipe(out);

  // Wait for MatchMaker to finish
  await new Promise((resolve) => {
    matchMaker.once("close", resolve);
  });

  interaction.editReply(
    `Generated a schedule for ${participantCount} participants playing ${rounds} rounds. Saving...`
  );

  // Handle the output of MatchMaker
  const schedule = await fs.readFile("./schedule.txt", "utf-8");
  const lines = schedule.split("\n");

  let i = 0;

  // Skip over lines until we get to the schedule
  while (lines[i] !== "--------------") {
    i++;
  }
  i++;

  // Read each line of the schedule
  const players = [...participantRole.members.values()];
  const matches = [] as { number: number; teams: string[] }[];
  while (lines[i] !== "") {
    const match = lines[i].trim().split(/\s+/);

    const number = parseInt(match.shift()?.replace(":", "") ?? "0");
    const teams = match.map((team) => players[parseInt(team) - 1].id);

    matches.push({ number, teams });
    i++;
  }

  // Delete the schedule file
  await fs.unlink("./schedule.txt");

  // Create list of discord user ids and display names
  const playerIds = players.map((player) => player.id);
  const playerNames = await Promise.all(
    players.map(async (player) => {
      // Get the player's name from the SRC API
      const res = await fetch(
        `https://secondrobotics.org/api/ranked/player/${player.id}/`
      );
      const json = (await res.json()) as unknown;
      if (
        !json ||
        typeof json !== "object" ||
        !("display_name" in json) ||
        typeof json.display_name !== "string"
      ) {
        // If the player's name can't be found, use their discord display name
        return player.displayName;
      }
      // Otherwise, use the player's name from the SRC API
      return json.display_name;
    })
  );

  // Post the schedule to Google Sheets
  await postSchedule(
    interaction.client.scheduleSheet,
    matches,
    playerIds,
    playerNames
  ).catch((err) => {
    logger.error(err);
    interaction.editReply(
      "Failed to save the schedule to Google Sheets (check the logs)"
    );
    return;
  });

  const sheetsUrl = `https://docs.google.com/spreadsheets/d/${process.env.GOOGLE_SHEET_DOC_ID}`;
  await interaction.editReply(
    `✅ Generated a schedule for ${participantCount} participants playing ${rounds} rounds! Saved! <` +
      sheetsUrl +
      ">"
  );
};
