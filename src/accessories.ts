import type { Character, Equipped, Slot } from './types';

export interface Item {
  id: string;
  name: string;
  slot: Slot;
  price: number;
  /** SVG drawn around (0,0): hats sit on y=0 and grow upward; glasses use `gap` as lens offset. */
  art: (gap: number) => string;
}

const sunglasses = (gap: number) => `
  <rect x="${-gap - 11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <rect x="${gap - 11}" y="-7" width="22" height="14" rx="6" fill="#1d1a1c"/>
  <path d="M${-gap + 11} -2 Q0 -6 ${gap - 11} -2" stroke="#1d1a1c" stroke-width="2.5" fill="none"/>
  <path d="M${-gap - 6} -3 l5 -2 M${gap - 6} -3 l5 -2" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;

const roundGlasses = (gap: number) => `
  <circle cx="${-gap}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <circle cx="${gap}" r="9" fill="#fff" fill-opacity=".18" stroke="#b97f00" stroke-width="2.5"/>
  <path d="M${-gap + 9} -1 Q0 -5 ${gap - 9} -1" stroke="#b97f00" stroke-width="2.5" fill="none"/>`;

const HEART = 'M0 6 C-9 0 -10 -6 -6 -8 C-3 -9.5 -1 -8 0 -6 C1 -8 3 -9.5 6 -8 C10 -6 9 0 0 6Z';
const heartGlasses = (gap: number) => `
  <path transform="translate(${-gap} 0) scale(1.45)" d="${HEART}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path transform="translate(${gap} 0) scale(1.45)" d="${HEART}" fill="#ff5c9a" fill-opacity=".92" stroke="#c93468" stroke-width="1"/>
  <path d="M${-gap + 10} -4 Q0 -8 ${gap - 10} -4" stroke="#c93468" stroke-width="2.5" fill="none"/>`;

const flowerCrown = () =>
  `<path d="M-32 0 Q0 -14 32 0" stroke="#3ccf91" stroke-width="3" fill="none"/>` +
  [-26, -13, 0, 13, 26]
    .map((x, i) => {
      const y = x === 0 ? -8 : Math.abs(x) === 13 ? -6 : -3;
      const color = ['#ff8fb3', '#ffc93c', '#b69cff', '#ffc93c', '#ff8fb3'][i];
      return `<g transform="translate(${x} ${y})"><circle r="6.5" fill="${color}"/><circle r="2.3" fill="#fff"/></g>`;
    })
    .join('');

export const ITEMS: Item[] = [
  {
    id: 'party-hat', name: 'Party Hat', slot: 'hat', price: 3,
    art: () => `<path d="M-16 0 L0 -44 L16 0Z" fill="#ff5c9a"/><path d="M-11 -14 H11 M-6 -28 H6" stroke="#ffd23f" stroke-width="4"/><circle cy="-46" r="5" fill="#ffd23f"/>`,
  },
  {
    id: 'beanie', name: 'Beanie', slot: 'hat', price: 3,
    art: () => `<path d="M-30 0 C-30 -36 30 -36 30 0Z" fill="#5b8def"/><rect x="-32" y="-8" width="64" height="11" rx="5" fill="#3b6fd8"/><circle cy="-31" r="7" fill="#fff"/>`,
  },
  { id: 'flower-crown', name: 'Flower Crown', slot: 'hat', price: 6, art: flowerCrown },
  {
    id: 'cowboy', name: 'Cowboy Hat', slot: 'hat', price: 6,
    art: () => `<path d="M-20 -4 C-22 -32 -6 -34 0 -25 C6 -34 22 -32 20 -4Z" fill="#b97a45"/><rect x="-20" y="-11" width="40" height="5" fill="#6b3e1f"/><path d="M-44 -8 Q-32 4 0 3 Q32 4 44 -8 Q38 8 0 8 Q-38 8 -44 -8Z" fill="#a8693a"/>`,
  },
  {
    id: 'top-hat', name: 'Top Hat', slot: 'hat', price: 9,
    art: () => `<rect x="-34" y="-6" width="68" height="8" rx="4" fill="#2b2328"/><rect x="-20" y="-46" width="40" height="42" rx="3" fill="#2b2328"/><rect x="-20" y="-15" width="40" height="7" fill="#e5487f"/>`,
  },
  {
    id: 'crown', name: 'Crown', slot: 'hat', price: 12,
    art: () => `<path d="M-24 0 V-22 L-12 -10 L0 -30 L12 -10 L24 -22 V0Z" fill="#ffc93c" stroke="#d99a00" stroke-width="2" stroke-linejoin="round"/><circle cy="-8" r="3.5" fill="#ff5c9a"/><circle cx="-14" cy="-6" r="2.5" fill="#5b8def"/><circle cx="14" cy="-6" r="2.5" fill="#3ccf91"/>`,
  },
  { id: 'round-glasses', name: 'Round Glasses', slot: 'eyes', price: 3, art: roundGlasses },
  { id: 'sunglasses', name: 'Sunglasses', slot: 'eyes', price: 6, art: sunglasses },
  { id: 'heart-glasses', name: 'Heart Glasses', slot: 'eyes', price: 6, art: heartGlasses },
  {
    id: 'bow-tie', name: 'Bow Tie', slot: 'neck', price: 3,
    art: () => `<path d="M0 0 L-15 -9 L-15 9Z M0 0 L15 -9 L15 9Z" fill="#e5487f" stroke="#c93468" stroke-width="1.5" stroke-linejoin="round"/><rect x="-4.5" y="-4.5" width="9" height="9" rx="2.5" fill="#c93468"/>`,
  },
  {
    id: 'scarf', name: 'Scarf', slot: 'neck', price: 6,
    art: () => `<path d="M13 4 l4 22 l9 -2 l-5 -21Z" fill="#ef4565"/><path d="M-30 -4 Q0 8 30 -4 L30 4 Q0 16 -30 4Z" fill="#ef4565"/><path d="M-20 -1 v8 M-6 2 v9 M8 2 v9 M22 -1 v8" stroke="#ffc93c" stroke-width="3"/>`,
  },
  {
    id: 'gold-chain', name: 'Gold Chain', slot: 'neck', price: 9,
    art: () => `<path d="M-22 -6 Q0 14 22 -6" stroke="#e8a200" stroke-width="2.5" fill="none" stroke-dasharray="3 2"/><circle cy="10" r="7.5" fill="#ffc93c" stroke="#d98a00" stroke-width="2"/><circle cy="10" r="3.8" fill="none" stroke="#e8a200" stroke-width="1.2"/>`,
  },
];

export const ITEM_BY_ID = new Map(ITEMS.map((i) => [i.id, i]));

const ANCHORS: Record<Character, { hatY: number; hatScale: number; eyeY: number; gap: number; neckY: number; neckScale: number }> = {
  pig: { hatY: 60, hatScale: 1, eyeY: 104, gap: 22, neckY: 160, neckScale: 1.1 },
  male: { hatY: 52, hatScale: 0.95, eyeY: 102, gap: 16, neckY: 151, neckScale: 1 },
  female: { hatY: 48, hatScale: 0.95, eyeY: 102, gap: 16, neckY: 151, neckScale: 1 },
  nonbinary: { hatY: 42, hatScale: 1, eyeY: 102, gap: 16, neckY: 151, neckScale: 1 },
};

export function renderAccessories(character: Character, equipped: Equipped): string {
  const a = ANCHORS[character];
  const get = (slot: Slot) => {
    const item = equipped[slot] ? ITEM_BY_ID.get(equipped[slot]!) : undefined;
    return item?.slot === slot ? item : undefined;
  };
  const neck = get('neck');
  const eyes = get('eyes');
  const hat = get('hat');
  return [
    neck && `<g transform="translate(100 ${a.neckY}) scale(${a.neckScale})">${neck.art(0)}</g>`,
    eyes && `<g transform="translate(100 ${a.eyeY})">${eyes.art(a.gap)}</g>`,
    hat && `<g transform="translate(100 ${a.hatY}) scale(${a.hatScale})">${hat.art(0)}</g>`,
  ]
    .filter(Boolean)
    .join('');
}

const PREVIEW_BOX: Record<Slot, string> = { hat: '-46 -52 92 64', eyes: '-34 -14 68 28', neck: '-34 -14 68 44' };

export function renderItemPreview(item: Item): string {
  return `<svg viewBox="${PREVIEW_BOX[item.slot]}" aria-hidden="true">${item.art(14)}</svg>`;
}
