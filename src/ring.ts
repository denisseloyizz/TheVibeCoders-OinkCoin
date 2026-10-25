import { formatMoney, isWant, type Analysis, type CategoryStat } from './budget';
import { catLabel } from './labels';
import { t } from './i18n';
import { LINE } from './icons';
import type { Category } from './types';
import { esc } from './util';

export const CATEGORY_COLORS: Record<Category, string> = {
  Shopping: '#ff5c9a',
  'Food & Dining': '#ffb000',
  Entertainment: '#8b5cf6',
  Transport: '#22a7e0',
  Bills: '#5b3fa6',
  Groceries: '#2fb36b',
  Health: '#3b82f6',
  Other: '#a59aa1',
};

const GLYPHS: Record<Category, string> = {
  Bills: '<path d="M4 11 12 4l8 7v9h-6v-6h-4v6H4z"/>',
  Transport: '<path d="M5 16l1.6-5.4C7 9.4 7.8 9 9 9h6c1.2 0 2 .4 2.4 1.6L19 16v3h-2.5v-1.5h-9V19H5z"/><circle cx="8" cy="15" r="1.3" fill="#0003"/><circle cx="16" cy="15" r="1.3" fill="#0003"/>',
  Groceries: '<path d="M3 5h3l2 10h10l2-7H7" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="9" cy="18.5" r="1.6"/><circle cx="17" cy="18.5" r="1.6"/>',
  Health: '<path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"/>',
  'Food & Dining': '<path d="M7 3v7M5 3v5c0 1.2.9 2 2 2s2-.8 2-2V3M7 10v11M17 3c-2.5 2-3 5-3 8h3v10" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  Shopping: '<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5C9 4.6 10.3 3 12 3s3 1.6 3 3.5V8" fill="none" stroke="#fff" stroke-width="2"/>',
  Entertainment: '<path d="M3 8c1.1 0 2-.9 2-2h14c0 1.1.9 2 2 2v8c-1.1 0-2 .9-2 2H5c0-1.1-.9-2-2-2z"/><path d="M10 9.5v5l4-2.5z" fill="#0003"/>',
  Other: '<circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>',
};

export function categoryIcon(c: Category): string {
  return `<span class="cat-icon" style="background:${CATEGORY_COLORS[c]}"><svg viewBox="0 0 24 24" aria-hidden="true"><g fill="#fff">${GLYPHS[c]}</g></svg></span>`;
}

function tag(c: Category): string {
  if (isWant(c)) return `<span class="tag want">${t('Want')}</span>`;
  return c === 'Other' ? '' : `<span class="tag need">${t('Need')}</span>`;
}

const R = 136;
const C = 2 * Math.PI * R;
const ARC = C * 0.75; // 270-degree gauge, open at the bottom

export function renderArc(a: Analysis, budget: number, selected: Category | null): string {
  const total = Math.max(budget, a.spent);
  const items = a.categories.filter((c) => c.spent > 0);
  const gap = items.length > 1 ? 3 : 0;
  let offset = 0;
  const segments = items
    .map((c) => {
      const len = (c.spent / total) * ARC;
      const state = selected ? (selected === c.category ? ' selected' : ' dim') : '';
      const seg = `<circle class="arc-seg${state}" data-cat="${esc(c.category)}" cx="150" cy="150" r="${R}" stroke="${CATEGORY_COLORS[c.category]}" stroke-dasharray="${Math.max(len - gap, 1)} ${C}" stroke-dashoffset="${-offset}"><title>${esc(catLabel(c.category))}: ${formatMoney(c.spent)}</title></circle>`;
      offset += len;
      return seg;
    })
    .join('');

  return `<svg class="arc" viewBox="0 0 300 300" aria-hidden="true">
    <g transform="rotate(135 150 150)" fill="none">
      <circle cx="150" cy="150" r="${R}" stroke="#f1edef" stroke-width="14" stroke-linecap="round" stroke-dasharray="${ARC} ${C}"/>
      ${segments}
    </g>
  </svg>`;
}

export function renderCategoryDetail(c: CategoryStat, totalSpent: number): string {
  const diff = c.limit - c.spent;
  const over = diff < 0;
  const share = totalSpent > 0 ? Math.round((c.spent / totalSpent) * 100) : 0;
  const fill = c.limit > 0 ? Math.min(100, (c.spent / c.limit) * 100) : c.spent > 0 ? 100 : 0;
  return `<div class="cat-detail">
    <div class="cat-title">${categoryIcon(c.category)}<strong style="color:${CATEGORY_COLORS[c.category]}">${esc(catLabel(c.category))}</strong>${tag(c.category)}</div>
    <p class="amt">${formatMoney(c.spent)} <span>${t('of {amount}', { amount: formatMoney(c.limit) })}</span></p>
    <div class="bar"><div class="fill ${over ? 'over' : 'ok'}" style="width:${fill}%"></div></div>
    <div class="split">
      <div><b class="${over ? 'neg' : ''}">${formatMoney(Math.abs(diff))}</b><small>${over ? t('over budget') : t('under budget')}</small></div>
      <div><b>${share}%</b><small>${t('of total spending')}</small></div>
    </div>
  </div>`;
}

export function renderCategoryList(a: Analysis, selected: Category): string {
  return `<ul class="cat-list">${a.categories
    .map((c) => {
      const isSel = c.category === selected;
      const fill = c.limit > 0 ? Math.min(100, c.ratio * 100) : c.spent > 0 ? 100 : 0;
      return `<li>
        <button class="cat-row${isSel ? ' selected' : ''}" data-cat="${esc(c.category)}" aria-pressed="${isSel}">
          ${categoryIcon(c.category)}
          <div class="cat-info">
            <div class="cat-name">${esc(catLabel(c.category))}${tag(c.category)}</div>
            <div class="cat-amt">${formatMoney(c.spent)} <span>${t('of {amount}', { amount: formatMoney(c.limit) })}</span></div>
            <div class="bar"><div class="fill ${c.ratio > 1 ? 'over' : 'ok'}" style="width:${fill}%"></div></div>
          </div>
          <span class="chev" aria-hidden="true">${LINE.chevronRight}</span>
        </button>
      </li>`;
    })
    .join('')}</ul>`;
}
