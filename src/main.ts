import './style.css';
import { ITEM_BY_ID } from './accessories';
import {
  currentUser,
  deleteLocalAccount,
  disableTwoFactor,
  initAuth,
  needsNewPassword,
  needsTwoFactor,
  renderAuth,
  renderConsent,
  renderNewPassword,
  renderTwoFactorChallenge,
  renderTwoFactorSetup,
  SCOPES,
  signOut,
  twoFactorOn,
} from './auth';
import { renderAvatar } from './avatar';
import { cancelCloudSave, cloudEnabled, flushCloudSave, loadCloudState, queueCloudSave } from './cloud';
import { bankEnabled, connectBank, deleteServerAccount, disconnectBank, isOAuthReturn, resumeBankLink, syncBank } from './bank';
import { analyze, formatMoney, localDateKey, pastMessage, type Analysis } from './budget';
import { applyAction, careMood, careNote, currentCare, type CareAction } from './care';
import { friendsHtml, myHouseHtml, visitHtml } from './friends';
import { renderGoals } from './goals';
import { HOUSE_ITEM_BY_ID } from './house';
import { ICONS, LINE, line } from './icons';
import { renderLearn } from './learn';
import { brand } from './logo';
import { renderOnboarding } from './onboarding';
import { renderArc, renderCategoryDetail, renderCategoryList } from './ring';
import { COINS_PER_GOAL, findNewAwards } from './rewards';
import { mergeExpenses, readStatementFile } from './statement';
import { clearState, emptyState, loadState, saveLocalOnly, saveState, setSaveListener } from './storage';
import {
  acceptFriend,
  collectCheers,
  loadFriends,
  publishBuddy,
  removeFriend,
  resetSocial,
  sendCheer,
  sendFriendRequest,
  setDisplayName,
  socialEnabled,
  type BuddyCard,
  type FriendsData,
} from './social';
import { renderStore } from './store';
import { CATEGORIES, type Care, type Category, type Expense, type Mood, type Profile } from './types';
import { esc } from './util';

type View = 'buddy' | 'history' | 'friends' | 'report' | 'store' | 'settings' | 'learn';

const app = document.querySelector<HTMLDivElement>('#app')!;
const state = emptyState();
let stateOwner = '';
let autoSynced = false;
let bankBusy = false;
let bankMsg = '';
let editing = false;
let managingConsent = false;
let settingUpTwoFactor = false;
let cloudLoading = false;
let friendsData: FriendsData | null = null;
let friendsLoading = false;
let friendsFailed = false;
let friendsMsg = '';
let visiting: string | null = null;
let cheersChecked = false;
let accountMsg = '';
let view: View = 'buddy';
let viewMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let selectedCat: Category | null = null;
let moneyMsg = '';
let reactTimer = 0;

const MOOD_LABEL: Record<Mood, string> = { happy: 'Happy', okay: 'Okay', sad: 'Sad', angry: 'Angry', dead: 'Fainted' };

const MENU: { view: View; label: string; icon: string }[] = [
  { view: 'buddy', label: 'Budget Buddy', icon: LINE.pet },
  { view: 'history', label: 'Pet History', icon: line('<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>') },
  {
    view: 'friends',
    label: 'Friends & House',
    icon: line('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.6c2.2.6 3.5 2.4 3.5 5.4"/>'),
  },
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

/** Pop-ups stack in one column at the top, so several at once don't cover each other. */
function showToast(html: string): void {
  let stack = document.querySelector<HTMLElement>('.toasts');
  if (!stack) {
    stack = document.createElement('div');
    stack.className = 'toasts';
    document.body.append(stack);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = html;
  stack.append(toast);
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

const DAY = 24 * 60 * 60 * 1000;
const errorText = (err: unknown) => (err instanceof Error ? err.message : 'Something went wrong. Try again.');

/** Spending alerts (an optional bank permission): one pop-up listing categories that newly passed 90% this month. */
function checkAlerts(): void {
  if (!state.profile || !currentUser()?.consent?.scopes.includes('alerts')) return;
  const now = analyze(state.profile, state.expenses);
  const fresh = now.categories.filter((c) => c.limit > 0 && c.ratio >= 0.9 && !state.alerts.includes(`${now.monthKey}:${c.category}`));
  if (fresh.length === 0) return;
  // Remember them with the account (older months dropped) so they don't pop up again on every open.
  state.alerts = [...state.alerts.filter((k) => k.startsWith(now.monthKey)), ...fresh.map((c) => `${now.monthKey}:${c.category}`)];
  saveState(state);
  const list = fresh.map((c) => `${esc(c.category)} <b>${Math.round(c.ratio * 100)}%</b>`);
  const joined = list.length === 1 ? list[0] : `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
  showToast(`${LINE.bulb}<span>Spending alert: ${joined} of this month's limit${fresh.length === 1 ? '' : 's'}.</span>`);
}

async function syncNow(quiet: boolean): Promise<void> {
  bankBusy = true;
  if (!quiet) render();
  let added = 0;
  try {
    const r = await syncBank();
    const before = state.expenses.length;
    state.expenses = mergeExpenses(state.expenses, r.expenses);
    state.bank = r.linked ? { accounts: r.accounts, syncedAt: Date.now() } : null;
    saveState(state);
    added = state.expenses.length - before;
    bankMsg = !r.linked
      ? ''
      : r.ready
        ? `Synced ${added} new transaction${added === 1 ? '' : 's'}.`
        : 'Your bank is still preparing your transactions. Try syncing again in a minute.';
    if (bankMsg && (!quiet || added)) showToast(`${ICONS.coin}<span>${esc(bankMsg)}</span>`);
    checkAlerts();
  } catch (err) {
    if (!quiet) bankMsg = errorText(err);
  } finally {
    bankBusy = false;
    if (!quiet || added) render();
  }
}

async function linkBank(resume = false): Promise<void> {
  bankBusy = true;
  bankMsg = '';
  render();
  try {
    if (await (resume ? resumeBankLink() : connectBank())) return await syncNow(false);
  } catch (err) {
    bankMsg = errorText(err);
    showToast(`${LINE.close}<span>${esc(bankMsg)}</span>`);
  }
  bankBusy = false;
  render();
}

/** Picks the newer of this device's copy and the account's copy. */
async function pullFromCloud(): Promise<void> {
  try {
    const cloud = await loadCloudState();
    if (cloud?.profile && (!state.profile || cloud.savedAt > state.savedAt)) {
      Object.assign(state, cloud);
      saveLocalOnly(state);
    } else if (state.profile) {
      queueCloudSave(state);
    }
  } catch (err) {
    // Offline or the table isn't set up: keep using this device's copy.
    console.warn('Could not load from your account:', err);
  }
  cloudLoading = false;
  render();
}

async function logOut(): Promise<void> {
  await flushCloudSave();
  accountMsg = '';
  stateOwner = ''; // re-check the account on the next login, in case another device changed things
  friendsData = null;
  visiting = null;
  cheersChecked = false;
  resetSocial();
  await signOut();
}

const buddyCard = (profile: Profile, mood: Mood): BuddyCard => ({
  name: profile.name,
  character: profile.character,
  mood,
  equipped: state.equipped,
  house: state.house,
});

async function refreshFriends(profile: Profile, mood: Mood): Promise<void> {
  friendsLoading = true;
  try {
    friendsData = await loadFriends(buddyCard(profile, mood));
  } catch (err) {
    // Stay on the error until the user retries, instead of reloading in a loop.
    friendsData = null;
    friendsFailed = true;
    friendsMsg = errorText(err);
  }
  friendsLoading = false;
  if (view === 'friends') render();
}

/** Cheers friends sent since last time: a pop-up and +10 Love each. */
async function checkCheers(): Promise<void> {
  try {
    const from = await collectCheers();
    if (!from.length) return;
    let care = currentCare(state.care);
    for (const name of from) {
      care = { ...care, love: Math.min(100, care.love + 10) };
      showToast(`${ICONS.heart}<span><b>${esc(name)}</b> cheered for ${esc(state.profile?.name ?? 'your buddy')}! +10 Love</span>`);
    }
    state.care = care;
    persist();
  } catch (err) {
    console.warn('Could not check cheers:', err);
  }
}

function render(): void {
  const user = currentUser();
  if (needsNewPassword()) {
    renderNewPassword(app, render);
    return;
  }
  if (!user) {
    renderAuth(app, render);
    return;
  }
  if (needsTwoFactor()) {
    renderTwoFactorChallenge(app, render);
    return;
  }
  if (settingUpTwoFactor) {
    const finish = (msg: string) => {
      settingUpTwoFactor = false;
      accountMsg = msg;
      render();
    };
    void renderTwoFactorSetup(app, () => finish('Two-factor sign-in is on.'), () => finish(''));
    return;
  }
  if (stateOwner !== user.email) {
    Object.assign(state, loadState(user.email));
    stateOwner = user.email;
    friendsData = null;
    friendsFailed = false;
    visiting = null;
    cheersChecked = false;
    resetSocial();
    autoSynced = false;
    bankMsg = '';
    view = 'buddy';
    if (cloudEnabled) {
      cloudLoading = true;
      void pullFromCloud();
    }
  }
  if (cloudLoading) {
    app.innerHTML = `<main class="onboard card auth"><div class="onboard-head">${brand()}</div><p class="hint">Loading your buddy...</p></main>`;
    return;
  }
  if (!user.consent || managingConsent) {
    const firstTime = !user.consent;
    renderConsent(
      app,
      user,
      () => {
        managingConsent = false;
        autoSynced = true;
        // New accounts choose how to add spending during setup; returning users go straight to their bank.
        if (firstTime && bankEnabled && !state.bank && state.profile) void linkBank();
        else render();
      },
      user.consent
        ? () => {
            managingConsent = false;
            render();
          }
        : null,
    );
    return;
  }
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
      bankEnabled ? { link: () => void linkBank(), busy: bankBusy, message: bankMsg } : null,
    );
    return;
  }
  if (!autoSynced) {
    autoSynced = true;
    const due = !state.bank || (user.consent.scopes.includes('sync') && Date.now() - state.bank.syncedAt > DAY);
    if (bankEnabled && due) void syncNow(true);
  }
  if (socialEnabled && !cheersChecked) {
    cheersChecked = true;
    void checkCheers();
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

const monthStart = (offset = 0) => new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1);
const monthLabel = (d: Date, year = true) => d.toLocaleDateString(undefined, year ? { month: 'long', year: 'numeric' } : { month: 'long' });

/** Each month the buddy starts fresh; before any spending, say so (and remember a rough last month). */
function freshStartMessage(profile: Profile): string {
  const last = analyze(profile, state.expenses, monthStart(-1));
  const month = monthLabel(monthStart(), false);
  if (last.spent > 0 && (last.mood === 'dead' || last.mood === 'angry')) {
    return `${profile.name} is back! ${month} is a fresh start after a rough ${monthLabel(monthStart(-1), false)}. Let's keep wants low this time.`;
  }
  return `A fresh ${month} for ${profile.name}! Add an expense or sync your bank to get started.`;
}

function homeHtml(profile: Profile, view: Analysis, care: Care, mood: Mood): string {
  const base = view.spent === 0 ? freshStartMessage(profile) : view.message;
  const message = mood === 'dead' ? base : (careNote(profile.name, care) ?? base);
  const selected = view.categories.find((c) => c.category === selectedCat) ?? view.topWant ?? view.categories[0];
  const monthName = monthLabel(monthStart(), false);
  const asOf = new Date();
  const dead = mood === 'dead';

  return `
    <section class="card pet-card mood-${mood}">
      <div class="month-nav">
        <h2>${esc(monthLabel(monthStart()))}</h2>
        <button class="link" data-view="history">Past months</button>
      </div>
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
      ${view.tip ? `<p class="tip">${LINE.bulb}<span>${esc(view.tip)}</span></p>` : ''}
    </section>

    ${renderGoals(state, profile, view)}

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

/** Months before this one that have any spending, newest first. */
function pastMonths(): Date[] {
  const current = localDateKey().slice(0, 7);
  const keys = [...new Set(state.expenses.map((e) => e.date.slice(0, 7)))].filter((k) => k < current).sort().reverse();
  return keys.map((k) => new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, 1));
}

function historyHtml(profile: Profile, now: Analysis, mood: Mood): string {
  const past = pastMonths().map((m) => ({ month: m, a: analyze(profile, state.expenses, m) }));
  const count = (m: Mood) => past.filter((p) => p.a.mood === m).length;
  const happy = count('happy');
  const fainted = count('dead');

  const item = (month: Date, a: Analysis, moodNow: Mood, message: string, current: boolean) => `
    <li class="mood-${moodNow}${current ? ' current' : ''}">
      <div class="history-pet">${renderAvatar(profile.character, moodNow, state.equipped)}</div>
      <div class="history-body">
        <div class="history-head"><strong>${esc(current ? 'This month' : monthLabel(month))}</strong><span class="mood-badge">${MOOD_LABEL[moodNow]}</span></div>
        <p>${esc(message)}</p>
        <small>${formatMoney(a.spent)} of ${formatMoney(profile.budget)} spent${current ? ' so far' : ''}</small>
      </div>
      <button class="icon" data-report="${a.monthKey}" aria-label="See ${esc(monthLabel(month))} report">${LINE.chevronRight}</button>
    </li>`;

  return `
    <section class="card">
      <h2>${esc(profile.name)}'s history</h2>
      <p class="hint">A fresh ${esc(profile.name)} starts every month. Here's how each one went.</p>
      ${
        past.length
          ? `<div class="history-stats">
              <div><strong>${past.length}</strong><small>month${past.length === 1 ? '' : 's'} tracked</small></div>
              <div><strong>${happy}</strong><small>happy month${happy === 1 ? '' : 's'}</small></div>
              <div><strong>${fainted}</strong><small>time${fainted === 1 ? '' : 's'} fainted</small></div>
            </div>`
          : ''
      }
      <ul class="history">
        ${item(monthStart(), now, mood, now.spent === 0 ? freshStartMessage(profile) : now.message, true)}
        ${past.map((p) => item(p.month, p.a, p.a.mood, pastMessage(profile, p.a, monthLabel(p.month, false)), false)).join('')}
      </ul>
      ${past.length ? '' : `<p class="empty">No past months yet. Come back next month to see how ${esc(profile.name)} did.</p>`}
    </section>`;
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
  const user = currentUser();
  const granted = SCOPES.filter((s) => user?.consent?.scopes.includes(s.id));
  const twoFactor = twoFactorOn();
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
      <button id="edit">Edit buddy, budget &amp; goals</button>
    </section>

    <section class="card settings">
      <h2>Account</h2>
      <dl class="facts">
        <div><dt>Email</dt><dd>${esc(user?.email ?? '')}</dd></div>
        <div><dt>Bank permissions</dt><dd>${esc(granted.map((s) => s.label).join(', '))}</dd></div>
        ${twoFactor === null ? '' : `<div><dt>Two-factor sign-in</dt><dd>${twoFactor ? 'On' : 'Off'}</dd></div>`}
      </dl>
      ${twoFactor === false ? '<p class="hint">Turn on two-factor sign-in so a stolen password alone can&#39;t open your bank data.</p>' : ''}
      ${accountMsg ? `<p class="import-msg" role="status">${esc(accountMsg)}</p>` : ''}
      ${twoFactor === null ? '' : `<button id="two-factor" class="${twoFactor ? 'secondary' : ''}">${twoFactor ? 'Turn off two-factor' : 'Turn on two-factor'}</button>`}
      <button id="permissions" class="secondary">Manage bank permissions</button>
      <button id="logout" class="secondary">Log out</button>
      <button id="logout-clear" class="secondary">Log out &amp; clear this device</button>
      <p class="hint small-print">${
        cloudEnabled
          ? 'Your buddy, coins and transactions are backed up to your account. Clearing only removes the copy on this device.'
          : 'Your buddy, coins and transactions are saved on this device only. Clearing removes them for good.'
      }</p>
    </section>

    ${bankHtml()}

    <section class="card">
      <h2>Reset</h2>
      <p class="hint">Delete your account, buddy, budget and all transactions${bankEnabled ? ', and disconnect your bank' : ' from this device'}.</p>
      <button id="reset" class="danger">Reset everything</button>
    </section>`;
}

function bankHtml(): string {
  if (!bankEnabled) return '';
  const b = state.bank;
  const busy = bankBusy ? 'disabled' : '';
  return `
    <section class="card settings">
      <h2>Linked bank</h2>
      ${
        b
          ? `<ul class="bank-accounts">${b.accounts
              .map(
                (a) => `<li><div><strong>${esc(a.name)}</strong><small>${esc(a.type)}${a.mask ? ` &middot;&middot;${esc(a.mask)}` : ''}</small></div>
                <span>${a.balance === null ? '-' : formatMoney(a.balance)}</span></li>`,
              )
              .join('')}</ul>
            <p class="hint">Last synced ${esc(new Date(b.syncedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }))}</p>`
          : '<p class="hint">No bank connected yet. Connect one to import your spending automatically.</p>'
      }
      ${bankMsg ? `<p class="import-msg" role="status">${esc(bankMsg)}</p>` : ''}
      ${
        b
          ? `<button id="sync-bank" ${busy}>${bankBusy ? 'Syncing...' : 'Sync now'}</button>
            <button id="link-bank" class="secondary" ${busy}>Connect another bank</button>
            <button id="unlink-bank" class="danger" ${busy}>Disconnect bank</button>`
          : `<button id="link-bank" ${busy}>${bankBusy ? 'Connecting...' : 'Connect bank'}</button>`
      }
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
    buddy: () => homeHtml(profile, now, care, mood),
    history: () => historyHtml(profile, now, mood),
    friends: () => {
      if (!socialEnabled) {
        return `${myHouseHtml(state, profile, mood)}<section class="card"><h2>Friends</h2><p class="hint">Friends need an online account. This copy of OinkCoin isn't connected to one.</p></section>`;
      }
      const friend = visiting ? friendsData?.friends.find((f) => f.id === visiting) : undefined;
      if (friend) return visitHtml(friend, friendsMsg);
      if (!friendsData && !friendsLoading && !friendsFailed) void refreshFriends(profile, mood);
      return myHouseHtml(state, profile, mood) + friendsHtml(friendsData, !friendsFailed, friendsMsg);
    },
    report: () => reportHtml(profile, month),
    store: () => renderStore(state, profile),
    learn: () => renderLearn(profile, now),
    settings: () => settingsHtml(profile),
  }[view]();

  if (socialEnabled) publishBuddy(buddyCard(profile, mood));

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
      if (view === 'friends') {
        // Fresh list each time you open Friends.
        friendsData = null;
        friendsFailed = false;
        friendsMsg = '';
        visiting = null;
      }
      render();
      window.scrollTo(0, 0);
    }),
  );

  // Friends
  const reloadFriends = () => {
    friendsData = null;
    friendsFailed = false;
    render();
  };
  app.querySelector('#retry-friends')?.addEventListener('click', () => {
    friendsMsg = '';
    reloadFriends();
  });
  app.querySelector<HTMLButtonElement>('#copy-code')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    try {
      await navigator.clipboard.writeText(btn.dataset.code!);
      btn.textContent = 'Copied!';
    } catch {
      btn.textContent = 'Select and copy it';
    }
  });
  const addForm = app.querySelector<HTMLFormElement>('#add-friend');
  addForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = String(new FormData(addForm).get('code')).trim();
    if (!code) return;
    addForm.querySelector('button')!.disabled = true;
    try {
      friendsMsg = await sendFriendRequest(code);
    } catch (err) {
      friendsMsg = errorText(err);
    }
    reloadFriends();
  });
  app.querySelector<HTMLInputElement>('#display-name')?.addEventListener('change', async (e) => {
    try {
      await setDisplayName((e.target as HTMLInputElement).value);
      friendsMsg = 'Saved. Friends will see this name.';
    } catch (err) {
      friendsMsg = errorText(err);
    }
    reloadFriends();
  });
  const friendAction = (attr: string, act: (id: string) => Promise<unknown>, done: string) =>
    app.querySelectorAll<HTMLButtonElement>(`[data-${attr}]`).forEach((b) =>
      b.addEventListener('click', async () => {
        b.disabled = true;
        try {
          await act(b.getAttribute(`data-${attr}`)!);
          friendsMsg = done;
        } catch (err) {
          friendsMsg = errorText(err);
        }
        reloadFriends();
      }),
    );
  friendAction('accept', acceptFriend, 'You are now friends!');
  friendAction('decline', removeFriend, 'Request declined.');
  app.querySelectorAll<HTMLButtonElement>('[data-visit]').forEach((b) =>
    b.addEventListener('click', () => {
      visiting = b.dataset.visit!;
      friendsMsg = '';
      render();
      window.scrollTo(0, 0);
    }),
  );
  app.querySelector('#back-friends')?.addEventListener('click', () => {
    visiting = null;
    friendsMsg = '';
    render();
  });
  app.querySelector<HTMLButtonElement>('#cheer')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget as HTMLButtonElement;
    btn.disabled = true;
    try {
      friendsMsg = (await sendCheer(btn.dataset.cheer!))
        ? 'Cheer sent! They get +10 Love next time they open OinkCoin.'
        : 'You already cheered for them today. Come back tomorrow!';
    } catch (err) {
      friendsMsg = errorText(err);
    }
    render();
  });
  app.querySelector<HTMLButtonElement>('#unfriend')?.addEventListener('click', async (e) => {
    if (!confirm('Remove this friend? You can add each other again with your codes.')) return;
    try {
      await removeFriend((e.currentTarget as HTMLButtonElement).dataset.unfriend!);
      visiting = null;
      friendsMsg = 'Friend removed.';
    } catch (err) {
      friendsMsg = errorText(err);
    }
    reloadFriends();
  });

  app.querySelector('#edit')?.addEventListener('click', () => {
    editing = true;
    render();
  });
  app.querySelector('#permissions')?.addEventListener('click', () => {
    managingConsent = true;
    render();
  });
  app.querySelector('#logout')?.addEventListener('click', async () => {
    await logOut();
    render();
  });
  app.querySelector('#logout-clear')?.addEventListener('click', async () => {
    const warning = cloudEnabled
      ? 'Log out and remove your data from this device? It stays backed up to your account.'
      : 'Log out and remove your buddy, coins and transactions from this device? This cannot be undone.';
    if (!confirm(warning)) return;
    await flushCloudSave();
    clearState();
    Object.assign(state, emptyState());
    stateOwner = '';
    accountMsg = '';
    try {
      sessionStorage.clear();
    } catch {
      // Nothing to clear.
    }
    await signOut();
    render();
  });
  app.querySelector('#two-factor')?.addEventListener('click', async () => {
    accountMsg = '';
    if (!twoFactorOn()) {
      settingUpTwoFactor = true;
      return render();
    }
    if (!confirm('Turn off two-factor sign-in? Your account will be protected by your password only.')) return;
    try {
      await disableTwoFactor();
      accountMsg = 'Two-factor sign-in is off.';
    } catch (err) {
      accountMsg = errorText(err);
    }
    render();
  });
  app.querySelector('#link-bank')?.addEventListener('click', () => void linkBank());
  app.querySelector('#sync-bank')?.addEventListener('click', () => void syncNow(false));
  app.querySelector('#unlink-bank')?.addEventListener('click', async () => {
    if (!confirm('Disconnect your bank? Transactions already imported stay in OinkCoin.')) return;
    try {
      await disconnectBank();
      state.bank = null;
      bankMsg = 'Bank disconnected. OinkCoin can no longer see your accounts.';
      saveState(state);
    } catch (err) {
      bankMsg = errorText(err);
    }
    render();
  });
  app.querySelector('#reset')?.addEventListener('click', async () => {
    if (!confirm('Delete your account, buddy and all your data? This cannot be undone.')) return;
    if (bankEnabled) {
      try {
        await deleteServerAccount();
      } catch (err) {
        bankMsg = errorText(err);
        render();
        return;
      }
    }
    cancelCloudSave();
    clearState();
    Object.assign(state, emptyState());
    stateOwner = '';
    if (bankEnabled) await signOut();
    else deleteLocalAccount();
    render();
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
  app.querySelectorAll<HTMLButtonElement>('[data-buy-house]').forEach((b) =>
    b.addEventListener('click', () => {
      const item = HOUSE_ITEM_BY_ID.get(b.dataset.buyHouse!);
      if (!item || state.owned.includes(item.id) || state.coins < item.price) return;
      state.coins -= item.price;
      state.owned.push(item.id);
      state.house[item.slot] = item.id;
      showToast(`${ICONS.bag}<span>${esc(item.name)} is in your house!</span>`);
      persist();
    }),
  );
  app.querySelectorAll<HTMLButtonElement>('[data-place]').forEach((b) =>
    b.addEventListener('click', () => {
      const item = HOUSE_ITEM_BY_ID.get(b.dataset.place!);
      if (!item || !state.owned.includes(item.id)) return;
      if (state.house[item.slot] === item.id) delete state.house[item.slot];
      else state.house[item.slot] = item.id;
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
  app.querySelectorAll<HTMLButtonElement>('[data-report]').forEach((b) =>
    b.addEventListener('click', () => {
      const [y, m] = b.dataset.report!.split('-').map(Number);
      viewMonth = new Date(y, m - 1, 1);
      view = 'report';
      selectedCat = null;
      render();
      window.scrollTo(0, 0);
    }),
  );
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
    checkAlerts();
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

if (cloudEnabled) {
  setSaveListener(queueCloudSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushCloudSave();
  });
}

initAuth(render).then(() => {
  render();
  if (bankEnabled && isOAuthReturn() && currentUser()?.consent) void linkBank(true);
});
