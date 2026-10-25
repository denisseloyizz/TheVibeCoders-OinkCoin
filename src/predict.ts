import { localDateKey } from './budget';
import { locale, t, T } from './i18n';
import type { AppState, Expense, Profile } from './types';
import { esc } from './util';

// Forecasts and "what if I spend less on X" math. Everything runs on the user's own transactions on
// the device. These are estimates from a simple pace, not promises, and the page says so.

export interface Lever {
  id: string;
  label: string;
  blurb: string;
}

/** Spending buckets the user can realistically cut. Needs like rent and bills are not on this list. */
export const LEVERS: Lever[] = [
  { id: 'coffee', label: T('Coffee & boba'), blurb: T('Starbucks, Dunkin, boba runs') },
  { id: 'delivery', label: T('Delivery apps'), blurb: T('DoorDash, Uber Eats') },
  { id: 'dining', label: T('Dining out'), blurb: T('Restaurants and takeout') },
  { id: 'shopping', label: T('Shopping'), blurb: T('Amazon, clothes, gadgets') },
  { id: 'fun', label: T('Entertainment'), blurb: T('Concerts, streaming, games') },
  { id: 'trips', label: T('Trips & other'), blurb: T('Flights, hotels, one off splurges') },
];

const COFFEE = /coffee|cafe|starbucks|dunkin|blue bottle|philz|peet|espresso|latte|boba|bubble tea/i;
const DELIVERY = /doordash|uber ?eats|grubhub|postmates|delivery/i;
const TRIPS = /airline|delta|united air|southwest|amtrak|hotel|resort|airbnb|marriott|hilton|hostel|flight|cruise/i;

/** One off spending that does not repeat every day, so it is counted as spent rather than scaled up. */
export const LUMPY = new Set(['trips']);

export function bucketOf(e: Expense): string | null {
  const text = `${e.note}`;
  if (COFFEE.test(text)) return 'coffee';
  if (DELIVERY.test(text)) return 'delivery';
  if (TRIPS.test(text) || e.category === 'Other') return 'trips';
  if (e.category === 'Food & Dining') return 'dining';
  if (e.category === 'Shopping') return 'shopping';
  if (e.category === 'Entertainment') return 'fun';
  return null;
}

export interface Forecast {
  monthKey: string;
  monthName: string;
  day: number;
  days: number;
  daysLeft: number;
  budget: number;
  spent: number;
  /** Estimated total for the month: bills as they come, everything else at today's pace. */
  projected: number;
  remaining: number;
  /** What you can spend per day from today and still finish on budget. */
  safePerDay: number;
  /** Full-month estimate and amount already spent, per cuttable bucket. */
  byBucket: Record<string, number>;
  soFar: Record<string, number>;
  /** Number of purchases so far, per cuttable bucket. */
  counts: Record<string, number>;
  /** Running total of spending for each day so far, day 1 first. */
  cumulative: number[];
  income: number;
  now: Date;
}

const sum = (list: { amount: number }[]) => Math.round(list.reduce((s, e) => s + e.amount, 0) * 100) / 100;

export function forecast(state: Pick<AppState, 'expenses' | 'income'>, profile: Profile, now = new Date()): Forecast {
  const y = now.getFullYear();
  const m = now.getMonth();
  const monthKey = localDateKey(now).slice(0, 7);
  const prevKey = localDateKey(new Date(y, m - 1, 1)).slice(0, 7);
  const days = new Date(y, m + 1, 0).getDate();
  const day = now.getDate();

  const month = state.expenses.filter((e) => e.date.startsWith(monthKey));
  const spent = sum(month);
  const billsNow = sum(month.filter((e) => e.category === 'Bills'));
  const billsLast = sum(state.expenses.filter((e) => e.date.startsWith(prevKey) && e.category === 'Bills'));
  const scale = days / day;

  const soFar: Record<string, number> = {};
  for (const e of month) {
    const id = bucketOf(e);
    if (id) soFar[id] = (soFar[id] ?? 0) + e.amount;
  }
  const byBucket: Record<string, number> = {};
  for (const l of LEVERS) byBucket[l.id] = (soFar[l.id] ?? 0) * (LUMPY.has(l.id) ? 1 : scale);
  const lumpySoFar = [...LUMPY].reduce((t, id) => t + (soFar[id] ?? 0), 0);
  const counts: Record<string, number> = {};
  for (const e of month) {
    const id = bucketOf(e);
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }

  const perDay = new Array<number>(day).fill(0);
  for (const e of month) {
    const d = Number(e.date.slice(8, 10));
    if (d >= 1 && d <= day) perDay[d - 1] += e.amount;
  }
  let running = 0;
  const cumulative = perDay.map((v) => (running += v));

  const remaining = profile.budget - spent;
  return {
    monthKey,
    monthName: now.toLocaleDateString(locale(), { month: 'long' }),
    day,
    days,
    daysLeft: days - day,
    budget: profile.budget,
    spent,
    projected: Math.max(billsNow, billsLast) + (spent - billsNow - lumpySoFar) * scale + lumpySoFar,
    remaining,
    safePerDay: Math.max(0, remaining) / (days - day + 1),
    byBucket,
    soFar,
    counts,
    cumulative,
    income: sum(state.income.filter((i) => i.date.startsWith(monthKey))),
    now,
  };
}

export const SAVINGS_RATES = [
  { rate: 0, label: T('Checking (0%)') },
  { rate: 0.04, label: T('Savings (4%)') },
  { rate: 0.07, label: T('Index fund (7%)') },
];

/** Value after saving `monthly` every month for `months`, earning `rate` a year, compounded monthly. */
export function futureValue(monthly: number, rate: number, months: number): number {
  const r = rate / 12;
  return r === 0 ? monthly * months : monthly * ((Math.pow(1 + r, months) - 1) / r);
}

/** Months until saving `monthly` reaches `goal`, or null if it never will (within 50 years). */
export function monthsToGoal(goal: number, monthly: number, rate: number): number | null {
  if (goal <= 0) return 0;
  if (monthly <= 0) return null;
  let balance = 0;
  for (let n = 1; n <= 600; n++) {
    balance = balance * (1 + rate / 12) + monthly;
    if (balance >= goal) return n;
  }
  return null;
}

export interface Plan {
  /** What the cuts save in a normal full month. */
  monthly: number;
  /** What they save in the part of this month that is left. */
  thisMonth: number;
  perLever: { lever: Lever; monthly: number; pct: number }[];
}

export function plan(f: Forecast, cuts: Record<string, number>): Plan {
  const perLever = LEVERS.map((lever) => {
    const pct = Math.min(100, Math.max(0, cuts[lever.id] ?? 0));
    return { lever, pct, monthly: (f.byBucket[lever.id] ?? 0) * (pct / 100) };
  });
  // Lumpy buckets have nothing left to cut this month; the savings come from skipping the next one.
  const thisMonth = LEVERS.reduce((s, l) => s + Math.max(0, (f.byBucket[l.id] ?? 0) - (f.soFar[l.id] ?? 0)) * ((cuts[l.id] ?? 0) / 100), 0);
  return { monthly: perLever.reduce((s, p) => s + p.monthly, 0), thisMonth, perLever };
}

/** One lever on its own, for the chat: "what if I cut coffee in half?" */
export function cutOne(f: Forecast, id: string, pct: number, rate = 0.04) {
  const monthly = (f.byBucket[id] ?? 0) * (pct / 100);
  return { monthly, yearly: monthly * 12, fiveYears: futureValue(monthly, rate, 60), baseline: f.byBucket[id] ?? 0 };
}

// ---------------------------------------------------------------- page

const ui = { cuts: {} as Record<string, number>, rate: 0.04, goal: 1000 };
const DEFAULT_CUT = 20;
const cutFor = (id: string) => ui.cuts[id] ?? (LUMPY.has(id) ? 0 : DEFAULT_CUT);

export function resetPredict(): void {
  ui.cuts = {};
  ui.rate = 0.04;
  ui.goal = 1000;
}

const dollars = (n: number) => `${n < 0 ? '-' : ''}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;

function paceNote(f: Forecast): { pill: string; tone: 'ok' | 'warn' | 'over'; note: string } {
  const diff = f.projected - f.budget;
  if (f.spent === 0) return { pill: t('No spending yet'), tone: 'ok', note: t('Nothing to forecast yet. Add expenses or sync your bank and I will do the math.') };
  if (f.remaining <= 0) {
    return {
      pill: f.remaining < 0 ? t('{amount} over already', { amount: dollars(-f.remaining) }) : t('Budget used up'),
      tone: 'over',
      note: t('The budget is gone with {days} days left. Every day from here is a no spend day. I believe in you. Barely.', { days: f.daysLeft }),
    };
  }
  if (diff > 0) {
    return {
      pill: t('{amount} over budget', { amount: dollars(diff) }),
      tone: 'over',
      note: t('At this pace you will blow past the budget by {diff}. To still make it, keep it under {perDay} a day from today.', { diff: dollars(diff), perDay: dollars(f.safePerDay) }),
    };
  }
  if (diff > -f.budget * 0.1) {
    return {
      pill: t('{amount} to spare', { amount: dollars(-diff) }),
      tone: 'warn',
      note: t('Cutting it close, but you make it with {amount} to spare. Do not celebrate with a latte yet.', { amount: dollars(-diff) }),
    };
  }
  return {
    pill: t('{amount} under budget', { amount: dollars(-diff) }),
    tone: 'ok',
    note: t('You finish {amount} under budget at this pace. Your future self is sending a thank you text.', { amount: dollars(-diff) }),
  };
}

function chartSvg(f: Forecast, planEnd: number | null): string {
  const W = 320;
  const H = 190;
  const L = 10;
  const R = 10;
  const T = 22;
  const B = 24;
  const pw = W - L - R;
  const ph = H - T - B;
  const maxY = Math.max(f.projected, f.budget, f.spent, 1) * 1.12;
  const x = (d: number) => L + ((d - 1) / Math.max(1, f.days - 1)) * pw;
  const y = (v: number) => T + ph - (v / maxY) * ph;

  const pts = f.cumulative.map((v, i) => `${x(i + 1).toFixed(1)},${y(v).toFixed(1)}`);
  const line = pts.length > 0 ? `M${pts.join(' L')}` : '';
  const area = pts.length > 0 ? `${line} L${x(f.day).toFixed(1)},${y(0)} L${x(1)},${y(0)} Z` : '';
  const here = { x: x(f.day), y: y(f.spent) };
  const end = { x: x(f.days), y: y(f.projected) };
  const showPlan = planEnd !== null && f.projected - planEnd > 0.5;
  const budgetY = y(f.budget);

  return `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t('Spending so far this month and where it is heading. Projected {projected} against a budget of {budget}.', { projected: dollars(f.projected), budget: dollars(f.budget) }))}">
      <defs><linearGradient id="pg-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e5487f" stop-opacity=".28"/><stop offset="1" stop-color="#e5487f" stop-opacity="0"/></linearGradient></defs>
      <line x1="${L}" x2="${W - R}" y1="${budgetY}" y2="${budgetY}" stroke="#7a7276" stroke-width="1.2" stroke-dasharray="4 4"/>
      <text x="${L}" y="${budgetY - 5}" class="pc-label">${esc(t('Budget {amount}', { amount: dollars(f.budget) }))}</text>
      ${area ? `<path d="${area}" fill="url(#pg-area)"/>` : ''}
      ${line ? `<path d="${line}" fill="none" stroke="#e5487f" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
      <line x1="${here.x}" y1="${here.y}" x2="${end.x}" y2="${end.y}" stroke="${f.projected > f.budget ? '#e23b4f' : '#e5487f'}" stroke-width="2.4" stroke-dasharray="2 5" stroke-linecap="round"/>
      ${showPlan ? `<line x1="${here.x}" y1="${here.y}" x2="${end.x}" y2="${y(planEnd!)}" stroke="#1f9d63" stroke-width="2.6" stroke-dasharray="6 5" stroke-linecap="round"/><circle cx="${end.x}" cy="${y(planEnd!)}" r="4.2" fill="#1f9d63"/>` : ''}
      <circle cx="${end.x}" cy="${end.y}" r="4.2" fill="${f.projected > f.budget ? '#e23b4f' : '#e5487f'}"/>
      <text x="${W - R}" y="${Math.max(12, Math.min(end.y, budgetY) - 12)}" text-anchor="end" class="pc-label pc-strong">${esc(t('{amount} projected', { amount: dollars(f.projected) }))}</text>
      <circle cx="${here.x}" cy="${here.y}" r="5" fill="#fff" stroke="#e5487f" stroke-width="2.6"/>
      <text x="${L}" y="${H - 6}" class="pc-label">1</text>
      <text x="${W / 2}" y="${H - 6}" text-anchor="middle" class="pc-label">${esc(f.monthName)}</text>
      <text x="${W - R}" y="${H - 6}" text-anchor="end" class="pc-label">${f.days}</text>
    </svg>`;
}

/** The chart plus a legend that carries the numbers, so no labels have to fit inside the drawing. */
function chartHtml(f: Forecast, planEnd: number): string {
  const showPlan = f.projected - planEnd > 0.5;
  return `${chartSvg(f, planEnd)}
    <div class="legend"><span class="l-solid">${esc(t('So far {amount}', { amount: dollars(f.spent) }))}</span><span class="l-dots">${esc(t('Projected {amount}', { amount: dollars(f.projected) }))}</span>${showPlan ? `<span class="l-plan">${esc(t('With your plan {amount}', { amount: dollars(planEnd) }))}</span>` : ''}</div>`;
}

function monthYear(f: Forecast, monthsAhead: number): string {
  return new Date(f.now.getFullYear(), f.now.getMonth() + monthsAhead, 1).toLocaleDateString(locale(), { month: 'short', year: 'numeric' });
}

function resultsHtml(f: Forecast): string {
  const p = plan(f, Object.fromEntries(LEVERS.map((l) => [l.id, cutFor(l.id)])));
  const m = p.monthly;
  const y1 = futureValue(m, ui.rate, 12);
  const y5 = futureValue(m, ui.rate, 60);
  const y10 = futureValue(m, ui.rate, 120);
  const earned = (fv: number, months: number) => fv - m * months;
  const eta = monthsToGoal(ui.goal, m, ui.rate);
  const planEnd = f.projected - p.thisMonth;
  const bowls = Math.round((m * 12) / 11);

  if (m < 0.5) {
    return `<p class="empty">${t('Slide a cut up to see what it would save you. Even 10% adds up.')}</p>`;
  }

  return `
    <div class="plan-total">
      <small>${t('Your plan saves')}</small>
      <strong>${dollars(m)}<span>${t('/month')}</span></strong>
      <small>${t('{amount} a year, before interest', { amount: dollars(m * 12) })}</small>
    </div>
    <div class="plan-grid">
      <div><small>${t('In 1 year')}</small><b>${dollars(y1)}</b>${ui.rate > 0 ? `<span>${t('+{amount} interest', { amount: dollars(earned(y1, 12)) })}</span>` : ''}</div>
      <div><small>${t('In 5 years')}</small><b>${dollars(y5)}</b>${ui.rate > 0 ? `<span>${t('+{amount} interest', { amount: dollars(earned(y5, 60)) })}</span>` : ''}</div>
      <div><small>${t('In 10 years')}</small><b>${dollars(y10)}</b>${ui.rate > 0 ? `<span>${t('+{amount} interest', { amount: dollars(earned(y10, 120)) })}</span>` : ''}</div>
    </div>
    <ul class="plan-facts">
      ${
        ui.goal > 0
          ? `<li><b>${t('{amount} goal:', { amount: dollars(ui.goal) })}</b> ${eta === null ? t('out of reach at this rate. Cut a little more.') : eta <= 1 ? t('reached in about a month.') : t('reached in about <b>{n} months</b> ({date}).', { n: eta, date: monthYear(f, eta) })}</li>`
          : ''
      }
      ${p.thisMonth >= 1 ? `<li>${t('<b>This month alone</b> you would keep {kept}, finishing around {end} instead of {projected}{tail}', { kept: dollars(p.thisMonth), end: dollars(planEnd), projected: dollars(f.projected), tail: planEnd <= f.budget ? t(', which is under budget.') : '.' })}</li>` : ''}
      ${bowls >= 2 ? `<li>${t('That is about <b>{n} burrito bowls</b> a year you get to keep. Or one very nice trip.', { n: bowls.toLocaleString('en-US') })}</li>` : ''}
    </ul>`;
}

/** Cash flow, shown only once there is income this month. */
function cashFlowHtml(f: Forecast, planMonthly: number): string {
  if (f.income <= 0) return '';
  const left = f.income - f.projected;
  const rate = f.income > 0 ? left / f.income : 0;
  return `
    <section class="card">
      <h2>${t('Cash flow this month')}</h2>
      <p class="hint">${t('Money in so far, against where spending is heading.')}</p>
      <div class="plan-grid">
        <div><small>${t('Money in')}</small><b class="pos">${dollars(f.income)}</b></div>
        <div><small>${t('Spending (projected)')}</small><b>${dollars(f.projected)}</b></div>
        <div><small>${t('Left over')}</small><b class="${left < 0 ? 'neg' : 'pos'}">${dollars(left)}</b></div>
      </div>
      <p class="hint">${left >= 0 ? `${t('You would keep about {pct}% of what comes in.', { pct: Math.round(rate * 100) })} ` : `${t('Spending is projected to be more than what came in.')} `}${planMonthly > 0 ? t('With your plan, that is {amount} a month.', { amount: dollars(left + planMonthly) }) : ''}</p>
    </section>`;
}

export function renderPredict(state: AppState, profile: Profile): string {
  const f = forecast(state, profile);
  const p = plan(f, Object.fromEntries(LEVERS.map((l) => [l.id, cutFor(l.id)])));
  const pace = paceNote(f);
  const usage = f.budget > 0 ? Math.min(100, Math.round((f.projected / f.budget) * 100)) : 0;
  const levers = LEVERS.filter((l) => (f.byBucket[l.id] ?? 0) > 0);

  return `
    <section class="card predict-hero">
      <small class="eyebrow">${esc(t('{month} forecast', { month: f.monthName }))}</small>
      <div class="predict-big">${dollars(f.projected)}<span>${t('projected spending')}</span></div>
      <span class="pace-pill ${pace.tone}">${esc(pace.pill)}</span>
      <div class="bar big"><div class="fill ${pace.tone === 'ok' ? 'ok' : pace.tone === 'warn' ? 'warn' : 'over'}" style="width:${usage}%"></div></div>
      <div class="predict-stats">
        <div><small>${t('Spent so far')}</small><b>${dollars(f.spent)}</b></div>
        <div><small>${t('Days left')}</small><b>${f.daysLeft}</b></div>
        <div><small>${t('Safe per day')}</small><b>${dollars(f.safePerDay)}</b></div>
      </div>
      <p class="oink-says" data-says="${esc(t('Oink says:'))}">${esc(pace.note)}</p>
      ${f.day < 5 && f.spent > 0 ? `<p class="hint">${t('Early in the month, so this is a rough guess. It gets sharper every day.')}</p>` : ''}
    </section>

    <section class="card">
      <h2>${t('Where the month is heading')}</h2>
      <div class="predict-chart" id="predict-chart">${chartHtml(f, f.projected - p.thisMonth)}</div>
    </section>

    <section class="card">
      <h2>${t('What if I spent less?')}</h2>
      <p class="hint">${t('Drag a slider to cut a habit and see what you keep.')}</p>
      <div class="presets">
        <button type="button" class="chat-chip" data-preset="20">${t('Realistic (20%)')}</button>
        <button type="button" class="chat-chip" data-preset="50">${t('Hardcore (50%)')}</button>
        <button type="button" class="chat-chip" data-preset="0">${t('Reset')}</button>
      </div>
      ${
        levers.length === 0
          ? `<p class="empty">${t('Add some spending and the sliders show up here.')}</p>`
          : levers
              .map(
                (l) => `
        <div class="lever">
          <div class="lever-head">
            <div><strong>${esc(t(l.label))}</strong><small>${esc(t(l.blurb))} &middot; ${LUMPY.has(l.id) ? t('{amount} so far', { amount: dollars(f.byBucket[l.id]) }) : t('about {amount}/mo', { amount: dollars(f.byBucket[l.id]) })}</small></div>
            <output id="out-${l.id}">${cutFor(l.id)}%</output>
          </div>
          <input type="range" min="0" max="100" step="5" value="${cutFor(l.id)}" data-lever="${l.id}" aria-label="${esc(t('Cut {label} by percent', { label: t(l.label) }))}" />
        </div>`,
              )
              .join('')
      }
    </section>

    <section class="card">
      <h2>${t('What you would keep')}</h2>
      <div class="plan-opts">
        <label>${t('Put it in')}<select id="predict-rate" aria-label="${esc(t('Where the savings go'))}">${SAVINGS_RATES.map((r) => `<option value="${r.rate}" ${r.rate === ui.rate ? 'selected' : ''}>${esc(t(r.label))}</option>`).join('')}</select></label>
        <label>${t('Savings goal')}<input id="predict-goal" type="number" min="0" step="50" inputmode="numeric" value="${ui.goal}" aria-label="${esc(t('Savings goal in dollars'))}" /></label>
      </div>
      <div id="predict-results">${resultsHtml(f)}</div>
    </section>

    ${cashFlowHtml(f, p.monthly)}
    <p class="disclaimer">${t('Estimates from your pace so far, not financial advice. Interest rates change, and investments can lose money.')}</p>`;
}

/** Wires the sliders and options. Updates the numbers in place so dragging stays smooth. */
export function bindPredict(root: HTMLElement, state: AppState, profile: Profile): void {
  const f = forecast(state, profile);
  const refresh = () => {
    const p = plan(f, Object.fromEntries(LEVERS.map((l) => [l.id, cutFor(l.id)])));
    const results = root.querySelector('#predict-results');
    const chart = root.querySelector('#predict-chart');
    if (results) results.innerHTML = resultsHtml(f);
    if (chart) chart.innerHTML = chartHtml(f, f.projected - p.thisMonth);
  };
  const setCut = (id: string, pct: number) => {
    ui.cuts[id] = pct;
    const out = root.querySelector(`#out-${id}`);
    if (out) out.textContent = `${pct}%`;
  };

  root.querySelectorAll<HTMLInputElement>('[data-lever]').forEach((input) =>
    input.addEventListener('input', () => {
      setCut(input.dataset.lever!, Number(input.value));
      refresh();
    }),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((b) =>
    b.addEventListener('click', () => {
      const pct = Number(b.dataset.preset);
      root.querySelectorAll<HTMLInputElement>('[data-lever]').forEach((input) => {
        // A 20% trim of trips makes no sense, so only the hardcore plan skips them.
        const target = LUMPY.has(input.dataset.lever!) && pct === 20 ? 0 : pct;
        input.value = String(target);
        setCut(input.dataset.lever!, target);
      });
      refresh();
    }),
  );
  root.querySelector<HTMLSelectElement>('#predict-rate')?.addEventListener('change', (e) => {
    ui.rate = Number((e.target as HTMLSelectElement).value);
    refresh();
  });
  root.querySelector<HTMLInputElement>('#predict-goal')?.addEventListener('input', (e) => {
    ui.goal = Math.max(0, Number((e.target as HTMLInputElement).value) || 0);
    refresh();
  });
}
