// Logic tests for OinkCoin: statement import, moods, forecast math and the buddy's chat.
// Run with `npm test`. Each test has an ID (OC-xxx) that matches TestPlan.md.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { analyze, defaultLimits, localDateKey, MOOD_STEPS } from '../src/budget';
import { bankBalance, buddyPhrase, moneyTier, reply, SUGGESTIONS, type ChatContext } from '../src/chat';
import { forecast, futureValue, monthsToGoal, plan, LEVERS } from '../src/predict';
import { categorize, parseStatement } from '../src/statement';
import type { AppState, Expense, Profile } from '../src/types';

const MONTH = localDateKey().slice(0, 7);
const day1 = `${MONTH}-01`;
let n = 0;
const expense = (amount: number, category: Expense['category'], note: string, date = day1): Expense => ({ id: String(++n), amount, category, note, date });

const profileFor = (budget: number): Profile => ({
  name: 'Oink',
  character: 'pig',
  budget,
  limits: defaultLimits(budget),
  focus: [],
  goal: 'Save more money',
});

function ctxFor(budget: number, expenses: Expense[], bank: AppState['bank'] = null): ChatContext {
  const profile = profileFor(budget);
  const state = { expenses, income: [], bank } as unknown as AppState;
  const a = analyze(profile, expenses);
  return { profile, state, a, mood: a.mood };
}

// ------------------------------------------------------------ statement import

test('OC-001 CSV import: mock statement imports every spending row and skips payroll', () => {
  const csv = readFileSync(new URL('../mock-data/robert_october_2026.csv', import.meta.url), 'utf8');
  const { expenses, income } = parseStatement(csv);
  assert.equal(expenses.length, 57);
  assert.equal(income.length, 1);
  assert.equal(Math.round(expenses.reduce((s, e) => s + e.amount, 0) * 100) / 100, 3000);
});

test('OC-002 CSV import: merchants land in the right category', () => {
  assert.equal(categorize('STARBUCKS STORE #1234'), 'Food & Dining');
  assert.equal(categorize('UBER EATS'), 'Food & Dining');
  assert.equal(categorize('UBER TRIP SFO AIRPORT'), 'Transport');
  assert.equal(categorize('DELTA AIR LINES SFO-SJD'), 'Transport');
  assert.equal(categorize('NETFLIX.COM'), 'Entertainment');
  assert.equal(categorize('MARRIOTT CABO RESORT & SPA'), 'Other');
});

test('OC-003 CSV import: a file with no Date and Amount columns is rejected', () => {
  assert.throws(() => parseStatement('hello,world\n1,2'), /Date and Amount/);
});

// ------------------------------------------------------------ moods and budget

test('OC-010 Mood: wants spending moves the buddy through every mood', () => {
  const budget = 1000;
  const wantsLimit = analyze(profileFor(budget), []).wantsLimit;
  assert.ok(wantsLimit > 0);
  const moodAt = (ratio: number) => analyze(profileFor(budget), [expense(wantsLimit * ratio, 'Shopping', 'Amazon')]).mood;
  assert.equal(moodAt(0.1), 'happy');
  assert.equal(moodAt(0.6), 'okay');
  assert.equal(moodAt(0.9), 'sad');
  assert.equal(moodAt(1.3), 'angry');
  assert.equal(moodAt(2), 'dead');
  assert.deepEqual(MOOD_STEPS.map((s) => s.mood), ['happy', 'okay', 'sad', 'angry', 'dead']);
});

test('OC-011 Mood: needs over plan make the buddy sad at most, never angry or fainted', () => {
  const a = analyze(profileFor(1000), [expense(5000, 'Bills', 'Rent')]);
  assert.ok(['happy', 'okay', 'sad'].includes(a.mood), `got ${a.mood}`);
  assert.equal(a.mood, 'sad');
});

test('OC-012 Budget: spending exactly the budget leaves a clean $0.00 (Full Report showed -$0.00)', () => {
  const a = analyze(profileFor(0.3), [expense(0.1, 'Bills', 'a'), expense(0.2, 'Bills', 'b')]);
  assert.ok(Object.is(a.remaining, 0), `remaining was ${a.remaining}`);
});

// ------------------------------------------------------------ chat bubble

test('OC-020 Bubble: every money situation has phrases with no unfilled placeholders', () => {
  const situations: [string, ChatContext][] = [
    ['fresh', ctxFor(2000, [])],
    ['comfy', ctxFor(2000, [expense(200, 'Groceries', 'Whole Foods')])],
    ['steady', ctxFor(2000, [expense(1200, 'Bills', 'Rent')])],
    ['tight', ctxFor(2000, [expense(1700, 'Bills', 'Rent')])],
    ['over', ctxFor(2000, [expense(2500, 'Bills', 'Rent')])],
  ];
  for (const [tier, ctx] of situations) {
    assert.equal(moneyTier(ctx.a, ctx.profile.budget), tier);
    for (let i = 0; i < 60; i++) {
      const phrase = buddyPhrase(ctx);
      assert.ok(phrase.length > 5, `${tier}: empty phrase`);
      assert.ok(!/[{}]|undefined|NaN/.test(phrase), `${tier}: bad phrase "${phrase}"`);
    }
  }
});

test('OC-021 Bubble: spending exactly the budget is not "over by $0.00"', () => {
  const ctx = ctxFor(0.3, [expense(0.1, 'Bills', 'a'), expense(0.2, 'Bills', 'b')]);
  assert.notEqual(moneyTier(ctx.a, ctx.profile.budget), 'over');
});

// ------------------------------------------------------------ chat answers

test('OC-030 Chat: balance without a linked bank explains why and shows the budget left', () => {
  const answer = reply('What is my balance?', ctxFor(2000, [expense(500, 'Groceries', 'Safeway')]));
  assert.match(answer, /No bank is linked/);
  assert.match(answer, /\$1,500\.00 left/);
});

test('OC-031 Chat: balance adds up checking and savings only', () => {
  const bank = {
    syncedAt: 0,
    accounts: [
      { name: 'Checking', mask: '0000', type: 'checking', balance: 1234.5 },
      { name: 'Card', mask: '1111', type: 'credit card', balance: 300 },
    ],
  };
  assert.equal(bankBalance({ bank } as unknown as AppState), 1234.5);
  assert.match(reply('what is my balance', ctxFor(2000, [], bank)), /\$1,234\.50/);
});

test('OC-032 Chat: over budget says how far over and never "-$0.00"', () => {
  const answer = reply('how much is left', ctxFor(1000, [expense(1200, 'Bills', 'Rent')]));
  assert.match(answer, /\$200\.00 over/);
  const exact = reply('how much is left', ctxFor(0.3, [expense(0.1, 'Bills', 'a'), expense(0.2, 'Bills', 'b')]));
  assert.ok(!/-\$0\.00/.test(exact), exact);
});

test('OC-033 Chat: "how much did I spend on coffee" answers with coffee, not all of Food & Dining', () => {
  const ctx = ctxFor(2000, [expense(5, 'Food & Dining', 'STARBUCKS'), expense(6, 'Food & Dining', 'BLUE BOTTLE COFFEE'), expense(60, 'Food & Dining', 'THE GRILL')]);
  const answer = reply('how much did I spend on coffee', ctx);
  assert.match(answer, /Coffee & boba: \$11 across 2 purchases/);
});

test('OC-034 Chat: what-if on coffee returns monthly, yearly and 5 year numbers', () => {
  const ctx = ctxFor(2000, [expense(100, 'Food & Dining', 'STARBUCKS')]);
  const answer = reply('what if I cut coffee in half', ctx);
  assert.match(answer, /Cutting Coffee & boba by 50%/);
  assert.match(answer, /a month/);
  assert.match(answer, /5 years/);
});

test('OC-035 Chat: unrelated questions get the fallback, not a category answer', () => {
  assert.match(reply('who won the game', ctxFor(2000, [])), /over my snout|did not catch|only know about your money/);
});

test('OC-036 Chat: roast, joke, help and greeting all answer', () => {
  const ctx = ctxFor(2000, [expense(300, 'Shopping', 'Amazon')]);
  for (const q of ['roast me', 'tell me a joke', 'help', 'hello']) assert.ok(reply(q, ctx).length > 10, q);
});

test('OC-037 Chat: suggestion chips each get a real answer', () => {
  const ctx = ctxFor(2000, [expense(300, 'Shopping', 'Amazon'), expense(40, 'Food & Dining', 'Starbucks')]);
  for (const q of SUGGESTIONS) {
    const answer = reply(q, ctx);
    assert.ok(!/did not catch|over my snout/.test(answer), `"${q}" fell through: ${answer}`);
  }
});

test('OC-038 Chat: empty and very long input do not break it', () => {
  const ctx = ctxFor(2000, []);
  assert.ok(reply('', ctx).length > 0);
  assert.ok(reply('a'.repeat(5000), ctx).length > 0);
});

// ------------------------------------------------------------ forecast math

test('OC-040 Forecast: trips are counted as spent, not scaled up for the rest of the month', () => {
  const profile = profileFor(3000);
  const expenses = [expense(1000, 'Other', 'MARRIOTT CABO RESORT'), expense(300, 'Shopping', 'Amazon')];
  const state = { expenses, income: [] };
  const f = forecast(state, profile, new Date(`${MONTH}-10T12:00:00`));
  assert.equal(f.byBucket.trips, 1000);
  assert.ok(f.byBucket.shopping > 300, 'shopping should scale with the pace');
  assert.ok(f.projected < 1000 + 300 * (31 / 10) + 1, 'projection must not scale the trip');
});

test('OC-041 Forecast: spending exactly the budget leaves $0, not a tiny negative', () => {
  const profile = profileFor(0.3);
  const f = forecast({ expenses: [expense(0.1, 'Bills', 'a'), expense(0.2, 'Bills', 'b')], income: [] }, profile);
  assert.equal(f.remaining, 0);
  assert.equal(f.safePerDay, 0);
});

test('OC-042 Forecast: safe per day divides what is left over the days remaining', () => {
  const profile = profileFor(3100);
  const now = new Date(`${MONTH}-16T12:00:00`);
  const f = forecast({ expenses: [expense(1000, 'Bills', 'Rent')], income: [] }, profile, now);
  assert.equal(f.remaining, 2100);
  assert.equal(Math.round(f.safePerDay * 100) / 100, Math.round((2100 / (f.days - 16 + 1)) * 100) / 100);
});

test('OC-043 Forecast: income this month is totalled', () => {
  const income = [{ id: 'i1', amount: 4200, note: 'Payroll', date: day1 }];
  const f = forecast({ expenses: [], income }, profileFor(3000));
  assert.equal(f.income, 4200);
});

test('OC-044 What-if: cuts save the share of each habit and 0% saves nothing', () => {
  const f = forecast({ expenses: [expense(200, 'Shopping', 'Amazon')], income: [] }, profileFor(3000), new Date(`${MONTH}-10T12:00:00`));
  const none = plan(f, {});
  assert.equal(none.monthly, 0);
  const half = plan(f, { shopping: 50 });
  assert.equal(Math.round(half.monthly * 100) / 100, Math.round(f.byBucket.shopping * 0.5 * 100) / 100);
  assert.ok(half.thisMonth > 0 && half.thisMonth < half.monthly, 'part of the month is already spent');
  assert.ok(LEVERS.length >= 5);
});

test('OC-045 Savings math: compound interest and goal date', () => {
  assert.equal(futureValue(100, 0, 12), 1200);
  const withInterest = futureValue(100, 0.04, 12);
  assert.ok(withInterest > 1200 && withInterest < 1230, String(withInterest));
  assert.equal(monthsToGoal(1000, 100, 0), 10);
  assert.equal(monthsToGoal(1000, 0, 0.04), null);
  assert.equal(monthsToGoal(0, 100, 0.04), 0);
});
