import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  GOOGLE_SHEET_CLIENT_EMAIL: z.string(),
  GOOGLE_SHEET_PRIVATE_KEY: z.string(),
  GOOGLE_SHEET_DOC_ID: z.string(),
  DISCORD_TOKEN: z.string(),
  DISCORD_GUILD_ID: z.string(),
  DISCORD_CHANNEL_ID: z.string(),
});

envSchema.parse(process.env);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
