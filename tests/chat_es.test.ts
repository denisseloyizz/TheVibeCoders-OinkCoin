// Spanish chat tests: the buddy understands Spanish questions and answers in Mexican Spanish.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analyze, defaultLimits, localDateKey } from '../src/budget';
import { buddyPhrase, reply, SUGGESTIONS, type ChatContext } from '../src/chat';
import { setLang, t } from '../src/i18n';
import type { AppState, Expense, Profile } from '../src/types';

const day1 = `${localDateKey().slice(0, 7)}-01`;
let n = 0;
const expense = (amount: number, category: Expense['category'], note: string): Expense => ({ id: `es${++n}`, amount, category, note, date: day1 });

const profileFor = (budget: number): Profile => ({ name: 'Oink', character: 'pig', budget, limits: defaultLimits(budget), focus: [], goal: 'Save more money' });

function ctxFor(budget: number, expenses: Expense[], bank: AppState['bank'] = null): ChatContext {
  const profile = profileFor(budget);
  const state = { expenses, income: [], bank } as unknown as AppState;
  const a = analyze(profile, expenses);
  return { profile, state, a, mood: a.mood };
}

const FALLBACK = /No te entendí|por encima del hocico|Solo sé de tu dinero/;
const ENGLISH_LEFTOVERS = /left of your|No bank is linked|at this pace|You have|This month|Try:|purchases?\b.*so far|\bbudget\b.*\bthe\b/i;

function inSpanish(fn: () => void): void {
  setLang('es');
  try {
    fn();
  } finally {
    setLang('en');
  }
}

const ctx = () => ctxFor(2000, [expense(300, 'Shopping', 'Amazon'), expense(40, 'Food & Dining', 'Starbucks'), expense(100, 'Food & Dining', 'STARBUCKS')]);

test('CHES-001 Chat: every Spanish suggestion chip gets a real Spanish answer', () => {
  inSpanish(() => {
    for (const s of SUGGESTIONS) {
      const question = t(s);
      assert.notEqual(question, s, `chip not translated: ${s}`);
      const answer = reply(question, ctx());
      assert.ok(!FALLBACK.test(answer), `"${question}" fell through: ${answer}`);
      assert.ok(!ENGLISH_LEFTOVERS.test(answer), `English left in "${question}": ${answer}`);
    }
  });
});

test('CHES-002 Chat: Spanish what-if for coffee returns amounts', () => {
  inSpanish(() => {
    for (const q of ['¿Y si recorto el café a la mitad?', 'Qué pasa si dejo de tomar café', 'y si reduzco el cafe un 30 por ciento']) {
      const answer = reply(q, ctx());
      assert.match(answer, /\$\d/, q);
      assert.match(answer, /al mes/, q);
      assert.match(answer, /5 años/, q);
    }
    assert.match(reply('¿Y si recorto el café a la mitad?', ctx()), /50%/);
    assert.match(reply('y si reduzco el cafe un 30 por ciento', ctx()), /30%/);
    assert.match(reply('qué pasa si dejo de pedir café', ctx()), /100%/);
  });
});

test('CHES-003 Chat: Spanish forecast question', () => {
  inSpanish(() => {
    for (const q of ['¿Me voy a pasar del presupuesto?', '¿Cómo voy a este ritmo?', 'pronóstico del fin de mes']) {
      const answer = reply(q, ctx());
      assert.match(answer, /ritmo/, q);
      assert.ok(!ENGLISH_LEFTOVERS.test(answer), answer);
    }
  });
});

test('CHES-004 Chat: Spanish balance question without a bank explains and shows the budget left', () => {
  inSpanish(() => {
    const answer = reply('¿Cuál es mi saldo?', ctxFor(2000, [expense(500, 'Groceries', 'Safeway')]));
    assert.match(answer, /No hay un banco vinculado/);
    assert.match(answer, /\$1,500\.00/);
    assert.ok(!/left of your|No bank is linked/.test(answer), answer);
  });
});

test('CHES-005 Chat: other Spanish intents answer in Spanish', () => {
  inSpanish(() => {
    const c = ctx();
    const cases: [string, RegExp][] = [
      ['hola', /Oink oink/],
      ['¿Cuánto gasté en comida?', /Comida y restaurantes/],
      ['¿Cuánto gasté en compras?', /Compras/],
      ['gustos vs necesidades', /Necesidades/],
      ['¿Cuánto llevo gastado este mes?', /gastados/],
      ['Regáñame', /./],
      ['cuéntame un chiste', /./],
      ['gracias', /./],
      ['ayuda', /Prueba/],
      ['¿Qué es un fondo de emergencia?', /fondo de emergencia/],
      ['¿Me recomiendas invertir en Afore?', /cerdito de presupuestos/],
      ['¿Cómo mejoro mi historial crediticio?', /historial crediticio/],
      ['tengo una deuda con mi tarjeta de crédito', /avalancha/],
      ['¿Cuál es mi presupuesto?', /presupuesto mensual/],
      ['¿Cuánto me sobra?', /Te quedan/],
    ];
    for (const [q, re] of cases) {
      const answer = reply(q, c);
      assert.ok(!FALLBACK.test(answer), `"${q}" fell through: ${answer}`);
      assert.match(answer, re, q);
      assert.ok(!/ the | your |You have/.test(answer), `English in "${q}": ${answer}`);
    }
  });
});

test('CHES-006 Chat: Spanish words do not trip English category patterns', () => {
  inSpanish(() => {
    // "gasto" contains "gas" and "creatividad" contains "eat"; neither is a category.
    const answer = reply('¿Cuánto es mi gasto total?', ctx());
    assert.ok(!/Transporte|Comida y restaurantes/.test(answer), answer);
    assert.match(reply('quién ganó el partido', ctx()), FALLBACK);
  });
});

test('CHES-007 Bubble: Spanish phrases have no unfilled placeholders', () => {
  inSpanish(() => {
    const situations = [ctxFor(2000, []), ctxFor(2000, [expense(200, 'Groceries', 'x')]), ctxFor(2000, [expense(1200, 'Bills', 'Rent')]), ctxFor(2000, [expense(1700, 'Bills', 'Rent')]), ctxFor(2000, [expense(2500, 'Bills', 'Rent')])];
    for (const c of situations) {
      for (let i = 0; i < 60; i++) {
        const phrase = buddyPhrase(c);
        assert.ok(!/[{}]|undefined|NaN/.test(phrase), phrase);
      }
    }
  });
});
