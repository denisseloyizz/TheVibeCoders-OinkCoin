import { t } from './i18n';
import { MOODS, type Care, type Mood } from './types';

export type CareAction = 'feed' | 'play' | 'pet';

const DECAY_PER_HOUR = { hunger: 5, fun: 4, love: 3 };
const clamp = (n: number) => Math.round(Math.min(100, Math.max(0, n)));

export function currentCare(c: Care, now = Date.now()): Care {
  const hours = Math.max(0, (now - c.updatedAt) / 3_600_000);
  return {
    hunger: clamp(c.hunger - DECAY_PER_HOUR.hunger * hours),
    fun: clamp(c.fun - DECAY_PER_HOUR.fun * hours),
    love: clamp(c.love - DECAY_PER_HOUR.love * hours),
    updatedAt: now,
  };
}

export function applyAction(c: Care, action: CareAction): Care {
  const next = currentCare(c);
  if (action === 'feed') next.hunger = clamp(next.hunger + 25);
  if (action === 'play') {
    next.fun = clamp(next.fun + 25);
    next.hunger = clamp(next.hunger - 5);
  }
  if (action === 'pet') next.love = clamp(next.love + 20);
  return next;
}

/** A neglected buddy feels one step worse than their money mood (neglect alone never kills). */
export function careMood(base: Mood, c: Care): Mood {
  const i = MOODS.indexOf(base);
  if (Math.min(c.hunger, c.fun, c.love) >= 25 || i >= MOODS.indexOf('angry')) return base;
  return MOODS[i + 1];
}

export function careNote(name: string, c: Care): string | null {
  if (c.hunger < 25) return t('{name} is hungry. Tap Feed.', { name });
  if (c.fun < 25) return t('{name} is bored. Try Play.', { name });
  if (c.love < 25) return t('{name} could use some attention. Tap Pet.', { name });
  return null;
}
