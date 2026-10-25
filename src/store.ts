import { ITEMS, renderItemPreview, type Item } from './accessories';
import { renderAvatar } from './avatar';
import { formatMoney } from './budget';
import { HOUSE_ITEMS, HOUSE_SECTIONS, renderHousePreview, type HouseItem } from './house';
import { t, T } from './i18n';
import { ICONS } from './icons';
import { COINS_PER_GOAL, currentWeekWants, weeklyWantsLimit } from './rewards';
import type { AppState, Profile, Slot } from './types';
import { esc } from './util';

const SECTIONS: { slot: Slot; title: string }[] = [
  { slot: 'hat', title: T('Hats') },
  { slot: 'eyes', title: T('Glasses') },
  { slot: 'neck', title: T('Neckwear') },
];

function itemCard(item: Item, state: AppState): string {
  const owned = state.owned.includes(item.id);
  const wearing = state.equipped[item.slot] === item.id;
  const action = owned
    ? `<button class="small ${wearing ? 'secondary' : ''}" data-wear="${item.id}">${wearing ? t('Take off') : t('Wear')}</button>`
    : `<button class="small buy" data-buy="${item.id}" ${state.coins < item.price ? 'disabled' : ''} aria-label="${esc(t('Buy {item} for {price} coins', { item: t(item.name), price: item.price }))}">${ICONS.coin}${item.price}</button>`;
  return `<div class="shop-item${wearing ? ' wearing' : ''}">
    <div class="shop-art">${renderItemPreview(item)}</div>
    <span class="shop-name">${esc(t(item.name))}</span>
    ${action}
  </div>`;
}

function houseItemCard(item: HouseItem, state: AppState): string {
  const owned = state.owned.includes(item.id);
  const placed = state.house[item.slot] === item.id;
  const action = owned
    ? `<button class="small ${placed ? 'secondary' : ''}" data-place="${item.id}">${placed ? t('Remove') : t('Place')}</button>`
    : `<button class="small buy" data-buy-house="${item.id}" ${state.coins < item.price ? 'disabled' : ''} aria-label="${esc(t('Buy {item} for {price} coins', { item: t(item.name), price: item.price }))}">${ICONS.coin}${item.price}</button>`;
  return `<div class="shop-item house-item${placed ? ' wearing' : ''}">
    <div class="shop-art">${renderHousePreview(item)}</div>
    <span class="shop-name">${esc(t(item.name))}</span>
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
        <small>${t('Your coins')}</small>
        <strong>${ICONS.coin}${state.coins}</strong>
      </div>
      <div class="earn">
        <p>${t('Earn <b>{n} coins</b> each week your wants stay under {amount}, and each month you stay on budget.', { n: COINS_PER_GOAL, amount: formatMoney(weeklyWantsLimit(profile)) })}</p>
        <div class="meter-head"><span>${t("This week's wants")}</span><b>${formatMoney(week.spent)} / ${formatMoney(week.limit)}</b></div>
        <div class="bar"><div class="fill ${week.spent > week.limit ? 'over' : 'ok'}" style="width:${pct}%"></div></div>
      </div>
    </section>
    ${SECTIONS.map(
      (s) => `
      <section class="card">
        <h2>${t(s.title)}</h2>
        <div class="shop-grid">${ITEMS.filter((i) => i.slot === s.slot)
          .map((i) => itemCard(i, state))
          .join('')}</div>
      </section>`,
    ).join('')}
    <section class="card">
      <h2>${t('For your house')}</h2>
      <p class="hint">${t("Decorate {name}'s house. Friends see it when they visit.", { name: esc(profile.name) })}</p>
      ${HOUSE_SECTIONS.map(
        (s) => `
        <h3>${t(s.title)}</h3>
        <div class="shop-grid">${HOUSE_ITEMS.filter((i) => i.slot === s.slot)
          .map((i) => houseItemCard(i, state))
          .join('')}</div>`,
      ).join('')}
    </section>`;
}
