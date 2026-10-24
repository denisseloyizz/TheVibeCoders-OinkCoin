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
  Shopping: 'Try a 48-hour rule: wait two days before buying anything non-essential.',
  'Food & Dining': 'Cook at home a few more nights a week and pack lunch.',
  Entertainment: 'Look for free events and pause subscriptions you rarely use.',
  Transport: 'Combine errands, carpool, or try public transit a few days.',
  Bills: 'Call providers to negotiate rates or switch to a cheaper plan.',
  Groceries: 'Plan meals, shop with a list, and buy store brands.',
  Health: 'Check if generic medicine or in-network options can lower costs.',
  Other: 'Review these purchases - can any be moved into a planned category?',
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
  mood: Mood;
  message: string;
  tip: string | null;
}

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
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
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
  const topWant = wants.find((c) => c.spent > 0) ?? null;
  const focusOver = wants.find((c) => profile.focus.includes(c.category) && c.ratio > 1) ?? null;

  let level = wantsRatio < 0.5 ? 0 : wantsRatio < 0.8 ? 1 : wantsRatio <= 1.1 ? 2 : wantsRatio <= 1.5 ? 3 : 4;
  if (focusOver && level < MOODS.length - 1) level++;
  const mood = MOODS[level];

  const tipCategory = focusOver ?? topWant ?? categories.find((c) => c.spent > 0) ?? null;

  return {
    monthKey,
    spent,
    remaining: profile.budget - spent,
    usage: profile.budget > 0 ? spent / profile.budget : 0,
    categories,
    top: categories[0].spent > 0 ? categories[0] : null,
    topWant,
    wantsSpent,
    wantsLimit,
    needsSpent: spent - wantsSpent,
    mood,
    message: spent === 0 ? `${profile.name} is ready. Add an expense or import a statement to get started.` : buildMessage(profile.name, mood, wantsSpent, wantsLimit, topWant, focusOver),
    tip: tipCategory ? TIPS[tipCategory.category] : null,
  };
}

function buildMessage(
  name: string,
  mood: Mood,
  wantsSpent: number,
  wantsLimit: number,
  topWant: CategoryStat | null,
  focusOver: CategoryStat | null,
): string {
  const pct = wantsLimit > 0 ? Math.round((wantsSpent / wantsLimit) * 100) : 0;
  const culprit = topWant ? `${topWant.category} (${formatMoney(topWant.spent)})` : 'extras';
  switch (mood) {
    case 'happy':
      return wantsSpent === 0
        ? `${name} is happy. Everything this month has gone to needs.`
        : `${name} is happy. You've used ${pct}% of your wants budget.`;
    case 'okay':
      return `${name} is doing okay. ${pct}% of your wants budget is used, mostly on ${culprit}.`;
    case 'sad':
      return `${name} is sad. ${culprit} is pushing your wants to ${pct}% of budget.`;
    case 'angry':
      return wantsSpent > wantsLimit
        ? `${name} is angry. Wants are ${formatMoney(wantsSpent - wantsLimit)} over budget, led by ${culprit}.`
        : `${name} is angry. ${focusOver?.category ?? 'A goal category'} is over the limit you set.`;
    case 'dead':
      return `${name} fainted. Wants are at ${pct}% of budget. Pause ${topWant?.category ?? 'extras'} to bring ${name} back.`;
  }
}
