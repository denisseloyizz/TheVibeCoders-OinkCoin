import { catLabel } from './labels';
import { t, T } from './i18n';
import { CATEGORIES, MOODS, type Category, type Expense, type Mood, type Profile } from './types';

const DEFAULT_SHARES: Record<Category, number> = {
  Shopping: 0.1,
  'Food & Dining': 0.1,
  Entertainment: 0.05,
  Transport: 0.1,
  Bills: 0.35,
  Groceries: 0.15,
  Health: 0.05,
  Other: 0.1,
};

/** Non-essential spending. Only wants affect the buddy's mood; needs never do. */
export const WANTS: Category[] = ['Shopping', 'Food & Dining', 'Entertainment'];
export const NEEDS: Category[] = ['Bills', 'Groceries', 'Transport', 'Health'];
export const isWant = (c: Category): boolean => WANTS.includes(c);

const TIPS: Record<Category, string> = {
  Shopping: T('Try a 48-hour rule: wait two days before buying anything non-essential.'),
  'Food & Dining': T('Cook at home a few more nights a week and pack lunch.'),
  Entertainment: T('Look for free events and pause subscriptions you rarely use.'),
  Transport: T('Combine errands, carpool, or try public transit a few days.'),
  Bills: T('Call providers to negotiate rates or switch to a cheaper plan.'),
  Groceries: T('Plan meals, shop with a list, and buy store brands.'),
  Health: T('Check if generic medicine or in-network options can lower costs.'),
  Other: T('Review these purchases - can any be moved into a planned category?'),
};

export interface CategoryStat {
  category: Category;
  spent: number;
  limit: number;
  ratio: number;
}

export interface Analysis {
  monthKey: string;
  spent: number;
  remaining: number;
  usage: number;
  categories: CategoryStat[];
  top: CategoryStat | null;
  topWant: CategoryStat | null;
  wantsSpent: number;
  wantsLimit: number;
  needsSpent: number;
  needsLimit: number;
  topNeed: CategoryStat | null;
  /** What set the mood: wants spending, a cut-back category over its limit, or needs over plan. */
  reason: MoodReason;
  mood: Mood;
  message: string;
  tip: string | null;
}

export type MoodReason = 'wants' | 'focus' | 'needs';

/** Wants budget used, as a fraction, at which each mood starts. Shown to the user in the goals card. */
export const MOOD_STEPS: { mood: Mood; from: number }[] = [
  { mood: 'happy', from: 0 },
  { mood: 'okay', from: 0.5 },
  { mood: 'sad', from: 0.8 },
  { mood: 'angry', from: 1.1 },
  { mood: 'dead', from: 1.5 },
];

export function defaultLimits(budget: number, focus: Category[] = []): Record<Category, number> {
  const limits = {} as Record<Category, number>;
  for (const c of CATEGORIES) {
    // Quiz focus areas get a 20% tighter limit.
    const share = DEFAULT_SHARES[c] * (focus.includes(c) ? 0.8 : 1);
    limits[c] = Math.round(budget * share * 100) / 100;
  }
  return limits;
}

export function localDateKey(d = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function formatMoney(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function analyze(profile: Profile, expenses: Expense[], month = new Date()): Analysis {
  const monthKey = localDateKey(month).slice(0, 7);
  const monthly = expenses.filter((e) => e.date.startsWith(monthKey));

  const categories: CategoryStat[] = CATEGORIES.map((category) => {
    const spent = monthly.filter((e) => e.category === category).reduce((s, e) => s + e.amount, 0);
    const limit = profile.limits[category] ?? 0;
    const ratio = limit > 0 ? spent / limit : spent > 0 ? Infinity : 0;
    return { category, spent, limit, ratio };
  }).sort((a, b) => b.spent - a.spent);

  const spent = categories.reduce((s, c) => s + c.spent, 0);
  const wants = categories.filter((c) => isWant(c.category));
  const wantsSpent = wants.reduce((s, c) => s + c.spent, 0);
  const wantsLimit = wants.reduce((s, c) => s + c.limit, 0);
  const wantsRatio = wantsLimit > 0 ? wantsSpent / wantsLimit : wantsSpent > 0 ? Infinity : 0;
  const needs = categories.filter((c) => !isWant(c.category));
  const needsSpent = spent - wantsSpent;
  const needsLimit = needs.reduce((s, c) => s + c.limit, 0);
  const topWant = wants.find((c) => c.spent > 0) ?? null;
  const topNeed = needs.find((c) => c.spent > 0) ?? null;
  const focusOver = wants.find((c) => profile.focus.includes(c.category) && c.ratio > 1) ?? null;

  // Only wants can make the buddy faint. A cut-back category over its limit makes it one step
  // worse (at most angry), and needs over plan make it sad at most.
  let level = MOOD_STEPS.filter((st) => wantsRatio >= st.from).length - 1;
  let reason: MoodReason = 'wants';
  const angry = MOODS.indexOf('angry');
  const sad = MOODS.indexOf('sad');
  if (focusOver && level < angry) {
    level++;
    reason = 'focus';
  }
  if (needsLimit > 0 && needsSpent > needsLimit && level < sad) {
    level = sad;
    reason = 'needs';
  }
  const mood = MOODS[level];

  const tipCategory = focusOver ?? topWant ?? categories.find((c) => c.spent > 0) ?? null;

  return {
    monthKey,
    spent,
    remaining: Math.round((profile.budget - spent) * 100) / 100 + 0, // cents, and +0 turns -0 into 0
    usage: profile.budget > 0 ? spent / profile.budget : 0,
    categories,
    top: categories[0].spent > 0 ? categories[0] : null,
    topWant,
    wantsSpent,
    wantsLimit,
    needsSpent,
    needsLimit,
    topNeed,
    reason,
    mood,
    message: spent === 0 ? t('{name} is ready! Add your first expense.', { name: petName(profile) }) : buildMessage(petName(profile), mood, reason, topWant, focusOver, topNeed),
    tip: tipCategory ? t(TIPS[tipCategory.category]) : null,
  };
}

/** The buddy's name as it reads at the start of a sentence. */
export const petName = (profile: Profile): string => profile.name.charAt(0).toUpperCase() + profile.name.slice(1);

/** One short, plain sentence about this month. The numbers live in the goals card. */
function buildMessage(
  name: string,
  mood: Mood,
  reason: MoodReason,
  topWant: CategoryStat | null,
  focusOver: CategoryStat | null,
  topNeed: CategoryStat | null,
): string {
  const culprit = topWant ? catLabel(topWant.category) : t('extras');
  if (reason === 'needs') return t('{name} is a little sad. {category} cost more than planned.', { name, category: catLabel(topNeed?.category ?? 'Bills') });
  if (reason === 'focus' && focusOver) {
    const category = catLabel(focusOver.category);
    return mood === 'angry'
      ? t('{name} is angry. {category} is over your cut-back limit.', { name, category })
      : t('{name} is sad. {category} is over your cut-back limit.', { name, category });
  }
  switch (mood) {
    case 'happy':
      return t("{name} is happy! You're doing great.", { name });
    case 'okay':
      return t('{name} is okay. Go easy on {culprit}.', { name, culprit });
    case 'sad':
      return t('{name} is sad. Slow down on {culprit}.', { name, culprit });
    case 'angry':
      return t("{name} is angry. You're over budget on {culprit}.", { name, culprit });
    case 'dead':
      return t('{name} fainted from too much {culprit}. Spend less to wake {name} up.', { name, culprit });
  }
}

/** How a finished month went, in the past tense, for the pet history. */
export function pastMessage(profile: Profile, a: Analysis, monthName: string): string {
  const name = petName(profile);
  const culprit = a.topWant ? catLabel(a.topWant.category) : t('extras');
  const month = monthName;
  if (a.reason === 'needs') return t('{name} was a little sad in {month}. {category} cost more than planned.', { name, month, category: catLabel(a.topNeed?.category ?? 'Bills') });
  if (a.reason === 'focus') return t('{name} was sad in {month}. A cut-back category went over.', { name, month });
  switch (a.mood) {
    case 'happy':
      return t('{name} had a happy {month}!', { name, month });
    case 'okay':
      return t('{name} did okay in {month}.', { name, month });
    case 'sad':
      return t('{name} was sad in {month}. Too much {culprit}.', { name, month, culprit });
    case 'angry':
      return t('{name} was angry in {month}. Over budget on {culprit}.', { name, month, culprit });
    case 'dead':
      return t('{name} fainted in {month} from too much {culprit}.', { name, month, culprit });
  }
}

export interface SpendingHistory {
  /** How many months the averages cover. */
  months: number;
  /** True when only the current, unfinished month has data. */
  partial: boolean;
  /** Average spending per month. */
  total: number;
  byCategory: Record<Category, number>;
}

/** Average monthly spending over the last three full months (or this month so far if that's all there is). */
export function spendingHistory(expenses: Expense[], today = new Date()): SpendingHistory | null {
  const current = localDateKey(today).slice(0, 7);
  const keys = [...new Set(expenses.map((e) => e.date.slice(0, 7)))].filter((k) => k <= current).sort();
  const full = keys.filter((k) => k < current);
  const use = (full.length ? full : keys).slice(-3);
  if (use.length === 0) return null;

  const byCategory = Object.fromEntries(CATEGORIES.map((c) => [c, 0])) as Record<Category, number>;
  for (const e of expenses) if (use.includes(e.date.slice(0, 7))) byCategory[e.category] += e.amount;
  for (const c of CATEGORIES) byCategory[c] = Math.round((byCategory[c] / use.length) * 100) / 100;
  const total = CATEGORIES.reduce((s, c) => s + byCategory[c], 0);
  return total > 0 ? { months: use.length, partial: full.length === 0, total, byCategory } : null;
}

/** A round budget a bit under what you spend now, so it's a real goal. */
export const roundBudget = (n: number): number => Math.max(50, Math.round(n / 50) * 50);

/**
 * Category limits shaped like your real spending. Needs get what you actually spend on them (bills
 * don't shrink because you want to save), so the savings come out of wants. Wants are split by your
 * history blended with typical shares, and categories you're cutting back on are 20% tighter.
 */
export function suggestedLimits(budget: number, focus: Category[], history: SpendingHistory | null): Record<Category, number> {
  if (!history) return defaultLimits(budget, focus);
  const h = history.byCategory;
  const needCats = CATEGORIES.filter((c) => !isWant(c));
  const wantCats = CATEGORIES.filter(isWant);
  const round = (n: number) => Math.round(n * 100) / 100;
  const limits = {} as Record<Category, number>;

  // Needs: past average, or a small allowance for needs with no history yet; never more than 85% of the budget.
  const needRaw = Object.fromEntries(needCats.map((c) => [c, h[c] > 0 ? h[c] : DEFAULT_SHARES[c] * budget * 0.1])) as Record<Category, number>;
  const needTotal = needCats.reduce((s, c) => s + needRaw[c], 0);
  const needScale = Math.min(1, (budget * 0.85) / needTotal);
  for (const c of needCats) limits[c] = round(needRaw[c] * needScale);

  // Wants: whatever is left, split by history blended with typical shares.
  const wantsRoom = budget - needCats.reduce((s, c) => s + limits[c], 0);
  const wantHist = wantCats.reduce((s, c) => s + h[c], 0);
  const wantDefault = wantCats.reduce((s, c) => s + DEFAULT_SHARES[c], 0);
  for (const c of wantCats) {
    const share = wantHist > 0 ? 0.7 * (h[c] / wantHist) + 0.3 * (DEFAULT_SHARES[c] / wantDefault) : DEFAULT_SHARES[c] / wantDefault;
    limits[c] = round(wantsRoom * share * (focus.includes(c) ? 0.8 : 1));
  }
  return limits;
}
