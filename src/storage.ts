import type { AppState, Care, Profile } from './types';

const LEGACY_KEY = 'oinkcoin-state-v1';
let key = LEGACY_KEY;
let onSave: ((state: AppState) => void) | null = null;

/** Called after every save, e.g. to back the state up to the user's account. */
export function setSaveListener(listener: ((state: AppState) => void) | null): void {
  onSave = listener;
}

export const freshCare = (): Care => ({ hunger: 80, fun: 80, love: 80, updatedAt: Date.now() });

/** Loads the signed-in user's state. Data saved before accounts existed goes to the first user. */
export function loadState(email: string): AppState {
  key = `${LEGACY_KEY}:${email}`;
  return readState(localStorage.getItem(key) ?? migrateLegacy());
}

function migrateLegacy(): string | null {
  const raw = localStorage.getItem(LEGACY_KEY);
  if (raw) {
    localStorage.setItem(key, raw);
    localStorage.removeItem(LEGACY_KEY);
  }
  return raw;
}

/** Parses saved state (from this device or the account), filling in anything missing. */
export function readState(raw: string | object | null): AppState {
  try {
    if (raw) {
      const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Partial<AppState>;
      const p = parsed.profile as Partial<Profile> | null | undefined;
      return {
        profile: p ? ({ focus: [], goal: 'Just track my spending', ...p } as Profile) : null,
        expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
        income: Array.isArray(parsed.income) ? parsed.income : [],
        care: parsed.care ?? freshCare(),
        coins: typeof parsed.coins === 'number' ? parsed.coins : 0,
        rewards: Array.isArray(parsed.rewards) ? parsed.rewards : [],
        alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
        notices: Array.isArray(parsed.notices) ? parsed.notices : [],
        owned: Array.isArray(parsed.owned) ? parsed.owned : [],
        equipped: parsed.equipped ?? {},
        house: parsed.house ?? {},
        bank: parsed.bank ?? null,
        tutorialSeen: parsed.tutorialSeen === true,
        savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : 0,
      };
    }
  } catch {
    // Corrupt storage: start fresh.
  }
  return emptyState();
}

export function emptyState(): AppState {
  return { profile: null, expenses: [], income: [], care: freshCare(), coins: 0, rewards: [], alerts: [], notices: [], owned: [], equipped: {}, house: {}, bank: null, tutorialSeen: false, savedAt: 0 };
}

export function saveState(state: AppState): void {
  state.savedAt = Date.now();
  localStorage.setItem(key, JSON.stringify(state));
  onSave?.(state);
}

/** Saves a copy that came from the account, without echoing it back. */
export function saveLocalOnly(state: AppState): void {
  localStorage.setItem(key, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(key);
}
