import type { AppState, Care, Profile } from './types';

const KEY = 'oinkcoin-state-v1';

export const freshCare = (): Care => ({ hunger: 80, fun: 80, love: 80, updatedAt: Date.now() });

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
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
      };
    }
  } catch {
    // Corrupt storage: start fresh.
  }
  return emptyState();
}

export function emptyState(): AppState {
  return { profile: null, expenses: [], care: freshCare(), coins: 0, rewards: [], owned: [], equipped: {} };
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}
