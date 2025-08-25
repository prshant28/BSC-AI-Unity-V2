import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://edlcpwhglsumbtybfmuz.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkbGNwd2hnbHN1bWJ0eWJmbXV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5Nzg2NTgsImV4cCI6MjA2MzU1NDY1OH0.Zx8FL-dIrk1dB8nyfkHcn5JWe-yx3Oa6EnViHuftnBU";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "CRITICAL ERROR: Supabase URL or Anon Key is missing in supabaseClient.js. " +
      "This should not happen if credentials are hardcoded as per the latest fix. Please check the file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
