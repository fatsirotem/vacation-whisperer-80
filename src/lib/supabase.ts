import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This prevents the "Url is required" crash
if (!supabaseUrl || !supabaseKey) {
  console.error("CRITICAL: Supabase environment variables are missing in Vercel settings!")
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder')
