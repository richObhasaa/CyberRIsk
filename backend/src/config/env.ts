import dotenv from "dotenv";
import path from "path";

// Load .env from the backend root (one level above src/)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    DEEPSEEK_KEY: process.env.DEEPSEEK_API_KEY!,
    JWT_SECRET: process.env.JWT_SECRET!,
    PORT: parseInt(process.env.PORT ?? "4000", 10),
};
