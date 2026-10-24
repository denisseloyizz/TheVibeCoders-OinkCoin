import { isWant, localDateKey, WANTS } from './budget';
import type { AppState, Profile } from './types';

export const COINS_PER_GOAL = 3;

export interface Award {
  key: string;
  label: string;
}

const parseDay = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};

function weekStart(day: Date): Date {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate() - ((day.getDay() + 6) % 7));
}

const shortDate = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

export function monthlyWantsLimit(profile: Profile): number {
  return WANTS.reduce((s, c) => s + (profile.limits[c] ?? 0), 0);
}

export function weeklyWantsLimit(profile: Profile): number {
  return Math.round(((monthlyWantsLimit(profile) * 7) / 30.44) * 100) / 100;
}

export function currentWeekWants(state: AppState, today = new Date()): { spent: number; limit: number } {
  const start = localDateKey(weekStart(today));
  const end = localDateKey(new Date(parseDay(start).getTime() + 6 * 86_400_000));
  const spent = state.expenses
    .filter((e) => isWant(e.category) && e.date >= start && e.date <= end)
    .reduce((s, e) => s + e.amount, 0);
  return { spent, limit: state.profile ? weeklyWantsLimit(state.profile) : 0 };
}

/**
 * Goals: each finished week with wants under the weekly allowance, and each finished
 * month under both the total budget and the wants budget. Only periods with activity count.
 */
export function findNewAwards(state: AppState, today = new Date()): Award[] {
  const profile = state.profile;
  if (!profile) return [];
  const todayKey = localDateKey(today);
  const thisWeek = localDateKey(weekStart(today));
  const thisMonth = todayKey.slice(0, 7);
  const weekly = weeklyWantsLimit(profile);
  const monthlyWants = monthlyWantsLimit(profile);

  const weeks = new Map<string, number>();
  const months = new Map<string, { total: number; wants: number }>();
  for (const e of state.expenses) {
    const wk = localDateKey(weekStart(parseDay(e.date)));
    const want = isWant(e.category) ? e.amount : 0;
    weeks.set(wk, (weeks.get(wk) ?? 0) + want);
    const m = months.get(e.date.slice(0, 7)) ?? { total: 0, wants: 0 };
    m.total += e.amount;
    m.wants += want;
    months.set(e.date.slice(0, 7), m);
  }

  const awards: Award[] = [];
  for (const [wk, wants] of weeks) {
    if (wk < thisWeek && wants <= weekly) awards.push({ key: `week:${wk}`, label: `Week of ${shortDate(parseDay(wk))}` });
  }
  for (const [mk, m] of months) {
    if (mk < thisMonth && m.total <= profile.budget && m.wants <= monthlyWants) {
      awards.push({ key: `month:${mk}`, label: parseDay(`${mk}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) });
    }
  }
  const seen = new Set(state.rewards);
  return awards.filter((a) => !seen.has(a.key)).sort((a, b) => a.key.localeCompare(b.key));
}
