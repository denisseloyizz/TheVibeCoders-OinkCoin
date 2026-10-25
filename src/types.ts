export type Character = 'male' | 'female' | 'nonbinary' | 'pig';
export type Mood = 'happy' | 'okay' | 'sad' | 'angry' | 'dead';
export const MOODS: Mood[] = ['happy', 'okay', 'sad', 'angry', 'dead'];

export const CATEGORIES = [
  'Shopping',
  'Food & Dining',
  'Entertainment',
  'Transport',
  'Bills',
  'Groceries',
  'Health',
  'Other',
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  note: string;
  date: string; // YYYY-MM-DD
}

/** Money coming in: paychecks, deposits, cash income. Kept apart from spending. */
export interface Income {
  id: string;
  amount: number;
  note: string;
  date: string; // YYYY-MM-DD
}

export interface Profile {
  name: string;
  character: Character;
  budget: number;
  limits: Record<Category, number>;
  focus: Category[];
  goal: Goal;
}

export const GOALS = ['Save more money', 'Stop impulse buying', 'Pay off debt', 'Just track my spending'] as const;
export type Goal = (typeof GOALS)[number];

export interface Care {
  hunger: number;
  fun: number;
  love: number;
  updatedAt: number;
}

export type Slot = 'hat' | 'eyes' | 'neck';
export type Equipped = Partial<Record<Slot, string>>;

export interface BankAccount {
  name: string;
  mask: string | null;
  type: string;
  balance: number | null;
}

export interface Bank {
  accounts: BankAccount[];
  syncedAt: number;
}

export type NoticeKind = 'coins' | 'alert' | 'cheer' | 'bank' | 'error';

/** Something worth keeping in the notifications list (rewards, alerts, cheers, bank syncs). */
export interface Notice {
  id: string;
  kind: NoticeKind;
  text: string;
  at: number;
  read: boolean;
}

export interface AppState {
  profile: Profile | null;
  expenses: Expense[];
  income: Income[];
  care: Care;
  coins: number;
  /** Keys of goals already rewarded, e.g. "week:2026-10-05" or "month:2026-09". */
  rewards: string[];
  /** Spending alerts already shown, e.g. "2026-10:Shopping", so each shows once a month. */
  alerts: string[];
  /** Newest first, capped. */
  notices: Notice[];
  owned: string[];
  equipped: Equipped;
  /** Decor placed in the buddy's house, by slot (see house.ts). */
  house: Partial<Record<string, string>>;
  bank: Bank | null;
  /** True after the first-open app tour has been completed or dismissed. */
  tutorialSeen: boolean;
  /** When this state was last saved (ms), used to pick the newer copy between device and account. */
  savedAt: number;
}
