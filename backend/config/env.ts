import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  DEEPSEEK_KEY: process.env.DEEPSEEK_API_KEY!,
  JWT_SECRET: process.env.JWT_SECRET!
};