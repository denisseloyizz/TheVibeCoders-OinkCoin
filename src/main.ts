import './style.css';
import { ITEM_BY_ID } from './accessories';
import { renderAvatar } from './avatar';
import { analyze, formatMoney, localDateKey, type Analysis } from './budget';
import { applyAction, careMood, careNote, currentCare, type CareAction } from './care';
import { ICONS, LINE, line } from './icons';
import { renderLearn } from './learn';
import { brand } from './logo';
import { renderOnboarding } from './onboarding';
import { renderArc, renderCategoryDetail, renderCategoryList } from './ring';
import { COINS_PER_GOAL, findNewAwards } from './rewards';
import { mergeExpenses, readStatementFile } from './statement';
import { emptyState, loadState, saveState } from './storage';
import { renderStore } from './store';
import { CATEGORIES, type Care, type Category, type Expense, type Mood, type Profile } from './types';
import { esc } from './util';

type View = 'buddy' | 'report' | 'store' | 'settings' | 'learn';

const app = document.querySelector<HTMLDivElement>('#app')!;
const state = loadState();
let editing = false;
let view: View = 'buddy';
let viewMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCat: Category | null = null;
let moneyMsg = '';
let reactTimer = 0;

const MOOD_LABEL: Record<Mood, string> = { happy: 'Happy', okay: 'Okay', sad: 'Sad', angry: 'Angry', dead: 'Fainted' };

const MENU: { view: View; label: string; icon: string }[] = [
  { view: 'buddy', label: 'Budget Buddy', icon: LINE.pet },
  { view: 'report', label: 'Full Report', icon: line('<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>') },
  { view: 'store', label: 'Store', icon: line('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>') },
  { view: 'learn', label: 'Grow Your Money', icon: line('<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>') },
  { view: 'settings', label: 'Profile & Settings', icon: line('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>') },
];

const EFFECTS: Record<CareAction, string> = {
  feed: `<div class="fx-food">${ICONS.cookie}</div><span class="fx-plus">+25 Hunger</span>`,
  play: `<div class="fx-ball-x"><div class="fx-ball-y">${ICONS.ball}</div></div><span class="fx-plus">+25 Fun</span>`,
  pet:
    [-40, 0, 40].map((x, i) => `<span class="fx-heart" style="--x:${x}px;--d:${i * 0.25}s">${ICONS.heart}</span>`).join('') +
    '<span class="fx-plus">+20 Love</span>',
};

const CARE_BUTTONS: { action: CareAction; stat: 'hunger' | 'fun' | 'love'; label: string; icon: string; color: string; ring: string }[] = [
  { action: 'feed', stat: 'hunger', label: 'Feed', icon: ICONS.cookie, color: '#fff1d6', ring: '#f2b230' },
  { action: 'play', stat: 'fun', label: 'Play', icon: ICONS.ball, color: '#fde7f0', ring: '#8b5cf6' },
  { action: 'pet', stat: 'love', label: 'Pet', icon: ICONS.heart, color: '#ffe4ea', ring: '#e5487f' },
];

const STAT_NAME = { hunger: 'Hunger', fun: 'Fun', love: 'Love' };
const careLabel = (b: (typeof CARE_BUTTONS)[number], value: number) => `${b.label} (${STAT_NAME[b.stat]} ${value}%)`;

function showToast(html: string): void {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = html;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

function collectRewards(): void {
  const awards = findNewAwards(state);
  if (awards.length === 0) return;
  state.coins += awards.length * COINS_PER_GOAL;
  state.rewards.push(...awards.map((a) => a.key));
  saveState(state);
  const what = awards.length === 1 ? esc(awards[0].label) : `${awards.length} goals`;
  showToast(`${ICONS.coin}<span>Goal met: ${what} &middot; <b>+${awards.length * COINS_PER_GOAL} coins</b></span>`);
}

function persist(): void {
  saveState(state);
  render();
}

function render(): void {
  if (!state.profile || editing) {
    renderOnboarding(
      app,
      state,
      () => {
        editing = false;
        view = 'buddy';
        persist();
      },
      state.profile
        ? () => {
            editing = false;
            render();
          }
        : null,
    );
    return;
  }
  collectRewards();
  renderDashboard(state.profile);
}

const isCurrentMonth = (a: Analysis) => a.monthKey === localDateKey().slice(0, 7);

function monthNav(a: Analysis): string {
  const label = viewMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return `<div class="month-nav">
    <button class="icon" id="prev" aria-label="Previous month">${LINE.chevronLeft}</button>
    <h2>${esc(label)}</h2>
    <button class="icon" id="next" aria-label="Next month" ${isCurrentMonth(a) ? 'disabled' : ''}>${LINE.chevronRight}</button>
  </div>`;
}

function homeHtml(profile: Profile, view: Analysis, now: Analysis, care: Care, mood: Mood): string {
  const message = mood === 'dead' ? now.message : (careNote(profile.name, care) ?? now.message);
  const selected = view.categories.find((c) => c.category === selectedCat) ?? view.topWant ?? view.categories[0];
  const monthName = viewMonth.toLocaleDateString(undefined, { month: 'long' });
  const asOf = isCurrentMonth(view) ? new Date() : new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const dead = mood === 'dead';

  return `
    <section class="card pet-card mood-${mood}">
      ${monthNav(view)}
      <p class="speech">${esc(message)}</p>
      <div class="ring-stage">
        ${renderArc(view, profile.budget, selectedCat)}
        <button class="pet" id="pet" aria-label="Pet ${esc(profile.name)}" ${dead ? 'disabled' : ''}>${renderAvatar(profile.character, mood, state.equipped)}</button>
        <div class="fx" id="fx" aria-hidden="true"></div>
      </div>
      <div class="total">
        <small>Total ${esc(monthName)} Spending</small>
        <strong>${formatMoney(view.spent)}</strong>
        <small>of ${formatMoney(profile.budget)} &middot; as of ${esc(asOf.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }))}</small>
      </div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${formatMoney(view.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${formatMoney(view.wantsSpent)} <span>/ ${formatMoney(view.wantsLimit)}</span></b></div>
      </div>
      <div class="pet-name"><h2>${esc(profile.name)}</h2><span class="mood-badge">${MOOD_LABEL[mood]}</span></div>
      ${now.tip ? `<p class="tip">${LINE.bulb}<span>${esc(now.tip)}</span></p>` : ''}
    </section>

    <section class="card">${renderCategoryDetail(selected, view.spent)}</section>

    <section class="card">
      <h2>Spending categories</h2>
      ${renderCategoryList(view, selected.category)}
    </section>

    <nav class="action-bar" aria-label="Care for your buddy">
      ${CARE_BUTTONS.map(
        (b) =>
          `<button data-action="${b.action}" class="${care[b.stat] < 25 ? 'low' : ''}" style="--c:${b.color};--ring:${b.ring};--v:${care[b.stat]}" aria-label="${careLabel(b, care[b.stat])}" ${dead ? 'disabled' : ''}><span class="bubble">${b.icon}</span><span>${b.label}</span></button>`,
      ).join('')}
      <button data-view="store" class="plain" style="--c:#efe9ff"><span class="bubble">${ICONS.bag}</span><span>Shop</span></button>
    </nav>`;
}

function reportHtml(profile: Profile, view: Analysis): string {
  const expenses = state.expenses
    .filter((e) => e.date.startsWith(view.monthKey))
    .sort((x, y) => y.date.localeCompare(x.date));
  const usage = Math.min(100, Math.round(view.usage * 100));
  const selected = view.categories.find((c) => c.category === selectedCat) ?? view.topWant ?? view.categories[0];
  return `
    <section class="card">
      ${monthNav(view)}
      <div class="stats">
        <div><small>Budget</small><strong>${formatMoney(profile.budget)}</strong></div>
        <div><small>Spent</small><strong>${formatMoney(view.spent)}</strong></div>
        <div><small>Left</small><strong class="${view.remaining < 0 ? 'neg' : 'pos'}">${formatMoney(view.remaining)}</strong></div>
      </div>
      <div class="bar big"><div class="fill ${view.usage > 1 ? 'over' : 'ok'}" style="width:${usage}%"></div></div>
      <div class="nw">
        <div class="need"><small>Needs</small><b>${formatMoney(view.needsSpent)}</b></div>
        <div class="want"><small>Wants</small><b>${formatMoney(view.wantsSpent)} <span>/ ${formatMoney(view.wantsLimit)}</span></b></div>
      </div>
    </section>

    <section class="card">
      <h2>Spending categories</h2>
      ${renderCategoryList(view, selected.category)}
    </section>

    <section class="card">
      <h2>Add expense</h2>
      <form id="expense-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" aria-label="Amount" required />
        <select name="category" aria-label="Category">${CATEGORIES.map((c) => `<option>${esc(c)}</option>`).join('')}</select>
        <input name="note" maxlength="60" placeholder="Note (optional)" aria-label="Note" />
        <input name="date" type="date" value="${localDateKey()}" aria-label="Date" required />
        <button type="submit">Add</button>
      </form>
      <h3>Import bank statement</h3>
      <label class="dropzone small">
        <input type="file" id="statement" accept=".csv,text/csv" />
        <strong>Upload CSV</strong>
      </label>
      ${moneyMsg ? `<p class="import-msg" role="status">${esc(moneyMsg)}</p>` : ''}
    </section>

    <section class="card">
      <h2>Transactions</h2>
      ${
        expenses.length === 0
          ? '<p class="empty">No expenses this month.</p>'
          : `<ul class="expenses">${expenses
              .map(
                (e) => `
            <li>
              <div><strong>${esc(e.category)}</strong>${e.note ? ` - ${esc(e.note)}` : ''}<br /><small>${esc(e.date)}</small></div>
              <span>${formatMoney(e.amount)}</span>
              <button class="icon" data-delete="${esc(e.id)}" aria-label="Delete expense">&times;</button>
            </li>`,
              )
              .join('')}</ul>`
      }
    </section>`;
}

function settingsHtml(profile: Profile): string {
  return `
    <section class="card settings">
      <div class="profile-row">
        ${renderAvatar(profile.character, 'happy', state.equipped)}
        <div><h2>${esc(profile.name)}</h2><p class="hint">Your budget buddy</p></div>
      </div>
      <dl class="facts">
        <div><dt>Monthly budget</dt><dd>${formatMoney(profile.budget)}</dd></div>
        <div><dt>Main goal</dt><dd>${esc(profile.goal)}</dd></div>
        <div><dt>Cutting back on</dt><dd>${profile.focus.length ? esc(profile.focus.join(', ')) : 'Nothing yet'}</dd></div>
        <div><dt>Coins</dt><dd>${state.coins}</dd></div>
        <div><dt>Transactions saved</dt><dd>${state.expenses.length}</dd></div>
      </dl>
      <button id="edit">Edit buddy, budget &amp; quiz</button>
    </section>

    <section class="card">
      <h2>Reset</h2>
      <p class="hint">Delete your buddy, budget and all transactions from this device.</p>
      <button id="reset" class="danger">Reset everything</button>
    </section>`;
}

function drawerHtml(profile: Profile, mood: Mood): string {
  return `
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="Menu">
      <div class="drawer-head">${brand()}<button class="icon" id="close-menu" aria-label="Close menu">${LINE.close}</button></div>
      <div class="drawer-profile">
        ${renderAvatar(profile.character, mood, state.equipped)}
        <div><strong>${esc(profile.name)}</strong><small>${MOOD_LABEL[mood]}</small></div>
      </div>
      <nav>
        ${MENU.map(
          (m) => `<button data-view="${m.view}" ${m.view === view ? 'aria-current="page"' : ''}>${m.icon}<span>${m.label}</span></button>`,
        ).join('')}
      </nav>
    </aside>`;
}

function setDrawer(open: boolean): void {
  document.body.classList.toggle('drawer-open', open);
  app.querySelector('#menu')?.setAttribute('aria-expanded', String(open));
  if (open) app.querySelector<HTMLElement>('#drawer [aria-current]')?.focus();
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setDrawer(false);
});

function renderDashboard(profile: Profile): void {
  const now = analyze(profile, state.expenses);
  const month = analyze(profile, state.expenses, viewMonth);
  const care = currentCare(state.care);
  const mood = careMood(now.mood, care);
  const body = {
    buddy: () => homeHtml(profile, month, now, care, mood),
    report: () => reportHtml(profile, month),
    store: () => renderStore(state, profile),
    learn: () => renderLearn(profile, now),
    settings: () => settingsHtml(profile),
  }[view]();

  setDrawer(false);
  app.innerHTML = `
    <header class="topbar">
      <button class="menu-btn" id="menu" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      ${brand()}
      <button class="coin-chip" data-view="store" aria-label="${state.coins} coins, open store">${ICONS.coin}<b>${state.coins}</b></button>
    </header>
    ${drawerHtml(profile, mood)}
    <main class="stack">${body}</main>`;

  app.querySelector('#menu')!.addEventListener('click', () => setDrawer(true));
  app.querySelector('#close-menu')!.addEventListener('click', () => setDrawer(false));
  app.querySelector('#scrim')!.addEventListener('click', () => setDrawer(false));
  app.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((b) =>
    b.addEventListener('click', () => {
      view = b.dataset.view as View;
      selectedCat = null;
      render();
      window.scrollTo(0, 0);
    }),
  );

  app.querySelector('#edit')?.addEventListener('click', () => {
    editing = true;
    render();
  });
  app.querySelector('#reset')?.addEventListener('click', () => {
    if (!confirm('Delete your buddy and all your data? This cannot be undone.')) return;
    Object.assign(state, emptyState());
    view = 'buddy';
    persist();
  });

  // Store
  app.querySelectorAll<HTMLButtonElement>('[data-buy]').forEach((b) =>
    b.addEventListener('click', () => {
      const item = ITEM_BY_ID.get(b.dataset.buy!);
      if (!item || state.owned.includes(item.id) || state.coins < item.price) return;
      state.coins -= item.price;
      state.owned.push(item.id);
      state.equipped[item.slot] = item.id;
      showToast(`${ICONS.bag}<span>${esc(item.name)} is yours!</span>`);
      persist();
    }),
  );
  app.querySelectorAll<HTMLButtonElement>('[data-wear]').forEach((b) =>
    b.addEventListener('click', () => {
      const item = ITEM_BY_ID.get(b.dataset.wear!);
      if (!item || !state.owned.includes(item.id)) return;
      if (state.equipped[item.slot] === item.id) delete state.equipped[item.slot];
      else state.equipped[item.slot] = item.id;
      persist();
    }),
  );
  const changeMonth = (delta: number) => {
    viewMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + delta, 1);
    selectedCat = null;
    render();
  };
  app.querySelector('#prev')?.addEventListener('click', () => changeMonth(-1));
  app.querySelector('#next')?.addEventListener('click', () => changeMonth(1));

  // Home
  app.querySelectorAll<Element>('[data-cat]').forEach((el) =>
    el.addEventListener('click', () => {
      const cat = el.getAttribute('data-cat') as Category;
      selectedCat = selectedCat === cat ? null : cat;
      render();
    }),
  );
  app.querySelectorAll<HTMLButtonElement>('[data-action]').forEach((b) =>
    b.addEventListener('click', () => {
      b.classList.remove('pop');
      void b.offsetWidth; // restart the pop animation
      b.classList.add('pop');
      doAction(profile, b.dataset.action as CareAction);
    }),
  );
  app.querySelector('#pet')?.addEventListener('click', () => doAction(profile, 'pet'));

  // Money
  const form = app.querySelector<HTMLFormElement>('#expense-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const amount = Number(data.get('amount'));
    const category = String(data.get('category')) as Category;
    if (!(amount > 0) || !CATEGORIES.includes(category)) return;
    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: Math.round(amount * 100) / 100,
      category,
      note: String(data.get('note') ?? '').trim(),
      date: String(data.get('date')),
    };
    state.expenses.push(expense);
    moneyMsg = '';
    persist();
  });
  app.querySelector<HTMLInputElement>('#statement')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const incoming = await readStatementFile(file);
      const before = state.expenses.length;
      state.expenses = mergeExpenses(state.expenses, incoming);
      moneyMsg = `Imported ${state.expenses.length - before} new transactions.`;
    } catch (err) {
      moneyMsg = err instanceof Error ? err.message : 'Could not read that file.';
    }
    persist();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.expenses = state.expenses.filter((e) => e.id !== btn.dataset.delete);
      persist();
    }),
  );
}

function doAction(profile: Profile, action: CareAction): void {
  state.care = applyAction(state.care, action);
  saveState(state);

  const care = currentCare(state.care);
  for (const b of CARE_BUTTONS) {
    const btn = app.querySelector<HTMLElement>(`[data-action="${b.action}"]`);
    if (!btn) continue;
    btn.style.setProperty('--v', String(care[b.stat]));
    btn.classList.toggle('low', care[b.stat] < 25);
    btn.setAttribute('aria-label', careLabel(b, care[b.stat]));
  }

  const pet = app.querySelector<HTMLElement>('#pet');
  const fx = app.querySelector<HTMLElement>('#fx');
  if (!pet || !fx) return;
  pet.innerHTML = renderAvatar(profile.character, 'happy', state.equipped);
  pet.classList.add('reacting');
  fx.innerHTML = EFFECTS[action];

  clearTimeout(reactTimer);
  reactTimer = window.setTimeout(render, 2200);
}

render();
