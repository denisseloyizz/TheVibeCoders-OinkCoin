import { ITEMS, renderItemPreview, type Item } from './accessories';
import { renderAvatar } from './avatar';
import { formatMoney } from './budget';
import { ICONS } from './icons';
import { COINS_PER_GOAL, currentWeekWants, weeklyWantsLimit } from './rewards';
import type { AppState, Profile, Slot } from './types';
import { esc } from './util';

const SECTIONS: { slot: Slot; title: string }[] = [
  { slot: 'hat', title: 'Hats' },
  { slot: 'eyes', title: 'Glasses' },
  { slot: 'neck', title: 'Neckwear' },
];

function itemCard(item: Item, state: AppState): string {
  const owned = state.owned.includes(item.id);
  const wearing = state.equipped[item.slot] === item.id;
  const action = owned
    ? `<button class="small ${wearing ? 'secondary' : ''}" data-wear="${item.id}">${wearing ? 'Take off' : 'Wear'}</button>`
    : `<button class="small buy" data-buy="${item.id}" ${state.coins < item.price ? 'disabled' : ''} aria-label="Buy ${esc(item.name)} for ${item.price} coins">${ICONS.coin}${item.price}</button>`;
  return `<div class="shop-item${wearing ? ' wearing' : ''}">
    <div class="shop-art">${renderItemPreview(item)}</div>
    <span class="shop-name">${esc(item.name)}</span>
    ${action}
  </div>`;
}

export function renderStore(state: AppState, profile: Profile): string {
  const week = currentWeekWants(state);
  const pct = week.limit > 0 ? Math.min(100, (week.spent / week.limit) * 100) : 0;
  return `
    <section class="card store-hero">
      <div class="store-preview">${renderAvatar(profile.character, 'happy', state.equipped)}</div>
      <div class="store-balance">
        <small>Your coins</small>
        <strong>${ICONS.coin}${state.coins}</strong>
      </div>
      <div class="earn">
        <p>Earn <b>${COINS_PER_GOAL} coins</b> each week your wants stay under ${formatMoney(weeklyWantsLimit(profile))}, and each month you stay on budget.</p>
        <div class="meter-head"><span>This week's wants</span><b>${formatMoney(week.spent)} / ${formatMoney(week.limit)}</b></div>
        <div class="bar"><div class="fill ${week.spent > week.limit ? 'over' : 'ok'}" style="width:${pct}%"></div></div>
      </div>
    </section>
    ${SECTIONS.map(
      (s) => `
      <section class="card">
        <h2>${s.title}</h2>
        <div class="shop-grid">${ITEMS.filter((i) => i.slot === s.slot)
          .map((i) => itemCard(i, state))
          .join('')}</div>
      </section>`,
    ).join('')}`;
}
