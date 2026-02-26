import { createClient } from "@supabase/supabase-js";
import { ENV } from "../config/env";

export const SUPABASE_URL = ENV.SUPABASE_URL;

export const supabase = createClient(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_KEY
);