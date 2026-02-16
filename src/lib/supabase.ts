import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Tactical validation: Catch missing keys before the app crashes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 ENGINE FAILURE: Supabase keys are missing from the .env file!");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);