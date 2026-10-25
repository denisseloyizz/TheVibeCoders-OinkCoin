import { getLang, t, T } from './i18n';
import type { Category, Character, Goal, Mood } from './types';

// Stored values (categories, goals, moods, characters) stay in English in the saved data and in the code.
// Only what the person sees is translated, by these helpers, at the moment of drawing.

const CATEGORY: Record<Category, string> = {
  Shopping: T('Shopping'),
  'Food & Dining': T('Food & Dining'),
  Entertainment: T('Entertainment'),
  Transport: T('Transport'),
  Bills: T('Bills'),
  Groceries: T('Groceries'),
  Health: T('Health'),
  Other: T('Other'),
};
export const catLabel = (c: Category): string => t(CATEGORY[c] ?? c);

const GOAL: Record<Goal, string> = {
  'Save more money': T('Save more money'),
  'Stop impulse buying': T('Stop impulse buying'),
  'Pay off debt': T('Pay off debt'),
  'Just track my spending': T('Just track my spending'),
};
export const goalLabel = (g: Goal): string => t(GOAL[g] ?? g);

const MOOD: Record<Mood, string> = { happy: T('Happy'), okay: T('Okay'), sad: T('Sad'), angry: T('Angry'), dead: T('Fainted') };
export const moodLabel = (m: Mood): string => t(MOOD[m]);

const CHARACTER: Record<Character, string> = { male: T('Male'), female: T('Female'), nonbinary: T('Non-binary'), pig: T('Piggy') };
export const charLabel = (c: Character): string => t(CHARACTER[c]);

/** The privacy policy page for the current language. */
export const privacyPage = (): string => (getLang() === 'es' ? 'privacy-es.html' : 'privacy.html');
