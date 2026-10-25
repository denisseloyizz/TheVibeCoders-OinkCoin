import { t } from './i18n';
import type { Category, Expense, Income } from './types';

export const MAX_STATEMENT_BYTES = 5 * 1024 * 1024;

// Order matters: earlier rules win (e.g. "Uber Eats" is food, not transport).
const RULES: [Category, RegExp][] = [
  ['Groceries', /grocery|whole ?foods|trader joe|safeway|kroger|aldi|publix|wegmans|sprouts|h-e-b|\bheb\b|food lion|supermarket|oxxo|7[- ]?eleven|soriana|chedraui|la comer|city market|bodega aurrera|aurrera|superama|\bsuper(mercado)?\b|mercado(?! ?(libre|pago))|tianguis|abarrotes|despensa/i],
  ['Food & Dining', /restaurant|cafe|coffee|starbucks|dunkin|mcdonald|chipotle|taco|pizza|burger|doordash|uber ?eats|grubhub|subway|kitchen|grill|diner|wendy|chick-fil|panera|sushi|rappi|didi ?food|taquer|pollo|restaurante|cafeter|fonda|antojitos|panader|pizzer|helader|carls? jr|domino|kfc|burger king|vips\b|comida|torta|marisc|cantina/i],
  // Utilities that would otherwise look like transport ("gas") or shopping.
  ['Bills', /gas natural|naturgy|gas lp|\bcfe\b|telcel|izzi|totalplay|telmex|megacable|colegiatura|predial|sacmex/i],
  ['Transport', /uber|lyft|shell|chevron|exxon|mobil|\bbp\b|\bgas\b|fuel|parking|metro|transit|toll|airline|delta|united|southwest|amtrak|gasolinera|gasolina|pemex|oxxo ?gas|metrobus|\bcabify\b|\bdidi\b|indrive|volaris|viva ?aerobus|aeromexico|\bado\b|autobus|caseta|estacionamiento|peaje|tren ligero|\bsuburbano\b/i],
  ['Entertainment', /netflix|spotify|hulu|disney|hbo|cinema|theat(er|re)|\bamc\b|steam|playstation|xbox|nintendo|ticketmaster|concert|youtube|twitch|apple\.com\/bill|cinepolis|cinemex|\bcine\b|teatro|concierto|boletos|disney ?\+|prime video|hbo max/i],
  ['Bills', /rent|mortgage|electric|utilit|water|internet|comcast|xfinity|verizon|at&t|t-mobile|insurance|geico|state farm|progressive|loan|renta|hipoteca|prestamo|seguro|\bluz\b|\bagua\b|recibo/i],
  ['Health', /pharmacy|\bcvs\b|walgreens|doctor|clinic|dental|hospital|medical|\bgym\b|fitness|farmacia|farmacias? guadalajara|farmacia del ahorro|benavides|similares|consultorio|dentista|laboratorio|clinica|hospital|medic|gimnasio|smart ?fit/i],
  ['Shopping', /amazon|amzn|target|walmart|best buy|nike|zara|h&m|shein|etsy|ebay|apple store|sephora|ulta|old navy|\bgap\b|tj ?maxx|marshalls|nordstrom|macy|costco|ikea|store|shop|liverpool|coppel|elektra|mercado ?libre|mercado ?pago|amazon m[eé]x|palacio de hierro|sears|sanborns|tienda|zapater|ropa|aliexpress|temu/i],
];

const SKIP = /payroll|direct dep|deposit|transfer|payment.*thank|online payment|zelle from|refund|nomina|deposito|abono|traspaso|devolucion|pago de tarjeta|pago tarjeta/i;
// Money in that counts as income. Transfers between your own accounts and refunds don't.
const INCOME = /payroll|direct dep|salary|paycheck|deposit|zelle from|venmo|cash app|interest paid|dividend|nomina|sueldo|deposito|intereses|rendimientos/i;
const NOT_INCOME = /transfer|refund|reversal|payment.*thank|traspaso|devolucion|reembolso|pago de tarjeta|pago tarjeta/i;

/** Lowercase text without accents, so "Nómina" and "nomina" match the same rule. */
const plain = (s: string): string => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export interface Statement {
  expenses: Expense[];
  income: Income[];
}

export function categorize(description: string): Category {
  const text = plain(description);
  return RULES.find(([, re]) => re.test(text))?.[0] ?? 'Other';
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((cell) => cell.trim()));
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function parseDate(raw: string): string | null {
  const s = raw.trim();
  const pad = (n: number) => String(n).padStart(2, '0');
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad(+m[2])}-${pad(+m[3])}`;
  m = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})(?!\d)/);
  if (m) {
    const year = m[3].length === 2 ? 2000 + +m[3] : +m[3];
    // US order (month first) unless the first number cannot be a month, as in Mexican DD/MM/YYYY dates.
    if (+m[1] > 12) return `${year}-${pad(+m[2])}-${pad(+m[1])}`;
    return `${year}-${pad(+m[1])}-${pad(+m[2])}`;
  }
  // 05/ene/2025 or 05-ene-25 (Spanish or English month names).
  m = plain(s.toLowerCase()).match(/^(\d{1,2})[\s/.-]+([a-z]{3})[a-z]*\.?[\s/.-]+(\d{2}|\d{4})(?!\d)/);
  if (m) {
    const month = MONTHS.indexOf(m[2]) % 12;
    if (month >= 0 && MONTHS.includes(m[2])) {
      const year = m[3].length === 2 ? 2000 + +m[3] : +m[3];
      return `${year}-${pad(month + 1)}-${pad(+m[1])}`;
    }
  }
  return null;
}

function parseAmount(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  const negative = /^\(.*\)$/.test(s) || s.startsWith('-');
  const n = Number(s.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n)) return null;
  return negative ? -n : n;
}

export function parseStatement(text: string): Statement {
  const rows = parseCsv(text);
  const headerIdx = rows.findIndex(
    (r) => r.some((c) => /date|fecha/i.test(c)) && r.some((c) => /amount|debit|withdrawal|importe|monto|cargo|retiro/i.test(plain(c))),
  );
  if (headerIdx < 0) throw new Error(t("Couldn't find Date and Amount columns in this file."));

  const header = rows[headerIdx].map((h) => plain(h.trim().toLowerCase()));
  const col = (re: RegExp) => header.findIndex((h) => re.test(h));
  const dateCol = col(/date|fecha/);
  const descCol = col(/description|payee|merchant|name|memo|details|descripcion|concepto|detalle|nombre|referencia/);
  const debitCol = col(/debit|withdrawal|cargo|retiro/);
  const creditCol = col(/credit|deposit|abono|deposito/);
  const amountCol = col(/amount|importe|monto/);

  const data = rows.slice(headerIdx + 1);
  const amounts = data.map((r) => (amountCol >= 0 ? parseAmount(r[amountCol] ?? '') : null));
  // Most banks export spending as negative numbers; if none are negative, treat all as spending.
  const negativesAreSpending = amounts.some((a) => a !== null && a < 0);

  const expenses: Expense[] = [];
  const income: Income[] = [];
  data.forEach((r, i) => {
    const date = parseDate(r[dateCol] ?? '');
    const description = (descCol >= 0 ? (r[descCol] ?? '') : '').trim();
    if (!date) return;

    // Money in: a credit column, or a positive amount when spending is negative.
    const a = amounts[i];
    const received = creditCol >= 0 && creditCol !== debitCol ? parseAmount(r[creditCol] ?? '') : negativesAreSpending && a !== null && a > 0 ? a : null;
    if (received && received > 0) {
      if (INCOME.test(plain(description)) && !NOT_INCOME.test(plain(description))) {
        income.push({ id: crypto.randomUUID(), amount: Math.round(received * 100) / 100, note: description.slice(0, 60), date });
      }
      return;
    }
    if (SKIP.test(plain(description))) return;

    let spend: number | null = null;
    if (debitCol >= 0) {
      const d = parseAmount(r[debitCol] ?? '');
      spend = d ? Math.abs(d) : null;
    } else if (a !== null) {
      spend = negativesAreSpending ? (a < 0 ? -a : null) : a;
    }
    if (!spend || spend <= 0) return;

    expenses.push({
      id: crypto.randomUUID(),
      amount: Math.round(spend * 100) / 100,
      category: categorize(description),
      note: description.slice(0, 60),
      date,
    });
  });

  if (expenses.length === 0 && income.length === 0) throw new Error(t('No transactions found in this file.'));
  return { expenses, income };
}

export function mergeIncome(existing: Income[], incoming: Income[]): Income[] {
  const key = (i: Income) => `${i.date}|${i.amount}|${i.note}`;
  const seen = new Set(existing.map(key));
  return [...existing, ...incoming.filter((i) => !seen.has(key(i)))];
}

export function mergeExpenses(existing: Expense[], incoming: Expense[]): Expense[] {
  const key = (e: Expense) => `${e.date}|${e.amount}|${e.note}`;
  const seen = new Set(existing.map(key));
  return [...existing, ...incoming.filter((e) => !seen.has(key(e)))];
}

export function readStatementFile(file: File): Promise<Statement> {
  if (file.size > MAX_STATEMENT_BYTES) return Promise.reject(new Error(t('File is too large (max 5 MB).')));
  return file.text().then(parseStatement);
}
