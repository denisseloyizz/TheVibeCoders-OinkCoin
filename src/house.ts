import { renderAvatar } from './avatar';
import type { Character, Equipped, Mood } from './types';

export type HouseSlot = 'wall' | 'floor' | 'art' | 'bed' | 'plant' | 'lamp';
export type House = Partial<Record<HouseSlot, string>>;

export interface HouseItem {
  id: string;
  name: string;
  slot: HouseSlot;
  price: number;
  /** SVG in the 320x220 room. `id` keeps pattern ids unique when several rooms are on the page. */
  art: (id: string) => string;
}

export const HOUSE_SECTIONS: { slot: HouseSlot; title: string }[] = [
  { slot: 'wall', title: 'Wallpaper' },
  { slot: 'floor', title: 'Floors' },
  { slot: 'art', title: 'Wall art' },
  { slot: 'bed', title: 'Beds & seats' },
  { slot: 'plant', title: 'Plants' },
  { slot: 'lamp', title: 'Lights' },
];

const WALL = 'x="0" y="0" width="320" height="150"';
const FLOOR = 'x="0" y="150" width="320" height="70"';

export const HOUSE_ITEMS: HouseItem[] = [
  // Wallpaper
  {
    id: 'wall-stripes',
    name: 'Pink stripes',
    slot: 'wall',
    price: 15,
    art: (id) => `<defs><pattern id="${id}-st" width="24" height="24" patternUnits="userSpaceOnUse">
        <rect width="24" height="24" fill="#fde7f0"/><rect width="10" height="24" fill="#fbd3e3"/></pattern></defs>
      <rect ${WALL} fill="url(#${id}-st)"/>`,
  },
  {
    id: 'wall-dots',
    name: 'Gold dots',
    slot: 'wall',
    price: 15,
    art: (id) => `<defs><pattern id="${id}-dt" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="#fff8e6"/><circle cx="11" cy="11" r="3" fill="#f2c45a"/></pattern></defs>
      <rect ${WALL} fill="url(#${id}-dt)"/>`,
  },
  {
    id: 'wall-stars',
    name: 'Starry night',
    slot: 'wall',
    price: 25,
    art: (id) => `<defs><pattern id="${id}-sk" width="60" height="50" patternUnits="userSpaceOnUse">
        <rect width="60" height="50" fill="#2b2f5c"/>
        <path d="M12 10l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z" fill="#ffe27a"/>
        <circle cx="42" cy="32" r="1.6" fill="#fff"/><circle cx="30" cy="8" r="1.2" fill="#fff"/></pattern></defs>
      <rect ${WALL} fill="url(#${id}-sk)"/>`,
  },
  // Floors
  {
    id: 'floor-wood',
    name: 'Wood floor',
    slot: 'floor',
    price: 12,
    art: (id) => `<defs><pattern id="${id}-wd" width="80" height="18" patternUnits="userSpaceOnUse">
        <rect width="80" height="18" fill="#c98f5e"/><path d="M0 17.5H80M40 0V18" stroke="#a8724a" stroke-width="1.5"/></pattern></defs>
      <rect ${FLOOR} fill="url(#${id}-wd)"/>`,
  },
  {
    id: 'floor-check',
    name: 'Checkered tiles',
    slot: 'floor',
    price: 18,
    art: (id) => `<defs><pattern id="${id}-ck" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="#fff"/><rect width="14" height="14" fill="#1d1a1c"/><rect x="14" y="14" width="14" height="14" fill="#1d1a1c"/></pattern></defs>
      <rect ${FLOOR} fill="url(#${id}-ck)"/>`,
  },
  {
    id: 'floor-rug',
    name: 'Cloud rug',
    slot: 'floor',
    price: 20,
    art: () => `<rect ${FLOOR} fill="#e9d3b8"/>
      <path d="M70 196c-18 0-22-22 0-24 4-12 30-14 38-4 10-10 40-8 46 4 14-6 40-2 40 10 22 2 20 24 0 24z" fill="#cfe6ff" stroke="#9cc6f2" stroke-width="2"/>`,
  },
  // Wall art
  {
    id: 'art-coin',
    name: 'Coin poster',
    slot: 'art',
    price: 10,
    art: () => `<g transform="translate(30 30)"><rect width="56" height="70" rx="4" fill="#fff" stroke="#b97f00" stroke-width="3"/>
      <circle cx="28" cy="32" r="16" fill="#ffc93c" stroke="#d98a00" stroke-width="2.5"/><text x="28" y="38" text-anchor="middle" font-size="16" font-weight="700" fill="#a56f00" font-family="sans-serif">$</text>
      <rect x="12" y="56" width="32" height="5" rx="2.5" fill="#f2b230"/></g>`,
  },
  {
    id: 'art-window',
    name: 'Sunny window',
    slot: 'art',
    price: 16,
    art: () => `<g transform="translate(26 26)"><rect width="74" height="64" rx="4" fill="#bfe3ff" stroke="#fff" stroke-width="5"/>
      <circle cx="56" cy="18" r="9" fill="#ffd34d"/><path d="M8 50c6-8 16-8 22 0 6-6 14-6 18 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M37 0V64M0 32H74" stroke="#fff" stroke-width="4"/></g>`,
  },
  // Beds & seats
  {
    id: 'bed-cozy',
    name: 'Cozy bed',
    slot: 'bed',
    price: 30,
    art: () => `<g transform="translate(222 118)"><rect x="0" y="22" width="88" height="34" rx="6" fill="#e5487f"/>
      <rect x="0" y="0" width="12" height="62" rx="4" fill="#a8724a"/><rect x="8" y="14" width="26" height="14" rx="6" fill="#fff"/>
      <rect x="30" y="18" width="58" height="18" rx="6" fill="#ff9cc2"/><rect x="80" y="30" width="10" height="32" rx="4" fill="#a8724a"/></g>`,
  },
  {
    id: 'bed-beanbag',
    name: 'Bean bag',
    slot: 'bed',
    price: 18,
    art: () => `<g transform="translate(238 138)"><path d="M0 40c-4-26 18-44 38-40 20 4 36 18 34 40z" fill="#8b5cf6"/>
      <path d="M14 22c8-8 22-10 32-4" stroke="#b69cff" stroke-width="5" fill="none" stroke-linecap="round"/></g>`,
  },
  // Plants
  {
    id: 'plant-cactus',
    name: 'Cactus',
    slot: 'plant',
    price: 8,
    art: () => `<g transform="translate(22 130)"><rect x="0" y="30" width="30" height="24" rx="4" fill="#d9774a"/>
      <rect x="9" y="0" width="12" height="34" rx="6" fill="#3ccf91"/><rect x="0" y="10" width="9" height="14" rx="4.5" fill="#3ccf91"/>
      <rect x="21" y="6" width="9" height="14" rx="4.5" fill="#3ccf91"/></g>`,
  },
  {
    id: 'plant-monstera',
    name: 'Big leafy plant',
    slot: 'plant',
    price: 14,
    art: () => `<g transform="translate(14 104)"><rect x="12" y="56" width="34" height="28" rx="4" fill="#fff" stroke="#ece7e9" stroke-width="2"/>
      <ellipse cx="18" cy="30" rx="16" ry="12" fill="#1f9d63" transform="rotate(-30 18 30)"/>
      <ellipse cx="42" cy="26" rx="16" ry="12" fill="#2bb673" transform="rotate(25 42 26)"/>
      <ellipse cx="30" cy="10" rx="12" ry="10" fill="#1f9d63"/><path d="M29 56V16" stroke="#1f7a4d" stroke-width="3"/></g>`,
  },
  // Lights
  {
    id: 'lamp-lava',
    name: 'Lava lamp',
    slot: 'lamp',
    price: 12,
    art: () => `<g transform="translate(196 132)"><path d="M6 46h20l-4-40h-12z" fill="#ff8fb3" opacity=".85"/>
      <circle cx="16" cy="20" r="4" fill="#ffc93c"/><circle cx="13" cy="34" r="3" fill="#ffc93c"/>
      <rect x="4" y="44" width="24" height="8" rx="2" fill="#3e4f86"/><rect x="8" y="0" width="16" height="8" rx="2" fill="#3e4f86"/></g>`,
  },
  {
    id: 'lamp-fairy',
    name: 'Fairy lights',
    slot: 'lamp',
    price: 20,
    art: () => `<path d="M0 12Q80 40 160 14T320 14" stroke="#5b4b52" stroke-width="1.5" fill="none"/>` +
      [20, 52, 84, 116, 148, 180, 212, 244, 276, 304]
        .map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 24 : 28}" r="4.5" fill="${['#ffd34d', '#ff8fb3', '#8fd3ff', '#b69cff'][i % 4]}"/>`)
        .join(''),
  },
];

export const HOUSE_ITEM_BY_ID = new Map(HOUSE_ITEMS.map((i) => [i.id, i]));

let uid = 0;

/** Draw order: wall, floor, then things on the wall and floor, buddy in front. */
const LAYERS: HouseSlot[] = ['wall', 'floor', 'art', 'lamp', 'plant', 'bed'];

export interface Resident {
  character: Character;
  mood: Mood;
  equipped: Equipped;
}

/** A room with the given decor, and optionally a buddy standing in it. */
export function renderHouse(house: House, resident: Resident | null, label = 'House'): string {
  const id = `house${++uid}`;
  const art = (slot: HouseSlot) => {
    const item = house[slot] ? HOUSE_ITEM_BY_ID.get(house[slot]!) : undefined;
    return item ? item.art(`${id}-${slot}`) : '';
  };
  const fainted = resident?.mood === 'dead';
  return `<svg class="house${fainted ? ' house-fainted' : ''}" viewBox="0 0 320 220" role="img" aria-label="${label}">
    <rect ${WALL} fill="#fdf1e7"/>
    <rect ${FLOOR} fill="#e9d3b8"/>
    ${LAYERS.map(art).join('')}
    <rect x="0" y="146" width="320" height="6" fill="#fff" opacity=".7"/>
    ${resident ? `<ellipse cx="160" cy="200" rx="40" ry="7" fill="#000" opacity=".12"/>${renderAvatar(resident.character, resident.mood, resident.equipped, true).replace(/^<svg/, '<svg x="100" y="84" width="120" height="120"')}` : ''}
    ${fainted ? '<rect x="0" y="0" width="320" height="220" fill="#1d1a1c" opacity=".18"/>' : ''}
  </svg>`;
}

export function renderHousePreview(item: HouseItem): string {
  return renderHouse({ [item.slot]: item.id }, null, item.name);
}
