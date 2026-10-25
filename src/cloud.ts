import { readState } from './storage';
import { supabase } from './supabase';
import type { AppState } from './types';

// Backs each user's state up to their account (the app_state table, which only they can read),
// so their buddy follows them across browsers and devices.

export const cloudEnabled = !!supabase;

let timer = 0;
let pending: AppState | null = null;

async function userId(): Promise<string | null> {
  const { data } = await supabase!.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function loadCloudState(): Promise<AppState | null> {
  const id = await userId();
  if (!id) return null;
  const { data, error } = await supabase!.from('app_state').select('data').eq('user_id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? readState(data.data) : null;
}

/** Saves a moment after the last change, so bursts of taps become one request. */
export function queueCloudSave(state: AppState): void {
  pending = state;
  clearTimeout(timer);
  timer = window.setTimeout(() => void flushCloudSave(), 1500);
}

export function cancelCloudSave(): void {
  clearTimeout(timer);
  pending = null;
}

export async function flushCloudSave(): Promise<void> {
  clearTimeout(timer);
  const state = pending;
  pending = null;
  if (!state) return;
  const id = await userId();
  if (!id) return;
  const { error } = await supabase!.from('app_state').upsert({ user_id: id, data: state, updated_at: new Date().toISOString() });
  if (error) console.warn('Could not back up to your account:', error.message);
}
