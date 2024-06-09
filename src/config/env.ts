import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GOOGLE_SHEET_CLIENT_EMAIL: z.string().email(),
  GOOGLE_SHEET_PRIVATE_KEY: z.string().min(1),
  GOOGLE_SHEET_DOC_ID: z.string().min(1),
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z.string().min(1),
  DISCORD_GUILD_ID: z.string().min(1),
  DISCORD_CHANNEL_ID: z.string().min(1),
  DISCORD_CATEGORY_ID: z.string().min(1),
  GAME_NAME: z.enum(["CHARGED UP", "CRESCENDO"]),
  TEAMS_PER_ALLIANCE: z.number().int(),
});

envSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
