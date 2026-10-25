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
import { analyze, formatMoney, localDateKey, pastMessage, petName, type Analysis } from './budget';
import { applyAction, careMood, careNote, currentCare, type CareAction } from './care';
import { buddyPhrase, moneyTier, reply, SUGGESTIONS, type ChatContext, type ChatMessage } from './chat';
import { catLabel, goalLabel, moodLabel } from './labels';
import { friendsHtml, myHouseHtml, visitHtml } from './friends';
import { renderGoals } from './goals';
import { HOUSE_ITEM_BY_ID } from './house';
import { ICONS, LINE, line } from './icons';
import { renderLearn } from './learn';
import { bindPredict, renderPredict, resetPredict } from './predict';
import { brand } from './logo';
import { renderOnboarding } from './onboarding';
import { renderArc, renderCategoryDetail, renderCategoryList } from './ring';
import { COINS_PER_GOAL, findNewAwards } from './rewards';
import { mergeExpenses, mergeIncome, readStatementFile } from './statement';
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
import { tutorialHtml, tutorialLength } from './tutorial';
import { CATEGORIES, type Care, type Category, type Expense, type Income, type Mood, type NoticeKind, type Profile } from './types';
import { esc } from './util';
import { getLang, locale, onLangChange, t, tp, T } from './i18n';
import { bindLangSwitch, langSwitchHtml } from './langswitch';

type View = 'buddy' | 'chat' | 'predict' | 'history' | 'friends' | 'notifications' | 'report' | 'store' | 'settings' | 'learn';

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
let goalsOpen = false;
let categoriesOpen = false;
let cashOpen = false;
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
// The buddy's speech bubble is picked once per money situation so it doesn't change on every redraw.
let bubbleKey = '';
let bubbleText = '';
let chatLog: ChatMessage[] = [];
const CHAT_LIMIT = 30;
let tutorialStep = 0;

const CHAT_ICON = line('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.4A8 8 0 1 1 21 12z"/><path d="M9 11h6M9 14h3"/>');

const MENU: { view: View; label: string; icon: string }[] = [
  { view: 'buddy', label: T('Budget Buddy'), icon: LINE.pet },
  { view: 'chat', label: T('Chat with Oink'), icon: CHAT_ICON },
  { view: 'predict', label: T('Forecast'), icon: line('<path d="M3 17l5-5 4 4 8-9"/><path d="M15 7h5v5"/><path d="M3 21h18"/>') },
  { view: 'history', label: T('Pet History'), icon: line('<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>') },
  {
    view: 'friends',
    label: T('Friends & House'),
    icon: line('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-5.5 6.5-5.5s6.5 1.9 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.6c2.2.6 3.5 2.4 3.5 5.4"/>'),
  },
  { view: 'report', label: T('Full Report'), icon: line('<path d="M4 20V11M10 20V5M16 20v-6M2 20h20"/>') },
  { view: 'store', label: T('Store'), icon: line('<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>') },
  { view: 'learn', label: T('Grow Your Money'), icon: line('<path d="M3 17l6-6 4 4 8-8M15 7h6v6"/>') },
  { view: 'settings', label: T('Profile & Settings'), icon: line('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6"/>') },
];

const effects = (action: CareAction): string =>
  ({
    feed: () => `<div class="fx-food">${ICONS.cookie}</div><span class="fx-plus">${esc(t('+25 Hunger'))}</span>`,
    play: () => `<div class="fx-ball-x"><div class="fx-ball-y">${ICONS.ball}</div></div><span class="fx-plus">${esc(t('+25 Fun'))}</span>`,
    pet: () =>
      [-40, 0, 40].map((x, i) => `<span class="fx-heart" style="--x:${x}px;--d:${i * 0.25}s">${ICONS.heart}</span>`).join('') +
      `<span class="fx-plus">${esc(t('+20 Love'))}</span>`,
  })[action]();

const CARE_BUTTONS: { action: CareAction; stat: 'hunger' | 'fun' | 'love'; label: string; icon: string; color: string; ring: string }[] = [
  { action: 'feed', stat: 'hunger', label: T('Feed'), icon: ICONS.cookie, color: '#fff1d6', ring: '#f2b230' },
  { action: 'play', stat: 'fun', label: T('Play'), icon: ICONS.ball, color: '#fde7f0', ring: '#8b5cf6' },
  { action: 'pet', stat: 'love', label: T('Pet'), icon: ICONS.heart, color: '#ffe4ea', ring: '#e5487f' },
];

const STAT_NAME = { hunger: T('Hunger'), fun: T('Fun'), love: T('Love') };
const careLabel = (b: (typeof CARE_BUTTONS)[number], value: number) => t('{label} ({stat} {value}%)', { label: t(b.label), stat: t(STAT_NAME[b.stat]), value });

const toastQueue: string[] = [];
let toastShowing = false;

/** Pop-ups wait in line and show one at a time. */
function showToast(html: string): void {
  toastQueue.push(html);
  if (!toastShowing) nextToast();
}

function nextToast(): void {
  const html = toastQueue.shift();
  toastShowing = html !== undefined;
  if (html === undefined) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = html;
  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
      nextToast();
    }, 400);
  }, 3200);
}

const NOTICE_ICON: Record<NoticeKind, string> = {
  coins: ICONS.coin,
  alert: LINE.bulb,
  cheer: ICONS.heart,
  bank: ICONS.coin,
  error: LINE.close,
};

/** Adds to the notifications list (kept with the account) and shows it as a pop-up. */
function notify(kind: NoticeKind, text: string): void {
  state.notices = [{ id: crypto.randomUUID(), kind, text, at: Date.now(), read: false }, ...state.notices].slice(0, 40);
  saveState(state);
  showToast(`${NOTICE_ICON[kind]}<span>${esc(text)}</span>`);
}

function collectRewards(): void {
  const awards = findNewAwards(state);
  if (awards.length === 0) return;
  state.coins += awards.length * COINS_PER_GOAL;
  state.rewards.push(...awards.map((a) => a.key));
  const what = awards.length === 1 ? awards[0].label : t('{n} goals', { n: awards.length });
  notify('coins', t('Goal met: {what} · +{n} coins', { what, n: awards.length * COINS_PER_GOAL }));
}

function persist(): void {
  saveState(state);
  render();
}

const DAY = 24 * 60 * 60 * 1000;
const errorText = (err: unknown) => (err instanceof Error ? err.message : t('Something went wrong. Try again.'));

/** "A, B and C" in the current language. */
const joinList = (items: string[]): string =>
  items.length === 1 ? items[0] : t('{list} and {last}', { list: items.slice(0, -1).join(', '), last: items[items.length - 1] });

/** Spending alerts (an optional bank permission): one pop-up listing categories that newly passed 90% this month. */
function checkAlerts(): void {
  if (!state.profile || !currentUser()?.consent?.scopes.includes('alerts')) return;
  const now = analyze(state.profile, state.expenses);
  const fresh = now.categories.filter((c) => c.limit > 0 && c.ratio >= 0.9 && !state.alerts.includes(`${now.monthKey}:${c.category}`));
  if (fresh.length === 0) return;
  // Remember them with the account (older months dropped) so they don't pop up again on every open.
  state.alerts = [...state.alerts.filter((k) => k.startsWith(now.monthKey)), ...fresh.map((c) => `${now.monthKey}:${c.category}`)];
  const list = fresh.map((c) => `${catLabel(c.category)} ${Math.round(c.ratio * 100)}%`);
  const joined = joinList(list);
  notify('alert', fresh.length === 1 ? t("Spending alert: {list} of this month's limit.", { list: joined }) : t("Spending alert: {list} of this month's limits.", { list: joined }));
}

async function syncNow(quiet: boolean): Promise<void> {
  bankBusy = true;
  if (!quiet) render();
  let added = 0;
  try {
    const r = await syncBank();
    const before = state.expenses.length;
    state.expenses = mergeExpenses(state.expenses, r.expenses);
    state.income = mergeIncome(state.income, r.income);
    state.bank = r.linked ? { accounts: r.accounts, syncedAt: Date.now() } : null;
    saveState(state);
    added = state.expenses.length - before;
    bankMsg = !r.linked
      ? ''
      : r.ready
        ? tp('Synced {n} new transaction.', 'Synced {n} new transactions.', added)
        : t('Your bank is still preparing your transactions. Try syncing again in a minute.');
    if (bankMsg && (!quiet || added)) notify('bank', bankMsg);
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
    notify('error', bankMsg);
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
    const care = currentCare(state.care);
    state.care = { ...care, love: Math.min(100, care.love + 10 * from.length) };
    const names = [...new Set(from)];
    const who = joinList(names);
    notify('cheer', t('{who} cheered for {name}! +{n} Love', { who, name: state.profile?.name ?? t('your buddy'), n: 10 * from.length }));
    render();
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
    void renderTwoFactorSetup(app, () => finish(t('Two-factor sign-in is on.')), () => finish(''));
    return;
  }
  if (stateOwner !== user.email) {
    Object.assign(state, loadState(user.email));
    stateOwner = user.email;
    chatLog = [];
    bubbleKey = '';
    resetPredict();
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
    app.innerHTML = `<main class="onboard card auth"><div class="onboard-head">${brand()}</div><p class="hint">${esc(t('Loading your buddy...'))}</p></main>`;
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
  const label = viewMonth.toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
  return `<div class="month-nav">
    <button class="icon" id="prev" aria-label="${esc(t('Previous month'))}">${LINE.chevronLeft}</button>
    <h2>${esc(label)}</h2>
    <button class="icon" id="next" aria-label="${esc(t('Next month'))}" ${isCurrentMonth(a) ? 'disabled' : ''}>${LINE.chevronRight}</button>
  </div>`;
}

const monthStart = (offset = 0) => new Date(new Date().getFullYear(), new Date().getMonth() + offset, 1);
const monthLabel = (d: Date, year = true) => d.toLocaleDateString(locale(), year ? { month: 'long', year: 'numeric' } : { month: 'long' });

/** Each month the buddy starts fresh; before any spending, say so (and remember a rough last month). */
function freshStartMessage(profile: Profile): string {
  const last = analyze(profile, state.expenses, monthStart(-1));
  const month = monthLabel(monthStart(), false);
  if (last.spent > 0 && (last.mood === 'dead' || last.mood === 'angry')) {
    return t('{name} is back! A fresh start for {month}.', { name: petName(profile), month });
  }
  return t('A fresh {month} for {name}!', { month, name: petName(profile) });
}

function chatContext(profile: Profile): ChatContext {
  const a = analyze(profile, state.expenses);
  return { profile, state, a, mood: careMood(a.mood, currentCare(state.care)) };
}

/** The bubble keeps its line until the month's money situation or the mood changes. */
function currentBubble(profile: Profile, a: Analysis, mood: Mood): string {
  const key = `${moneyTier(a, profile.budget)}:${mood}:${a.monthKey}:${getLang()}`; // the language is part of the key, or a Spanish screen keeps its English phrase
  if (key !== bubbleKey) {
    bubbleKey = key;
    bubbleText = buddyPhrase({ profile, state, a, mood });
  }
  return bubbleText;
}

const chatMessageHtml = (m: ChatMessage) => `<p class="msg ${m.from}">${esc(m.text)}</p>`;

function chatHtml(profile: Profile): string {
  return `
    <div class="chat">
      <div class="chat-log" id="chat-log" aria-live="polite" data-empty="${esc(t('Ask me about your balance, your spending, or what you would save by cutting back.'))}">${chatLog.map(chatMessageHtml).join('')}</div>
      <div class="chat-chips">${SUGGESTIONS.map((s) => `<button type="button" class="chat-chip" data-ask="${esc(t(s))}">${esc(t(s))}</button>`).join('')}</div>
      <form class="chat-form" id="chat-form">
        <input name="q" type="text" maxlength="200" autocomplete="off" placeholder="${esc(t('Ask {name} about your money', { name: profile.name }))}" aria-label="${esc(t('Message {name}', { name: profile.name }))}" />
        <button type="submit">${esc(t('Send'))}</button>
      </form>
    </div>`;
}

/** Adds the question and the buddy's answer without redrawing, so typing and scroll position survive. */
function askBuddy(profile: Profile, question: string): void {
  const text = question.trim().slice(0, 200);
  if (!text) return;
  const answer = reply(text, chatContext(profile));
  chatLog = [...chatLog, { from: 'you' as const, text }, { from: 'oink' as const, text: answer }].slice(-CHAT_LIMIT);
  bubbleText = answer;

  const log = app.querySelector<HTMLElement>('#chat-log');
  if (log) {
    log.insertAdjacentHTML('beforeend', chatMessageHtml({ from: 'you', text }) + chatMessageHtml({ from: 'oink', text: answer }));
    log.scrollTop = log.scrollHeight;
  }
  const bubble = app.querySelector<HTMLElement>('#bubble');
  if (bubble) {
    bubble.textContent = answer;
    bubble.classList.remove('talk');
    void bubble.offsetWidth; // restart the pop animation
    bubble.classList.add('talk');
  }
}

function chatPageHtml(profile: Profile, a: Analysis, mood: Mood): string {
  return `
    <section class="card pet-card chat-page mood-${mood}">
      <div class="oink-bubble" id="bubble" role="status" aria-live="polite">${esc(currentBubble(profile, a, mood))}</div>
      <div class="chat-pet">${renderAvatar(profile.character, mood, state.equipped)}</div>
      <div class="pet-name"><h2>${esc(profile.name)}</h2><span class="mood-badge">${esc(moodLabel(mood))}</span></div>
      ${chatHtml(profile)}
    </section>`;
}

function homeHtml(profile: Profile, view: Analysis, care: Care, mood: Mood): string {
  const base = view.spent === 0 ? freshStartMessage(profile) : view.message;
  const message = mood === 'dead' ? base : (careNote(petName(profile), care) ?? base);
  const selected = view.categories.find((c) => c.category === selectedCat) ?? view.topWant ?? view.categories[0];
  const monthName = monthLabel(monthStart(), false);
  const asOf = new Date();
  const dead = mood === 'dead';

  return `
    <section class="card pet-card mood-${mood}">
      <div class="month-nav">
        <h2>${esc(monthLabel(monthStart()))}</h2>
        <button class="link" data-view="history">${esc(t('Past months'))}</button>
      </div>
      <p class="speech">${esc(message)}</p>
      <div class="oink-bubble">
        <span class="bubble-text">${esc(currentBubble(profile, view, mood))}</span>
        <button class="bubble-reply" data-view="chat" aria-label="${esc(t('Reply to {name}', { name: profile.name }))}">${CHAT_ICON}${esc(t('Reply'))}</button>
      </div>
      <div class="ring-stage">
        ${renderArc(view, profile.budget, selectedCat)}
        <button class="pet" id="pet" aria-label="${esc(t('Pet {name}', { name: profile.name }))}" ${dead ? 'disabled' : ''}>${renderAvatar(profile.character, mood, state.equipped)}</button>
        <div class="fx" id="fx" aria-hidden="true"></div>
      </div>
      <div class="total">
        <small>${esc(t('Total {month} Spending', { month: monthName }))}</small>
        <strong>${formatMoney(view.spent)}</strong>
        <small>${t('of {budget} &middot; as of {date}', { budget: formatMoney(profile.budget), date: esc(asOf.toLocaleDateString(locale(), { month: 'short', day: 'numeric', year: 'numeric' })) })}</small>
      </div>
      <div class="nw">
        <div class="need"><small>${esc(t('Needs'))}</small><b>${formatMoney(view.needsSpent)}</b></div>
        <div class="want"><small>${esc(t('Wants'))}</small><b>${formatMoney(view.wantsSpent)} <span>/ ${formatMoney(view.wantsLimit)}</span></b></div>
      </div>
      <div class="pet-name"><h2>${esc(profile.name)}</h2><span class="mood-badge">${esc(moodLabel(mood))}</span></div>
      ${view.tip ? `<p class="tip">${LINE.bulb}<span>${esc(view.tip)}</span></p>` : ''}
    </section>

    ${renderGoals(state, profile, view, goalsOpen)}

    ${cashFlowCard(view)}

    <section class="card">${renderCategoryDetail(selected, view.spent)}</section>

    ${categoriesCard(view, selected.category)}

    <nav class="action-bar" aria-label="${esc(t('Care for your buddy'))}">
      ${CARE_BUTTONS.map(
        (b) =>
          `<button data-action="${b.action}" class="${care[b.stat] < 25 ? 'low' : ''}" style="--c:${b.color};--ring:${b.ring};--v:${care[b.stat]}" aria-label="${careLabel(b, care[b.stat])}" ${dead ? 'disabled' : ''}><span class="bubble">${b.icon}</span><span>${esc(t(b.label))}</span></button>`,
      ).join('')}
      <button data-view="store" class="plain" style="--c:#efe9ff"><span class="bubble">${ICONS.bag}</span><span>${esc(t('Shop'))}</span></button>
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
        <div class="history-head"><strong>${esc(current ? t('This month') : monthLabel(month))}</strong><span class="mood-badge">${esc(moodLabel(moodNow))}</span></div>
        <p>${esc(message)}</p>
        <small>${esc(t(current ? '{spent} of {budget} spent so far' : '{spent} of {budget} spent', { spent: formatMoney(a.spent), budget: formatMoney(profile.budget) }))}</small>
      </div>
      <button class="icon" data-report="${a.monthKey}" aria-label="${esc(t('See {month} report', { month: monthLabel(month) }))}">${LINE.chevronRight}</button>
    </li>`;

  return `
    <section class="card">
      <h2>${esc(t("{name}'s history", { name: profile.name }))}</h2>
      <p class="hint">${esc(t("A fresh {name} starts every month. Here's how each one went.", { name: profile.name }))}</p>
      ${
        past.length
          ? `<div class="history-stats">
              <div><strong>${past.length}</strong><small>${esc(tp('month tracked', 'months tracked', past.length))}</small></div>
              <div><strong>${happy}</strong><small>${esc(tp('happy month', 'happy months', happy))}</small></div>
              <div><strong>${fainted}</strong><small>${esc(tp('time fainted', 'times fainted', fainted))}</small></div>
            </div>`
          : ''
      }
      <ul class="history">
        ${item(monthStart(), now, mood, now.spent === 0 ? freshStartMessage(profile) : now.message, true)}
        ${past.map((p) => item(p.month, p.a, p.a.mood, pastMessage(profile, p.a, monthLabel(p.month, false)), false)).join('')}
      </ul>
      ${past.length ? '' : `<p class="empty">${esc(t('No past months yet. Come back next month to see how {name} did.', { name: profile.name }))}</p>`}
    </section>`;
}

const wholeDollars = (n: number) => formatMoney(Math.round(n)).replace(/\.00$/, '');
const incomeIn = (monthKey: string) => state.income.filter((i) => i.date.startsWith(monthKey));

/** Money in vs money out this month, folded to one line ("Cash flow · +$800 left"). */
function cashFlowCard(a: Analysis): string {
  const moneyIn = incomeIn(a.monthKey).reduce((s, i) => s + i.amount, 0);
  const left = moneyIn - a.spent;
  const summary = moneyIn > 0 ? t('{amount} left', { amount: `${left >= 0 ? '+' : '−'}${wholeDollars(Math.abs(left))}` }) : t('Add your income');
  const hint =
    moneyIn === 0
      ? t('Add your paychecks or other income to see what you have left over.')
      : left >= 0
        ? t('You kept {pct}% of what came in.', { pct: Math.round((left / moneyIn) * 100) })
        : t('You spent {amount} more than came in.', { amount: wholeDollars(-left) });
  return `
    <details class="card fold cash" id="cash-card" ${cashOpen ? 'open' : ''}>
      <summary class="fold-head">
        <h2>${esc(t('Cash flow'))}</h2>
        <span class="fold-count ${moneyIn === 0 ? '' : left >= 0 ? 'pos' : 'neg'}">${summary}</span>
      </summary>
      <div class="flow">
        <div><small>${esc(t('Money in'))}</small><b class="pos">${wholeDollars(moneyIn)}</b></div>
        <div><small>${esc(t('Money out'))}</small><b class="neg">${wholeDollars(a.spent)}</b></div>
        <div><small>${esc(t('Left over'))}</small><b class="${left >= 0 ? 'pos' : 'neg'}">${left < 0 ? '−' : ''}${wholeDollars(Math.abs(left))}</b></div>
      </div>
      ${moneyIn > 0 ? `<div class="bar"><div class="fill ${a.spent > moneyIn ? 'over' : a.spent > moneyIn * 0.8 ? 'warn' : 'ok'}" style="width:${Math.min(100, Math.round((a.spent / moneyIn) * 100))}%"></div></div>` : ''}
      <p class="hint">${esc(hint)}</p>
      <button class="secondary" data-view="report">${esc(t('Add money in'))}</button>
    </details>`;
}

function incomeSection(monthKey: string): string {
  const list = incomeIn(monthKey).sort((x, y) => y.date.localeCompare(x.date));
  return `
    <section class="card">
      <h2>${esc(t('Money in'))}</h2>
      <p class="hint">${esc(t('Paychecks and deposits from your bank or statement show up here. Add cash income yourself.'))}</p>
      <form id="income-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="${esc(t('Amount'))}" aria-label="${esc(t('Amount'))}" required />
        <input name="note" maxlength="60" placeholder="${esc(t('Paycheck, side job...'))}" aria-label="${esc(t('What it was'))}" />
        <input name="date" type="date" value="${localDateKey()}" aria-label="${esc(t('Date'))}" required />
        <button type="submit">${esc(t('Add money in'))}</button>
      </form>
      ${
        list.length
          ? `<ul class="expenses">${list
              .map(
                (i: Income) => `
            <li>
              <div><strong>${esc(i.note || t('Income'))}</strong><br /><small>${esc(i.date)}</small></div>
              <span class="pos">+${formatMoney(i.amount)}</span>
              <button class="icon" data-delete-income="${esc(i.id)}" aria-label="${esc(t('Delete income'))}">&times;</button>
            </li>`,
              )
              .join('')}</ul>`
          : `<p class="empty">${esc(t('No money in this month yet.'))}</p>`
      }
    </section>`;
}

/** Folded to one line ("Spending categories · 2 over limit") until opened. */
function categoriesCard(a: Analysis, selected: Category): string {
  const over = a.categories.filter((c) => c.spent > 0 && c.ratio > 1).length;
  return `
    <details class="card fold" id="categories-card" ${categoriesOpen ? 'open' : ''}>
      <summary class="fold-head">
        <h2>${esc(t('Spending categories'))}</h2>
        <span class="fold-count ${over ? 'neg' : 'pos'}">${esc(over ? t('{n} over limit', { n: over }) : t('All on track'))}</span>
      </summary>
      ${renderCategoryList(a, selected)}
    </details>`;
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
        <div><small>${esc(t('Budget'))}</small><strong>${formatMoney(profile.budget)}</strong></div>
        <div><small>${esc(t('Spent'))}</small><strong>${formatMoney(view.spent)}</strong></div>
        <div><small>${esc(t('Left'))}</small><strong class="${view.remaining < 0 ? 'neg' : 'pos'}">${formatMoney(view.remaining)}</strong></div>
      </div>
      <div class="bar big"><div class="fill ${view.usage > 1 ? 'over' : 'ok'}" style="width:${usage}%"></div></div>
      <div class="nw">
        <div class="need"><small>${esc(t('Needs'))}</small><b>${formatMoney(view.needsSpent)}</b></div>
        <div class="want"><small>${esc(t('Wants'))}</small><b>${formatMoney(view.wantsSpent)} <span>/ ${formatMoney(view.wantsLimit)}</span></b></div>
      </div>
    </section>

    ${categoriesCard(view, selected.category)}

    ${incomeSection(view.monthKey)}

    <section class="card">
      <h2>${esc(t('Add expense'))}</h2>
      <form id="expense-form" class="expense-form">
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="${esc(t('Amount'))}" aria-label="${esc(t('Amount'))}" required />
        <select name="category" aria-label="${esc(t('Category'))}">${CATEGORIES.map((c) => `<option value="${esc(c)}">${esc(catLabel(c))}</option>`).join('')}</select>
        <input name="note" maxlength="60" placeholder="${esc(t('Note (optional)'))}" aria-label="${esc(t('Note'))}" />
        <input name="date" type="date" value="${localDateKey()}" aria-label="${esc(t('Date'))}" required />
        <button type="submit">${esc(t('Add'))}</button>
      </form>
      <h3>${esc(t('Import bank statement'))}</h3>
      <label class="dropzone small">
        <input type="file" id="statement" accept=".csv,text/csv" />
        <strong>${esc(t('Upload CSV'))}</strong>
      </label>
      ${moneyMsg ? `<p class="import-msg" role="status">${esc(moneyMsg)}</p>` : ''}
    </section>

    <section class="card">
      <h2>${esc(t('Transactions'))}</h2>
      ${
        expenses.length === 0
          ? `<p class="empty">${esc(t('No expenses this month.'))}</p>`
          : `<ul class="expenses">${expenses
              .map(
                (e) => `
            <li>
              <div><strong>${esc(catLabel(e.category))}</strong>${e.note ? ` - ${esc(e.note)}` : ''}<br /><small>${esc(e.date)}</small></div>
              <span>${formatMoney(e.amount)}</span>
              <button class="icon" data-delete="${esc(e.id)}" aria-label="${esc(t('Delete expense'))}">&times;</button>
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
        <div><h2>${esc(profile.name)}</h2><p class="hint">${esc(t('Your budget buddy'))}</p></div>
      </div>
      <dl class="facts">
        <div><dt>${esc(t('Monthly budget'))}</dt><dd>${formatMoney(profile.budget)}</dd></div>
        <div><dt>${esc(t('Main goal'))}</dt><dd>${esc(goalLabel(profile.goal))}</dd></div>
        <div><dt>${esc(t('Cutting back on'))}</dt><dd>${profile.focus.length ? esc(profile.focus.map(catLabel).join(', ')) : esc(t('Nothing yet'))}</dd></div>
        <div><dt>${esc(t('Coins'))}</dt><dd>${state.coins}</dd></div>
        <div><dt>${esc(t('Transactions saved'))}</dt><dd>${state.expenses.length}</dd></div>
      </dl>
      <button id="edit">${t('Edit buddy, budget &amp; goals')}</button>
      <button id="restart-tutorial" class="secondary">${esc(t('Take the quick tour'))}</button>
    </section>

    <section class="card settings">
      <h2>${esc(t('Account'))}</h2>
      <dl class="facts">
        <div><dt>${esc(t('Email'))}</dt><dd>${esc(user?.email ?? '')}</dd></div>
        <div><dt>${esc(t('Bank permissions'))}</dt><dd>${esc(granted.map((s) => t(s.label)).join(', '))}</dd></div>
        ${twoFactor === null ? '' : `<div><dt>${esc(t('Two-factor sign-in'))}</dt><dd>${esc(twoFactor ? t('On') : t('Off'))}</dd></div>`}
      </dl>
      ${twoFactor === false ? `<p class="hint">${t("Turn on two-factor sign-in so a stolen password alone can&#39;t open your bank data.")}</p>` : ''}
      ${accountMsg ? `<p class="import-msg" role="status">${esc(accountMsg)}</p>` : ''}
      ${twoFactor === null ? '' : `<button id="two-factor" class="${twoFactor ? 'secondary' : ''}">${esc(twoFactor ? t('Turn off two-factor') : t('Turn on two-factor'))}</button>`}
      <button id="permissions" class="secondary">${esc(t('Manage bank permissions'))}</button>
      <button id="logout" class="secondary">${esc(t('Log out'))}</button>
      <button id="logout-clear" class="secondary">${t('Log out &amp; clear this device')}</button>
      <p class="hint small-print">${
        cloudEnabled
          ? esc(t('Your buddy, coins and transactions are backed up to your account. Clearing only removes the copy on this device.'))
          : esc(t('Your buddy, coins and transactions are saved on this device only. Clearing removes them for good.'))
      }</p>
    </section>

    ${bankHtml()}

    <section class="card">
      <h2>${esc(t('Reset'))}</h2>
      <p class="hint">${esc(bankEnabled ? t('Delete your account, buddy, budget and all transactions, and disconnect your bank.') : t('Delete your account, buddy, budget and all transactions from this device.'))}</p>
      <button id="reset" class="danger">${esc(t('Reset everything'))}</button>
    </section>`;
}

function bankHtml(): string {
  if (!bankEnabled) return '';
  const b = state.bank;
  const busy = bankBusy ? 'disabled' : '';
  return `
    <section class="card settings">
      <h2>${esc(t('Linked bank'))}</h2>
      ${
        b
          ? `<ul class="bank-accounts">${b.accounts
              .map(
                (a) => `<li><div><strong>${esc(a.name)}</strong><small>${esc(a.type)}${a.mask ? ` &middot;&middot;${esc(a.mask)}` : ''}</small></div>
                <span>${a.balance === null ? '-' : formatMoney(a.balance)}</span></li>`,
              )
              .join('')}</ul>
            <p class="hint">${esc(t('Last synced {time}', { time: new Date(b.syncedAt).toLocaleString(locale(), { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) }))}</p>`
          : `<p class="hint">${esc(t('No bank connected yet. Connect one to import your spending automatically.'))}</p>`
      }
      ${bankMsg ? `<p class="import-msg" role="status">${esc(bankMsg)}</p>` : ''}
      ${
        b
          ? `<button id="sync-bank" ${busy}>${esc(bankBusy ? t('Syncing...') : t('Sync now'))}</button>
            <button id="link-bank" class="secondary" ${busy}>${esc(t('Connect another bank'))}</button>
            <button id="unlink-bank" class="danger" ${busy}>${esc(t('Disconnect bank'))}</button>`
          : `<button id="link-bank" ${busy}>${esc(bankBusy ? t('Connecting...') : t('Connect bank'))}</button>`
      }
    </section>`;
}

function timeAgo(at: number): string {
  const mins = Math.round((Date.now() - at) / 60000);
  if (mins < 1) return t('Just now');
  if (mins < 60) return t('{n} min ago', { n: mins });
  if (mins < 24 * 60) return t('{n} h ago', { n: Math.round(mins / 60) });
  return new Date(at).toLocaleDateString(locale(), { month: 'short', day: 'numeric' });
}

function notificationsHtml(): string {
  return `
    <section class="card">
      <div class="notices-head">
        <h2>${esc(t('Notifications'))}</h2>
        ${state.notices.length ? `<button class="link" id="clear-notices">${esc(t('Clear all'))}</button>` : ''}
      </div>
      ${
        state.notices.length
          ? `<ul class="notices">${state.notices
              .map(
                (n) => `<li class="${n.read ? '' : 'unread'}">
                  <span class="notice-icon">${NOTICE_ICON[n.kind]}</span>
                  <div><p>${esc(n.text)}</p><small>${timeAgo(n.at)}</small></div>
                </li>`,
              )
              .join('')}</ul>`
          : `<p class="empty">${esc(t('Nothing yet. Coin rewards, spending alerts, cheers from friends and bank syncs show up here.'))}</p>`
      }
    </section>`;
}

function drawerHtml(profile: Profile, mood: Mood): string {
  return `
    <div class="scrim" id="scrim"></div>
    <aside class="drawer" id="drawer" aria-label="${esc(t('Menu'))}">
      <div class="drawer-head">${brand()}<button class="icon" id="close-menu" aria-label="${esc(t('Close menu'))}">${LINE.close}</button></div>
      ${langSwitchHtml()}
      <div class="drawer-profile">
        ${renderAvatar(profile.character, mood, state.equipped)}
        <div><strong>${esc(profile.name)}</strong><small>${esc(moodLabel(mood))}</small></div>
      </div>
      <nav>
        ${MENU.map(
          (m) => `<button data-view="${m.view}" ${m.view === view ? 'aria-current="page"' : ''}>${m.icon}<span>${esc(t(m.label))}</span></button>`,
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
    chat: () => chatPageHtml(profile, now, mood),
    predict: () => renderPredict(state, profile),
    history: () => historyHtml(profile, now, mood),
    notifications: () => notificationsHtml(),
    friends: () => {
      if (!socialEnabled) {
        return `${myHouseHtml(state, profile, mood)}<section class="card"><h2>${esc(t('Friends'))}</h2><p class="hint">${esc(t("Friends need an online account. This copy of OinkCoin isn't connected to one."))}</p></section>`;
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
  const unread = view === 'notifications' ? 0 : state.notices.filter((n) => !n.read).length;

  setDrawer(false);
  app.innerHTML = `
    <header class="topbar">
      <button class="menu-btn" id="menu" aria-label="${esc(t('Open menu'))}" aria-expanded="false" aria-controls="drawer"><span></span><span></span><span></span></button>
      ${brand()}
      <div class="top-actions">
        <button class="bell${unread ? ' has-unread' : ''}" data-view="notifications" aria-label="${esc(unread ? t('Notifications, {n} unread', { n: unread }) : t('Notifications'))}">
          ${LINE.bell}${unread ? `<span class="badge">${unread > 9 ? '9+' : unread}</span>` : ''}
        </button>
        <button class="coin-chip" data-view="store" aria-label="${esc(t('{n} coins, open store', { n: state.coins }))}">${ICONS.coin}<b>${state.coins}</b></button>
      </div>
    </header>
    ${drawerHtml(profile, mood)}
    <main class="stack${view === 'chat' ? ' chat-mode' : ''}">${body}</main>
    ${state.tutorialSeen ? '' : tutorialHtml(tutorialStep)}`;

  // Opening the list marks everything read (shown highlighted this once).
  if (view === 'notifications' && state.notices.some((n) => !n.read)) {
    state.notices = state.notices.map((n) => ({ ...n, read: true }));
    saveState(state);
  }
  // Keep the goals card open or closed across re-renders.
  app.querySelector<HTMLDetailsElement>('#goals-card')?.addEventListener('toggle', (e) => {
    goalsOpen = (e.target as HTMLDetailsElement).open;
  });
  app.querySelector<HTMLDetailsElement>('#cash-card')?.addEventListener('toggle', (e) => {
    cashOpen = (e.target as HTMLDetailsElement).open;
  });
  app.querySelector<HTMLDetailsElement>('#categories-card')?.addEventListener('toggle', (e) => {
    categoriesOpen = (e.target as HTMLDetailsElement).open;
  });
  app.querySelector('#clear-notices')?.addEventListener('click', () => {
    state.notices = [];
    persist();
  });

  const finishTutorial = () => {
    state.tutorialSeen = true;
    tutorialStep = 0;
    saveState(state);
    render();
  };
  app.querySelector('#tutorial-skip')?.addEventListener('click', finishTutorial);
  app.querySelector('#tutorial-next')?.addEventListener('click', () => {
    if (tutorialStep >= tutorialLength - 1) return finishTutorial();
    tutorialStep++;
    renderDashboard(profile);
  });
  app.querySelector('#tutorial-back')?.addEventListener('click', () => {
    tutorialStep = Math.max(0, tutorialStep - 1);
    renderDashboard(profile);
  });
  app.querySelector('#restart-tutorial')?.addEventListener('click', () => {
    tutorialStep = 0;
    state.tutorialSeen = false;
    renderDashboard(profile);
  });

  bindLangSwitch(app);
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
      btn.textContent = t('Copied!');
    } catch {
      btn.textContent = t('Select and copy it');
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
      friendsMsg = t('Saved. Friends will see this name.');
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
  friendAction('accept', acceptFriend, t('You are now friends!'));
  friendAction('decline', removeFriend, t('Request declined.'));
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
        ? t('Cheer sent! They get +10 Love next time they open OinkCoin.')
        : t('You already cheered for them today. Come back tomorrow!');
    } catch (err) {
      friendsMsg = errorText(err);
    }
    render();
  });
  app.querySelector<HTMLButtonElement>('#unfriend')?.addEventListener('click', async (e) => {
    if (!confirm(t('Remove this friend? You can add each other again with your codes.'))) return;
    try {
      await removeFriend((e.currentTarget as HTMLButtonElement).dataset.unfriend!);
      visiting = null;
      friendsMsg = t('Friend removed.');
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
      ? t('Log out and remove your data from this device? It stays backed up to your account.')
      : t('Log out and remove your buddy, coins and transactions from this device? This cannot be undone.');
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
    if (!confirm(t('Turn off two-factor sign-in? Your account will be protected by your password only.'))) return;
    try {
      await disableTwoFactor();
      accountMsg = t('Two-factor sign-in is off.');
    } catch (err) {
      accountMsg = errorText(err);
    }
    render();
  });
  app.querySelector('#link-bank')?.addEventListener('click', () => void linkBank());
  app.querySelector('#sync-bank')?.addEventListener('click', () => void syncNow(false));
  app.querySelector('#unlink-bank')?.addEventListener('click', async () => {
    if (!confirm(t('Disconnect your bank? Transactions already imported stay in OinkCoin.'))) return;
    try {
      await disconnectBank();
      state.bank = null;
      bankMsg = t('Bank disconnected. OinkCoin can no longer see your accounts.');
      saveState(state);
    } catch (err) {
      bankMsg = errorText(err);
    }
    render();
  });
  app.querySelector('#reset')?.addEventListener('click', async () => {
    if (!confirm(t('Delete your account, buddy and all your data? This cannot be undone.'))) return;
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
      showToast(`${ICONS.bag}<span>${esc(t('{item} is yours!', { item: t(item.name) }))}</span>`);
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
      showToast(`${ICONS.bag}<span>${esc(t('{item} is in your house!', { item: t(item.name) }))}</span>`);
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

  if (view === 'predict') bindPredict(app, state, profile);

  // Chat with the buddy
  const chatForm = app.querySelector<HTMLFormElement>('#chat-form');
  chatForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatForm.elements.namedItem('q') as HTMLInputElement;
    askBuddy(profile, input.value);
    input.value = '';
    input.focus();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-ask]').forEach((b) => b.addEventListener('click', () => askBuddy(profile, b.dataset.ask!)));
  const chatLogEl = app.querySelector<HTMLElement>('#chat-log');
  if (chatLogEl) chatLogEl.scrollTop = chatLogEl.scrollHeight;

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
      const beforeIn = state.income.length;
      state.expenses = mergeExpenses(state.expenses, incoming.expenses);
      state.income = mergeIncome(state.income, incoming.income);
      const deposits = state.income.length - beforeIn;
      const bought = state.expenses.length - before;
      moneyMsg = deposits
        ? tp('Imported {p} new purchases and {n} deposit.', 'Imported {p} new purchases and {n} deposits.', deposits, { p: bought })
        : t('Imported {p} new purchases.', { p: bought });
    } catch (err) {
      moneyMsg = err instanceof Error ? err.message : t('Could not read that file.');
    }
    persist();
  });
  const incomeForm = app.querySelector<HTMLFormElement>('#income-form');
  incomeForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(incomeForm);
    const amount = Number(data.get('amount'));
    if (!(amount > 0)) return;
    state.income.push({
      id: crypto.randomUUID(),
      amount: Math.round(amount * 100) / 100,
      note: String(data.get('note') ?? '').trim(),
      date: String(data.get('date')),
    });
    persist();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-delete-income]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.income = state.income.filter((i) => i.id !== btn.dataset.deleteIncome);
      persist();
    }),
  );
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
  fx.innerHTML = effects(action);

  clearTimeout(reactTimer);
  reactTimer = window.setTimeout(render, 2200);
}

if (cloudEnabled) {
  setSaveListener(queueCloudSave);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flushCloudSave();
  });
}

// GitHub Pages lets browsers reuse the page for 10 minutes, so after a deploy people kept seeing the
// old version. Check for a newer build when the app opens or comes back to the foreground, and reload.
async function checkForUpdate(): Promise<void> {
  if (import.meta.env.DEV || location.hash) return; // don't interrupt email links that carry a #token
  try {
    const current = document.querySelector<HTMLScriptElement>('script[type="module"][src*="assets/index-"]')?.src ?? '';
    const html = await (await fetch(`${location.pathname}?check=${Date.now()}`, { cache: 'no-store' })).text();
    const latest = html.match(/assets\/index-[\w-]+\.js/)?.[0];
    if (!latest || !current || current.endsWith(latest)) return;
    // Only once per new build, so a stale cache can never cause a reload loop.
    if (sessionStorage.getItem('oinkcoin-reloaded-for') === latest) return;
    sessionStorage.setItem('oinkcoin-reloaded-for', latest);
    location.replace(`${location.pathname}?v=${Date.now()}`);
  } catch {
    // Offline: keep the current version.
  }
}
if (new URLSearchParams(location.search).has('v')) history.replaceState(null, '', location.pathname + location.hash);
void checkForUpdate();
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void checkForUpdate();
});

// Changing the language redraws whatever is on screen, and keeps the menu open so the change is visible.
onLangChange(() => {
  document.title = t('OinkCoin - Your Budget Buddy');
  // Chat lines and the bubble are saved as text in one language, so start them over in the new one.
  chatLog = [];
  bubbleKey = '';
  const menuWasOpen = document.body.classList.contains('drawer-open');
  render();
  if (menuWasOpen) setDrawer(true);
});

initAuth(render).then(() => {
  render();
  if (bankEnabled && isOAuthReturn() && currentUser()?.consent) void linkBank(true);
});
