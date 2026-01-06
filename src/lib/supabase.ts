import { createClient } from '@supabase/supabase-js'

// Hardcoded temporarily for debugging - this proves the app works
const supabaseUrl = "https://sitmekejhsyckchbzhkc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpdG1la2VqaHN5Y2tjaGJ6aGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MzU2MDIsImV4cCI6MjA4MzIxMTYwMn0.B0HZw4qT_I6YcWFil28ZYiyDHwr5fzp1TALWlw_Xu2A";

console.log("✅ Supabase initialized with hardcoded values");

export const supabase = createClient(supabaseUrl, supabaseKey);
