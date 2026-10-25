import { renderAccessories } from './accessories';
import type { Character, Equipped, Mood } from './types';

export const CHARACTERS: { id: Character; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'nonbinary', label: 'Non-binary' },
  { id: 'pig', label: 'Piggy' },
];

const INK = '#3a2530';
const SKIN_SHADE = '#eba57c';
let uid = 0;

function defs(id: string): string {
  return `<defs>
    <radialGradient id="${id}-bg" cx="30%" cy="25%" r="85%"><stop offset="0" stop-color="#fdfaf6"/><stop offset="1" stop-color="#f6e6ec"/></radialGradient>
    <radialGradient id="${id}-skin" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#ffe6d2"/><stop offset="1" stop-color="#f3b48c"/></radialGradient>
    <radialGradient id="${id}-pig" cx="40%" cy="30%" r="75%"><stop offset="0" stop-color="#ffe4ef"/><stop offset="1" stop-color="#f792b9"/></radialGradient>
    <linearGradient id="${id}-coin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff07a"/><stop offset="1" stop-color="#f2a900"/></linearGradient>
    <clipPath id="${id}-clip"><circle cx="100" cy="100" r="96"/></clipPath>
    <filter id="${id}-gray"><feColorMatrix type="saturate" values="0.08"/></filter>
  </defs>`;
}

function face(mood: Mood, cx: number, eyeY: number, mouthY: number, gap: number): string {
  const lx = cx - gap;
  const rx = cx + gap;
  const by = eyeY - 13;
  const my = mouthY;

  const eye = (x: number) =>
    mood === 'happy'
      ? `<path d="M${x - 6} ${eyeY + 1} Q${x} ${eyeY - 7} ${x + 6} ${eyeY + 1}" stroke="${INK}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
      : mood === 'dead'
        ? `<path d="M${x - 5} ${eyeY - 5} L${x + 5} ${eyeY + 5} M${x + 5} ${eyeY - 5} L${x - 5} ${eyeY + 5}" stroke="${INK}" stroke-width="3.2" stroke-linecap="round"/>`
        : `<ellipse cx="${x}" cy="${eyeY}" rx="4.6" ry="5.8" fill="${INK}"/><circle cx="${x - 1.6}" cy="${eyeY - 2.2}" r="1.8" fill="#fff"/>`;

  // [outer, middle, inner] brow offsets; angry is a V, sad slants up in the middle.
  const browShape: Record<Mood, number[] | null> = { happy: [1, -5, 1], okay: [0, -1, 0], sad: [3, 0, -6], angry: [-5, -1, 5], dead: null };
  const shape = browShape[mood];
  const brows = shape
    ? `<path d="M${lx - 8} ${by + shape[0]} Q${lx} ${by + shape[1]} ${lx + 7} ${by + shape[2]} M${rx + 8} ${by + shape[0]} Q${rx} ${by + shape[1]} ${rx - 7} ${by + shape[2]}" stroke="${INK}" stroke-width="${mood === 'angry' ? 3.4 : 2.6}" fill="none" stroke-linecap="round" opacity=".85"/>`
    : '';

  const mouths: Record<Mood, string> = {
    happy: `<path d="M${cx - 13} ${my} Q${cx} ${my + 20} ${cx + 13} ${my} Z" fill="#8c2f45"/><ellipse cx="${cx}" cy="${my + 6.5}" rx="5.5" ry="2.8" fill="#ff7a9c"/>`,
    okay: `<path d="M${cx - 10} ${my + 2} Q${cx} ${my + 10} ${cx + 10} ${my + 2}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    sad: `<path d="M${cx - 11} ${my + 10} Q${cx} ${my} ${cx + 11} ${my + 10}" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    angry: `<rect x="${cx - 11}" y="${my + 1}" width="22" height="10" rx="3" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M${cx - 11} ${my + 6} H${cx + 11} M${cx - 4} ${my + 1} V${my + 11} M${cx + 4} ${my + 1} V${my + 11}" stroke="${INK}" stroke-width="1.5"/>`,
    dead: `<ellipse cx="${cx + 4}" cy="${my + 10}" rx="4" ry="5" fill="#ff7a9c"/><path d="M${cx - 10} ${my + 6} q5 -4 10 0 t10 0" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  };

  const blush =
    mood === 'dead'
      ? ''
      : mood === 'angry'
        ? `<ellipse cx="${lx - 7}" cy="${eyeY + 13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/><ellipse cx="${rx + 7}" cy="${eyeY + 13}" rx="8" ry="5" fill="#ff4d4d" opacity=".55"/>`
        : `<ellipse cx="${lx - 7}" cy="${eyeY + 13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${mood === 'sad' ? 0.25 : 0.6}"/><ellipse cx="${rx + 7}" cy="${eyeY + 13}" rx="7" ry="4.5" fill="#ff8fb3" opacity="${mood === 'sad' ? 0.25 : 0.6}"/>`;

  const extra =
    mood === 'sad'
      ? `<path class="tear" d="M${rx + 1} ${eyeY + 8} q-5 9 0 12 q5 -3 0 -12z" fill="#7cc8f5"/>`
      : mood === 'angry'
        ? `<path class="anger" transform="translate(${rx + 22} ${eyeY - 30})" d="M-7 -2 Q-2 -2 -2 -7 M2 -7 Q2 -2 7 -2 M7 2 Q2 2 2 7 M-2 7 Q-2 2 -7 2" stroke="#ef4565" stroke-width="3" fill="none" stroke-linecap="round"/>`
        : '';

  return brows + eye(lx) + eye(rx) + blush + mouths[mood] + extra;
}

const HUMAN: Record<Exclude<Character, 'pig'>, { hair: string; shirt: string; back: string; front: string; extra: string }> = {
  male: {
    hair: '#3b2416',
    shirt: '#ffc93c',
    back: '',
    front: '<path d="M58 100 C54 60 80 44 104 46 C132 48 148 66 142 100 C138 86 130 76 118 72 C104 80 82 82 68 76 C62 84 60 92 58 100Z"/><path d="M84 54 C96 48 112 50 122 56" stroke="#6b4430" stroke-width="3" fill="none" stroke-linecap="round"/>',
    extra: '',
  },
  female: {
    hair: '#8a4b2a',
    shirt: '#ff6fa5',
    back: '<path d="M56 96 C50 50 80 36 100 36 C124 36 152 50 146 100 C150 130 156 150 150 172 C138 176 128 168 124 160 L76 160 C72 168 62 176 50 172 C44 150 50 130 56 96Z"/>',
    front: '<path d="M60 96 C58 62 82 50 104 50 C128 50 144 66 142 96 C132 76 116 66 96 70 C84 80 72 88 60 96Z"/><path d="M80 58 C92 52 108 52 120 58" stroke="#b46a42" stroke-width="3" fill="none" stroke-linecap="round"/>',
    extra: '<g transform="translate(130 64) rotate(-25)"><rect x="-11" y="-4" width="22" height="8" rx="4" fill="#ffd23f" stroke="#e8a900" stroke-width="1.5"/><circle cx="-5" cy="0" r="1.6" fill="#fff"/></g>',
  },
  nonbinary: {
    hair: '#ff8fb8',
    shirt: '#ffd23f',
    back: [[64, 92, 16], [68, 68, 18], [86, 52, 20], [114, 52, 20], [132, 68, 18], [136, 92, 16]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`)
      .join(''),
    front: '<circle cx="80" cy="64" r="14"/><circle cx="100" cy="60" r="14"/><circle cx="120" cy="64" r="14"/><path d="M86 52 C94 48 104 48 112 52" stroke="#ffc2d8" stroke-width="3" fill="none" stroke-linecap="round"/>',
    extra: '',
  },
};

function human(id: string, character: Exclude<Character, 'pig'>, mood: Mood): string {
  const h = HUMAN[character];
  return `
    <g clip-path="url(#${id}-clip)">
      <g fill="${h.hair}">${h.back}</g>
      <rect x="88" y="124" width="24" height="34" rx="10" fill="${SKIN_SHADE}"/>
      <path d="M34 210 C36 160 64 148 100 148 C136 148 164 160 166 210Z" fill="${h.shirt}"/>
      <path d="M84 149 Q100 172 116 149Z" fill="${SKIN_SHADE}"/>
    </g>
    <circle cx="61" cy="104" r="9" fill="${SKIN_SHADE}"/><circle cx="139" cy="104" r="9" fill="${SKIN_SHADE}"/>
    <ellipse cx="100" cy="100" rx="40" ry="44" fill="url(#${id}-skin)"/>
    <path d="M97 110 Q100 114 103 110" stroke="#d98b62" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <g fill="${h.hair}">${h.front}</g>
    ${h.extra}
    ${face(mood, 100, 102, 122, 16)}`;
}

function pig(id: string, mood: Mood, hasHat: boolean): string {
  const ear = `<path d="M62 78 C54 58 60 46 82 60 C78 68 70 74 62 78Z" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2" stroke-linejoin="round"/><path d="M65 70 C62 60 66 55 76 62 C73 66 69 68 65 70Z" fill="#ff6f9f" opacity=".55"/>`;
  const leg = (x: number, y: number) =>
    `<rect x="${x}" y="${y}" width="16" height="20" rx="7" fill="#f78fb6" stroke="#ec7aa6" stroke-width="2"/><rect x="${x + 2}" y="${y + 13}" width="12" height="5" rx="2.5" fill="#e0709b"/>`;
  const coin =
    mood === 'happy' && !hasHat
      ? `<g class="coin-drop"><circle cx="100" cy="40" r="10" fill="url(#${id}-coin)" stroke="#e09a00" stroke-width="2"/><circle cx="100" cy="40" r="5" fill="none" stroke="#e8a900" stroke-width="1.5"/></g>`
      : '';
  return `
    <ellipse cx="100" cy="175" rx="54" ry="6" fill="#3a2530" opacity=".08"/>
    <path d="M154 112 c12 -6 16 8 6 10 c-8 1 -7 -9 3 -12" stroke="#ec7aa6" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    ${leg(62, 146)}${leg(122, 146)}
    ${ear}<g transform="translate(200 0) scale(-1 1)">${ear}</g>
    <ellipse cx="100" cy="112" rx="58" ry="50" fill="url(#${id}-pig)" stroke="#ec7aa6" stroke-width="2"/>
    <ellipse cx="74" cy="84" rx="13" ry="7" fill="#fff" opacity=".35" transform="rotate(-25 74 84)"/>
    ${leg(76, 154)}${leg(108, 154)}
    <rect x="91" y="65" width="18" height="4" rx="2" fill="#d94f84" opacity=".45"/>
    ${coin}
    <ellipse cx="100" cy="124" rx="15" ry="10.5" fill="#ff9cc2" stroke="#f27aa6" stroke-width="2"/>
    <ellipse cx="95" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    <ellipse cx="105" cy="124" rx="2.4" ry="3.8" fill="#c9466f"/>
    ${face(mood, 100, 104, 138, 22)}`;
}

/** `bare` leaves out the round background, for drawing the buddy inside a scene like a house. */
export function renderAvatar(character: Character, mood: Mood, equipped: Equipped = {}, bare = false): string {
  const id = `av${++uid}`;
  const body = character === 'pig' ? pig(id, mood, Boolean(equipped.hat)) : human(id, character, mood);
  const dead = mood === 'dead';
  return `<svg class="avatar avatar-${mood}" viewBox="0 0 200 200" role="img" aria-label="${character} avatar feeling ${mood}">
    ${defs(id)}
    ${bare ? '' : `<circle cx="100" cy="100" r="96" fill="url(#${id}-bg)"/>`}
    <g ${dead ? `filter="url(#${id}-gray)"` : ''}>${body}${renderAccessories(character, equipped)}</g>
    ${dead ? `<ellipse class="halo" cx="100" cy="24" rx="30" ry="7" fill="none" stroke="#ffc93c" stroke-width="5"/>` : ''}
  </svg>`;
}
