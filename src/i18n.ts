import esAuth from './lang/es_auth';
import esChat from './lang/es_chat';
import esContent from './lang/es_content';
import esLabels from './lang/es_labels';
import esMain from './lang/es_main';
import esSocial from './lang/es_social';

// Two languages: English (the source text) and Mexican Spanish. Strings are looked up by their English
// text, so the code stays readable: t('Left to spend'). Anything without a Spanish entry shows in English.

export type Lang = 'en' | 'es';

const ES: Record<string, string> = { ...esMain, ...esAuth, ...esChat, ...esContent, ...esLabels, ...esSocial };

const STORAGE_KEY = 'oinkcoin-lang';
const listeners: (() => void)[] = [];

function initial(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'es') return saved;
  } catch {
    // Storage can be unavailable (private mode); fall through to English.
  }
  return 'en';
}

let lang: Lang = initial();
if (typeof document !== 'undefined') document.documentElement.lang = lang === 'es' ? 'es-MX' : 'en';

export const getLang = (): Lang => lang;

/** Locale for dates and numbers. Money always shows as $1,234.00, which reads the same in Mexico. */
export const locale = (): string => (lang === 'es' ? 'es-MX' : 'en-US');

export function setLang(next: Lang): void {
  if (next === lang) return;
  lang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Not fatal: the choice just will not be remembered.
  }
  if (typeof document !== 'undefined') document.documentElement.lang = next === 'es' ? 'es-MX' : 'en';
  listeners.forEach((cb) => cb());
}

/** Called after the language changes, so the screen can redraw. */
export function onLangChange(cb: () => void): void {
  listeners.push(cb);
}

/** Keys that were asked for in Spanish but have no translation. The tests keep this empty. */
const missing = new Set<string>();
export const missingKeys = (): string[] => [...missing];

/** The Spanish dictionary, for tests. */
export const dictionary = (): Readonly<Record<string, string>> => ES;

function fill(text: string, vars?: Record<string, string | number>): string {
  return vars ? text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : text;
}

/** Translate. `en` is the English text and the lookup key; `{name}` style placeholders are filled from `vars`. */
export function t(en: string, vars?: Record<string, string | number>): string {
  if (lang === 'en') return fill(en, vars);
  const es = ES[en];
  if (es === undefined) missing.add(en);
  return fill(es ?? en, vars);
}

/** Marks an English string for translation without translating it yet. Use for constants defined at load time, then call t() on the value when drawing. */
export const T = (en: string): string => en;

/** Picks between two keys by count. `{n}` is filled with the count. */
export function tp(one: string, many: string, n: number, vars?: Record<string, string | number>): string {
  return t(n === 1 ? one : many, { n, ...vars });
}
