import { CHARACTERS, renderAvatar } from './avatar';
import { formatMoney, isWant, roundBudget, spendingHistory, suggestedLimits, type SpendingHistory } from './budget';
import { t, T, tp } from './i18n';
import { LINE } from './icons';
import { catLabel, charLabel, goalLabel } from './labels';
import { brand } from './logo';
import { mergeExpenses, mergeIncome, readStatementFile } from './statement';
import { CATEGORIES, GOALS, type AppState, type Category, type Character, type Expense, type Goal, type Income } from './types';
import { esc } from './util';

interface Draft {
  step: number;
  character: Character;
  name: string;
  budget: number;
  /** True once the user has picked a budget (or is editing an existing one), so we stop suggesting. */
  budgetChosen: boolean;
  imported: Expense[];
  importedIncome: Income[];
  importMsg: string;
  importError: boolean;
  focus: Category[];
  goal: Goal;
}

const STEPS = [T('Buddy'), T('Spending'), T('Budget'), T('Goals')];
const SPENDING = 1;
const BUDGET = 2;
const FOCUSABLE: Category[] = CATEGORIES.filter((c) => c !== 'Bills');
let draft: Draft | null = null;

/** Bank linking, supplied by the app when a backend is configured. */
export interface BankOption {
  link: () => void;
  busy: boolean;
  message: string;
}

function newDraft(state: AppState): Draft {
  const p = state.profile;
  return {
    step: 0,
    character: p?.character ?? 'pig',
    name: p?.name ?? '',
    budget: p?.budget ?? 2000,
    budgetChosen: !!p,
    imported: [],
    importedIncome: [],
    importMsg: '',
    importError: false,
    focus: p?.focus ?? [],
    goal: p?.goal ?? 'Save more money',
  };
}

function spendingStep(d: Draft, state: AppState, bank: BankOption | null): string {
  const linked = state.bank;
  const done = linked || d.imported.length > 0;
  return `
        <h2>${esc(t('How should {name} see your spending?', { name: d.name || t('your buddy') }))}</h2>
        <p class="hint">${t('Pick one. You can always add more later.')}</p>
        ${
          linked
            ? `<p class="import-msg" role="status">${esc(t('Bank connected: {accounts}.', { accounts: linked.accounts.map((a) => a.name + (a.mask ? ` ··${a.mask}` : '')).join(', ') || t('your accounts') }))}</p>`
            : ''
        }
        <div class="sources">
          ${
            bank && !linked
              ? `<button type="button" class="source" id="link-bank" ${bank.busy ? 'disabled' : ''}>
                  <strong>${bank.busy ? t('Connecting...') : t('Link your bank')}</strong>
                  <small>${t('Imports transactions automatically and keeps them up to date. Read-only: OinkCoin can never move money.')}</small>
                </button>`
              : ''
          }
          <label class="source">
            <input type="file" id="statement" accept=".csv,text/csv" />
            <strong>${d.imported.length ? t('Upload another statement') : t('Upload a bank statement')}</strong>
            <small>${t('A CSV file from your bank (for example Bank of America: Activity &gt; Download &gt; Microsoft Excel). Stays private.')}</small>
          </label>
          ${
            done
              ? ''
              : `<button type="button" class="source" id="use-cash">
                  <strong>${t('Skip, I use cash')}</strong>
                  <small>${t('Add expenses by hand as you spend.')}</small>
                </button>`
          }
        </div>
        ${bank?.message ? `<p class="import-msg" role="status">${esc(bank.message)}</p>` : ''}
        ${d.importMsg ? `<p class="import-msg${d.importError ? ' error' : ''}" role="status">${esc(d.importMsg)}</p>` : ''}`;
}

/** Everything we know about past spending: bank sync, earlier imports, and the file just uploaded. */
const historyFor = (d: Draft, state: AppState) => spendingHistory(mergeExpenses(state.expenses, d.imported));

function limitPreview(budget: number, focus: Category[], history: SpendingHistory | null): string {
  const limits = suggestedLimits(budget, focus, history);
  return CATEGORIES.map((c) => ({ c, v: limits[c] }))
    .sort((a, b) => b.v - a.v)
    .map(
      ({ c, v }) =>
        `<li><span>${esc(catLabel(c))} <small>${isWant(c) ? t('want') : t('need')}${focus.includes(c) ? t(', cutting back') : ''}</small></span><b>${formatMoney(v)}</b></li>`,
    )
    .join('');
}

function budgetStep(d: Draft, h: SpendingHistory | null): string {
  const input = `<div class="money-input"><span>$</span><input name="budget" type="number" min="1" step="1" required value="${d.budget}" aria-label="${t('Monthly budget')}" /></div>`;
  const preview = `
    <p class="q">${t('Your category limits')}</p>
    <p class="hint">${h ? t('Shaped by where your money actually goes.') : t('A typical split.')} ${t('They update as you change the budget.')}</p>
    <ul class="limit-preview" id="limit-preview">${limitPreview(d.budget, d.focus, h)}</ul>`;

  if (!h) {
    return `
      <h2>${t("What's your monthly budget?")}</h2>
      <p class="hint">${t('How much can you spend each month after savings?')}</p>
      ${input}
      <div class="chips">
        ${[1000, 2000, 3000, 5000].map((v) => `<button type="button" class="chip" data-budget="${v}" aria-pressed="false">$${v.toLocaleString('en-US')}</button>`).join('')}
      </div>
      ${preview}`;
  }

  const wants = CATEGORIES.filter(isWant).reduce((s, c) => s + h.byCategory[c], 0);
  const top = CATEGORIES.filter((c) => h.byCategory[c] > 0)
    .sort((a, b) => h.byCategory[b] - h.byCategory[a])
    .slice(0, 3);
  const period = h.partial ? t('So far this month') : tp('Over the last month', 'Over the last {n} months', h.months);
  const options = [
    { label: t('Match my spending'), value: roundBudget(h.total) },
    { label: t('Save 10%'), value: roundBudget(h.total * 0.9), suggested: true },
    { label: t('Save 20%'), value: roundBudget(h.total * 0.8) },
  ];
  return `
    <h2>${t("What's your monthly budget?")}</h2>
    <div class="spend-summary">
      <p>${h.partial ? t('{period}, you spent about <b>{amount}</b>.', { period, amount: formatMoney(h.total) }) : t('{period}, you spent about <b>{amount}</b> a month.', { period, amount: formatMoney(h.total) })}</p>
      <div class="nw">
        <div class="need"><small>${t('Needs')}</small><b>${formatMoney(h.total - wants)}</b></div>
        <div class="want"><small>${t('Wants')}</small><b>${formatMoney(wants)}</b></div>
      </div>
      <p class="hint">${t('Biggest: {list}', { list: top.map((c) => `${esc(catLabel(c))} ${formatMoney(h.byCategory[c])}`).join(' &middot; ') })}</p>
    </div>
    <p class="hint">${t('We suggest a budget about 10% under what you spend now. Pick one or type your own.')}</p>
    ${input}
    <div class="chips">
      ${options
        .map(
          (o) =>
            `<button type="button" class="chip" data-budget="${o.value}" aria-pressed="false">${o.label} &middot; ${formatMoney(o.value).replace('.00', '')}${o.suggested ? ` <small class="tag">${t('suggested')}</small>` : ''}</button>`,
        )
        .join('')}
    </div>
    ${preview}`;
}

function stepBody(d: Draft): string {
  switch (d.step) {
    case 0:
      return `
        <h2>${t('Choose your buddy')}</h2>
        <div class="avatar-pick">
          ${CHARACTERS.map(
            (c) => `
            <label class="pick">
              <input type="radio" name="character" value="${c.id}" aria-label="${charLabel(c.id)}" ${c.id === d.character ? 'checked' : ''} />
              ${renderAvatar(c.id, 'happy')}
            </label>`,
          ).join('')}
        </div>
        <label class="field">${t('Give your buddy a name')}
          <input name="name" required maxlength="20" value="${esc(d.name)}" placeholder="${t('e.g. Penny')}" />
        </label>`;
    default:
      return `
        <h2>${t('Set your goals')}</h2>
        <p class="hint">${t('Two quick questions. You can change them later in Profile &amp; Settings.')}</p>
        <p class="q">${t('1. What do you want to spend less on?')}</p>
        <p class="hint">${t('Each one gets a limit 20% smaller than usual. Going over it makes your buddy one step sadder.')}</p>
        <div class="chips">
          ${FOCUSABLE.map(
            (c) => `<label class="chip"><input type="checkbox" name="focus" value="${esc(c)}" ${d.focus.includes(c) ? 'checked' : ''} />${esc(catLabel(c))}</label>`,
          ).join('')}
        </div>
        <p class="q">${t("2. What's your main goal?")}</p>
        <p class="hint">${t("We'll suggest a matching tip in Grow Your Money.")}</p>
        <div class="options">
          ${GOALS.map(
            (g) => `<label class="option"><input type="radio" name="goal" value="${esc(g)}" ${g === d.goal ? 'checked' : ''} />${esc(goalLabel(g))}</label>`,
          ).join('')}
        </div>`;
  }
}

function topCategory(expenses: Expense[]): { category: Category; total: number } | null {
  const totals = new Map<Category, number>();
  for (const e of expenses) {
    if (FOCUSABLE.includes(e.category)) totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  const [best] = [...totals].sort((a, b) => b[1] - a[1]);
  return best ? { category: best[0], total: best[1] } : null;
}

export function renderOnboarding(
  app: HTMLElement,
  state: AppState,
  done: () => void,
  cancel: (() => void) | null,
  bank: BankOption | null = null,
): void {
  draft ??= newDraft(state);
  const d = draft;
  const rerender = () => renderOnboarding(app, state, done, cancel, bank);
  const spendingDone = !!state.bank || d.imported.length > 0;
  const history = d.step >= BUDGET ? historyFor(d, state) : null;
  const body = d.step === SPENDING ? spendingStep(d, state, bank) : d.step === BUDGET ? budgetStep(d, history) : stepBody(d);

  app.innerHTML = `
    <main class="onboard card">
      <div class="onboard-head">
        ${brand()}
        ${cancel ? `<button type="button" class="icon" id="cancel" aria-label="${t('Close')}">${LINE.close}</button>` : ''}
      </div>
      <ol class="steps">
        ${STEPS.map((s, i) => `<li class="${i < d.step ? 'done' : ''}${i === d.step ? ' current' : ''}"><span>${i + 1}</span>${t(s)}</li>`).join('')}
      </ol>
      <form id="step-form">
        ${body}
        <div class="actions">
          ${d.step > 0 ? `<button type="button" class="secondary" id="back">${t('Back')}</button>` : ''}
          ${d.step === SPENDING && !spendingDone ? '' : `<button type="submit">${d.step === STEPS.length - 1 ? t("Let's go!") : t('Next')}</button>`}
        </div>
      </form>
    </main>`;

  const form = app.querySelector<HTMLFormElement>('#step-form')!;

  app.querySelector('#cancel')?.addEventListener('click', () => {
    draft = null;
    cancel?.();
  });
  app.querySelector('#link-bank')?.addEventListener('click', () => bank?.link());
  app.querySelector('#use-cash')?.addEventListener('click', () => form.requestSubmit());
  app.querySelector('#back')?.addEventListener('click', () => {
    d.step--;
    rerender();
  });
  const budgetInput = form.querySelector<HTMLInputElement>('input[name="budget"]');
  const budgetChips = app.querySelectorAll<HTMLButtonElement>('[data-budget]');
  // Highlight the chip that matches the budget, and refresh the category limits.
  const updatePreview = () => {
    if (!budgetInput) return;
    const value = Number(budgetInput.value);
    budgetChips.forEach((b) => {
      const on = Number(b.dataset.budget) === value;
      b.classList.toggle('selected', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const preview = app.querySelector('#limit-preview');
    if (preview) preview.innerHTML = limitPreview(Math.max(1, value || 1), d.focus, history);
  };
  budgetInput?.addEventListener('input', updatePreview);
  updatePreview();
  budgetChips.forEach((b) =>
    b.addEventListener('click', () => {
      budgetInput!.value = b.dataset.budget!;
      updatePreview();
    }),
  );
  app.querySelector<HTMLInputElement>('#statement')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const statement = await readStatementFile(file);
      d.imported = statement.expenses;
      d.importedIncome = statement.income;
      const top = topCategory(d.imported);
      const count = d.imported.length;
      const nd = d.importedIncome.length;
      const base = nd
        ? tp('Imported {count} purchases and {n} deposit.', 'Imported {count} purchases and {n} deposits.', nd, { count })
        : t('Imported {count} purchases.', { count });
      d.importMsg = base + (top ? ' ' + t('Outside of bills, you spend the most on {category} ({amount}).', { category: catLabel(top.category), amount: formatMoney(top.total) }) : '');
      d.importError = false;
    } catch (err) {
      d.imported = [];
      d.importedIncome = [];
      d.importMsg = err instanceof Error ? err.message : t('Could not read that file.');
      d.importError = true;
    }
    rerender();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    if (d.step === 0) {
      d.character = data.get('character') as Character;
      d.name = String(data.get('name')).trim() || 'Buddy';
    } else if (d.step === SPENDING) {
      const top = topCategory([...d.imported, ...state.expenses]);
      if (top && d.focus.length === 0) d.focus = [top.category];
      const h = historyFor(d, state);
      if (h && !d.budgetChosen) d.budget = roundBudget(h.total * 0.9);
    } else if (d.step === BUDGET) {
      d.budget = Math.max(1, Number(data.get('budget')) || 1);
      d.budgetChosen = true;
    } else {
      d.focus = data.getAll('focus').map(String).filter((c): c is Category => FOCUSABLE.includes(c as Category));
      const goal = String(data.get('goal'));
      d.goal = (GOALS as readonly string[]).includes(goal) ? (goal as Goal) : 'Save more money';

      state.profile = {
        name: d.name,
        character: d.character,
        budget: d.budget,
        limits: suggestedLimits(d.budget, d.focus, historyFor(d, state)),
        focus: d.focus,
        goal: d.goal,
      };
      state.expenses = mergeExpenses(state.expenses, d.imported);
      state.income = mergeIncome(state.income, d.importedIncome);
      draft = null;
      done();
      return;
    }
    d.step++;
    rerender();
  });
}
