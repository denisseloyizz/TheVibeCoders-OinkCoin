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

export interface AppState {
  profile: Profile | null;
  expenses: Expense[];
  care: Care;
  coins: number;
  /** Keys of goals already rewarded, e.g. "week:2026-10-05" or "month:2026-09". */
  rewards: string[];
  owned: string[];
  equipped: Equipped;
}
