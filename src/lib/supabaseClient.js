import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL ERROR: Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY) are not loaded. Please ensure you have a .env file in your project root with these variables defined. Copy from .env.example and fill in your credentials. You MUST restart your development server after creating/modifying the .env file.",
  );
  throw new Error("supabaseUrl is required.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);