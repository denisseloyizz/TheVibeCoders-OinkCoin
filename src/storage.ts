import type { AppState, Care, Profile } from './types';

const LEGACY_KEY = 'oinkcoin-state-v1';
let key = LEGACY_KEY;

export const freshCare = (): Care => ({ hunger: 80, fun: 80, love: 80, updatedAt: Date.now() });

/** Loads the signed-in user's state. Data saved before accounts existed goes to the first user. */
export function loadState(email: string): AppState {
  key = `${LEGACY_KEY}:${email}`;
  try {
    let raw = localStorage.getItem(key);
    if (!raw && (raw = localStorage.getItem(LEGACY_KEY))) {
      localStorage.setItem(key, raw);
      localStorage.removeItem(LEGACY_KEY);
    }
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      const p = parsed.profile as Partial<Profile> | null | undefined;
      return {
        profile: p ? ({ focus: [], goal: 'Just track my spending', ...p } as Profile) : null,
        expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
        care: parsed.care ?? freshCare(),
        coins: typeof parsed.coins === 'number' ? parsed.coins : 0,
        rewards: Array.isArray(parsed.rewards) ? parsed.rewards : [],
        owned: Array.isArray(parsed.owned) ? parsed.owned : [],
        equipped: parsed.equipped ?? {},
        bank: parsed.bank ?? null,
      };
    }
  } catch {
    // Corrupt storage: start fresh.
  }
  return emptyState();
}

export function emptyState(): AppState {
  return { profile: null, expenses: [], care: freshCare(), coins: 0, rewards: [], owned: [], equipped: {}, bank: null };
}

export function saveState(state: AppState): void {
  localStorage.setItem(key, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(key);
}
