import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Read before the client consumes the URL: did a "reset your password" email link open the app,
// and did Supabase send back an error (expired or already-used link)?
const hash = new URLSearchParams(location.hash.slice(1));
export const openedFromRecoveryLink = hash.get('type') === 'recovery';
export const authLinkError = hash.get('error_code') ?? hash.get('error');
if (authLinkError) history.replaceState(null, '', location.pathname + location.search);

// Null until a Supabase project is configured in .env; the app then falls back to device-only accounts.
// Implicit flow so email links work even when opened in a different browser or on another device.
export const supabase = url && key ? createClient(url, key, { auth: { flowType: 'implicit' } }) : null;
