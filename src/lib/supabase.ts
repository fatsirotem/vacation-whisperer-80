import { createClient } from '@supabase/supabase-js'

// Hardcoded temporarily for debugging - this proves the app works
const supabaseUrl = "https://sitmekejhsyckchbzhkc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdG1la2VqaHN5Y2tjaGJ6aGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3MjE1NzAsImV4cCI6MjA1MjI5NzU3MH0.HFGf09PcuLpmE6vcwJiD4ezYMsqxINiSXXPRPDJx5EI";

console.log("✅ Supabase initialized with hardcoded values");

export const supabase = createClient(supabaseUrl, supabaseKey);
