import { CHARACTERS, renderAvatar } from './avatar';
import { defaultLimits, formatMoney } from './budget';
import { LINE } from './icons';
import { brand } from './logo';
import { mergeExpenses, readStatementFile } from './statement';
import { CATEGORIES, GOALS, type AppState, type Category, type Character, type Expense, type Goal } from './types';
import { esc } from './util';

interface Draft {
  step: number;
  character: Character;
  name: string;
  budget: number;
  imported: Expense[];
  importMsg: string;
  importError: boolean;
  focus: Category[];
  goal: Goal;
}

const STEPS = ['Buddy', 'Budget', 'Statement', 'Goals'];
const FOCUSABLE: Category[] = CATEGORIES.filter((c) => c !== 'Bills');
let draft: Draft | null = null;

function newDraft(state: AppState): Draft {
  const p = state.profile;
  return {
    step: 0,
    character: p?.character ?? 'pig',
    name: p?.name ?? '',
    budget: p?.budget ?? 2000,
    imported: [],
    importMsg: '',
    importError: false,
    focus: p?.focus ?? [],
    goal: p?.goal ?? 'Save more money',
  };
}

function stepBody(d: Draft): string {
  switch (d.step) {
    case 0:
      return `
        <h2>Choose your buddy</h2>
        <div class="avatar-pick">
          ${CHARACTERS.map(
            (c) => `
            <label class="pick">
              <input type="radio" name="character" value="${c.id}" aria-label="${c.label}" ${c.id === d.character ? 'checked' : ''} />
              ${renderAvatar(c.id, 'happy')}
            </label>`,
          ).join('')}
        </div>
        <label class="field">Give your buddy a name
          <input name="name" required maxlength="20" value="${esc(d.name)}" placeholder="e.g. Penny" />
        </label>`;
    case 1:
      return `
        <h2>What's your monthly budget?</h2>
        <p class="hint">How much can you spend each month after savings?</p>
        <div class="money-input"><span>$</span><input name="budget" type="number" min="1" step="1" required value="${d.budget}" aria-label="Monthly budget" /></div>
        <div class="chips">
          ${[1000, 2000, 3000, 5000].map((v) => `<button type="button" class="chip" data-budget="${v}">$${v.toLocaleString()}</button>`).join('')}
        </div>`;
    case 2:
      return `
        <h2>Add a bank statement</h2>
        <p class="hint">Upload a CSV from your bank (for example in Bank of America: Activity &gt; Download &gt; Microsoft Excel). We'll sort your spending into categories. Your file stays on this device.</p>
        <label class="dropzone">
          <input type="file" id="statement" accept=".csv,text/csv" />
          <strong>${d.imported.length ? 'Choose another file' : 'Choose CSV file'}</strong>
          <small>Optional - you can skip this</small>
        </label>
        ${d.importMsg ? `<p class="import-msg${d.importError ? ' error' : ''}" role="status">${esc(d.importMsg)}</p>` : ''}`;
    default:
      return `
        <h2>Set your goals</h2>
        <p class="hint">Two quick questions. You can change them later in Profile &amp; Settings.</p>
        <p class="q">1. What do you want to spend less on?</p>
        <p class="hint">Each one gets a limit 20% smaller than usual. Going over it makes your buddy one step sadder.</p>
        <div class="chips">
          ${FOCUSABLE.map(
            (c) => `<label class="chip"><input type="checkbox" name="focus" value="${esc(c)}" ${d.focus.includes(c) ? 'checked' : ''} />${esc(c)}</label>`,
          ).join('')}
        </div>
        <p class="q">2. What's your main goal?</p>
        <p class="hint">We'll suggest a matching tip in Grow Your Money.</p>
        <div class="options">
          ${GOALS.map(
            (g) => `<label class="option"><input type="radio" name="goal" value="${esc(g)}" ${g === d.goal ? 'checked' : ''} />${esc(g)}</label>`,
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

export function renderOnboarding(app: HTMLElement, state: AppState, done: () => void, cancel: (() => void) | null): void {
  draft ??= newDraft(state);
  const d = draft;
  const rerender = () => renderOnboarding(app, state, done, cancel);

  app.innerHTML = `
    <main class="onboard card">
      <div class="onboard-head">
        ${brand()}
        ${cancel ? `<button type="button" class="icon" id="cancel" aria-label="Close">${LINE.close}</button>` : ''}
      </div>
      <ol class="steps">
        ${STEPS.map((s, i) => `<li class="${i < d.step ? 'done' : ''}${i === d.step ? ' current' : ''}"><span>${i + 1}</span>${s}</li>`).join('')}
      </ol>
      <form id="step-form">
        ${stepBody(d)}
        <div class="actions">
          ${d.step > 0 ? '<button type="button" class="secondary" id="back">Back</button>' : ''}
          <button type="submit">${d.step === STEPS.length - 1 ? "Let's go!" : d.step === 2 && !d.imported.length ? 'Skip' : 'Next'}</button>
        </div>
      </form>
    </main>`;

  const form = app.querySelector<HTMLFormElement>('#step-form')!;

  app.querySelector('#cancel')?.addEventListener('click', () => {
    draft = null;
    cancel?.();
  });
  app.querySelector('#back')?.addEventListener('click', () => {
    d.step--;
    rerender();
  });
  app.querySelectorAll<HTMLButtonElement>('[data-budget]').forEach((b) =>
    b.addEventListener('click', () => {
      form.querySelector<HTMLInputElement>('input[name="budget"]')!.value = b.dataset.budget!;
    }),
  );
  app.querySelector<HTMLInputElement>('#statement')?.addEventListener('change', async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      d.imported = await readStatementFile(file);
      const top = topCategory(d.imported);
      d.importMsg = `Imported ${d.imported.length} transactions.${top ? ` Outside of bills, you spend the most on ${top.category} (${formatMoney(top.total)}).` : ''}`;
      d.importError = false;
    } catch (err) {
      d.imported = [];
      d.importMsg = err instanceof Error ? err.message : 'Could not read that file.';
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
    } else if (d.step === 1) {
      d.budget = Math.max(1, Number(data.get('budget')) || 1);
    } else if (d.step === 2) {
      const top = topCategory(d.imported);
      if (top && d.focus.length === 0) d.focus = [top.category];
    } else {
      d.focus = data.getAll('focus').map(String).filter((c): c is Category => FOCUSABLE.includes(c as Category));
      const goal = String(data.get('goal'));
      d.goal = (GOALS as readonly string[]).includes(goal) ? (goal as Goal) : 'Save more money';

      state.profile = {
        name: d.name,
        character: d.character,
        budget: d.budget,
        limits: defaultLimits(d.budget, d.focus),
        focus: d.focus,
        goal: d.goal,
      };
      state.expenses = mergeExpenses(state.expenses, d.imported);
      draft = null;
      done();
      return;
    }
    d.step++;
    rerender();
  });
}
