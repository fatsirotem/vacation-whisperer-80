import { createClient } from '@supabase/supabase-js'

// No more placeholders. If these are missing, the app will let us know.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and Key are missing! Check Vercel Environment Variables.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
