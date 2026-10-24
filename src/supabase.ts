import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Null until a Supabase project is configured in .env; the app then falls back to device-only accounts.
export const supabase = url && key ? createClient(url, key) : null;
