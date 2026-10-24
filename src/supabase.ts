import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Read before the client consumes the URL: did a "reset your password" email link open the app?
export const openedFromRecoveryLink = /type=recovery/.test(location.hash);

// Null until a Supabase project is configured in .env; the app then falls back to device-only accounts.
export const supabase = url && key ? createClient(url, key) : null;
