// Mexican bank statements: Spanish headers, DD/MM/YYYY dates, and Mexican merchants.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { categorize, parseStatement } from '../src/statement';

test('ES-001 Mexican merchants are categorized', () => {
  const cases: [string, string][] = [
    ['OXXO COYOACAN', 'Groceries'],
    ['7-ELEVEN CDMX', 'Groceries'],
    ['WALMART SUPERCENTER', 'Shopping'],
    ['SORIANA HIPER', 'Groceries'],
    ['CHEDRAUI SELECTO', 'Groceries'],
    ['LA COMER', 'Groceries'],
    ['BODEGA AURRERA', 'Groceries'],
    ['MERCADO MEDELLIN', 'Groceries'],
    ['RAPPI MEXICO', 'Food & Dining'],
    ['DIDI FOOD', 'Food & Dining'],
    ['UBER EATS MX', 'Food & Dining'],
    ['TAQUERIA EL GUERO', 'Food & Dining'],
    ['POLLO FELIZ', 'Food & Dining'],
    ['CAFÉ CHIAPAS', 'Food & Dining'],
    ['FARMACIAS GUADALAJARA', 'Health'],
    ['FARMACIA DEL AHORRO', 'Health'],
    ['FARMACIAS BENAVIDES', 'Health'],
    ['TELCEL RECARGA', 'Bills'],
    ['AT&T MEXICO', 'Bills'],
    ['IZZI TELECOM', 'Bills'],
    ['TOTALPLAY', 'Bills'],
    ['CFE SUMINISTRADOR', 'Bills'],
    ['GAS NATURAL DEL NORTE', 'Bills'],
    ['PAGO DE RENTA', 'Bills'],
    ['COLEGIATURA UNAM', 'Bills'],
    ['NETFLIX.COM', 'Entertainment'],
    ['SPOTIFY', 'Entertainment'],
    ['CINEPOLIS', 'Entertainment'],
    ['CINEMEX', 'Entertainment'],
    ['LIVERPOOL INSURGENTES', 'Shopping'],
    ['AMAZON MEXICO', 'Shopping'],
    ['MERCADO LIBRE', 'Shopping'],
    ['COPPEL', 'Shopping'],
    ['ELEKTRA', 'Shopping'],
    ['GASOLINERA PEMEX', 'Transport'],
    ['METROBUS', 'Transport'],
    ['CABIFY', 'Transport'],
    ['UBER TRIP', 'Transport'],
    ['VOLARIS', 'Transport'],
    ['VIVAAEROBUS', 'Transport'],
    ['AEROMEXICO', 'Transport'],
  ];
  for (const [desc, cat] of cases) assert.equal(categorize(desc), cat, desc);
});

test('ES-002 Spanish headers with cargo and abono columns', () => {
  const csv = [
    'Fecha,Descripción,Cargo,Abono,Saldo',
    '25/03/2025,OXXO ROMA,85.50,,1000',
    '26/03/2025,NÓMINA EMPRESA,,5000.00,6000',
    '27/03/2025,TRASPASO A CUENTA,300.00,,5700',
    '28/03/2025,PAGO DE TARJETA,1200.00,,4500',
    '29/03/2025,TELCEL,199.00,,4301',
  ].join('\n');
  const { expenses, income } = parseStatement(csv);
  assert.equal(expenses.length, 2);
  assert.deepEqual(expenses.map((e) => [e.date, e.amount, e.category]), [
    ['2025-03-25', 85.5, 'Groceries'],
    ['2025-03-29', 199, 'Bills'],
  ]);
  assert.equal(income.length, 1);
  assert.equal(income[0].amount, 5000);
  assert.equal(income[0].date, '2025-03-26');
});

test('ES-003 Spanish headers with importe and negative numbers', () => {
  const csv = ['Fecha,Concepto,Importe', '15/01/2025,STARBUCKS REFORMA,-95.00', '16/01/2025,DEPOSITO NOMINA,8000.00', '17/01/2025,DEVOLUCION COMPRA,-50.00'].join('\n');
  const { expenses, income } = parseStatement(csv);
  assert.equal(expenses.length, 1);
  assert.equal(expenses[0].category, 'Food & Dining');
  assert.equal(expenses[0].date, '2025-01-15');
  assert.equal(income.length, 1);
});

test('ES-004 Dates: a first number above 12 is the day; otherwise month first', () => {
  const csv = (d: string) => `Fecha,Concepto,Monto\n${d},OXXO,-10.00`;
  assert.equal(parseStatement(csv('13/02/2025')).expenses[0].date, '2025-02-13');
  assert.equal(parseStatement(csv('02/03/2025')).expenses[0].date, '2025-02-03');
  assert.equal(parseStatement(csv('25-12-2024')).expenses[0].date, '2024-12-25');
  assert.equal(parseStatement(csv('05/ene/2025')).expenses[0].date, '2025-01-05');
});

test('ES-005 English categorization still works', () => {
  assert.equal(categorize('UBER EATS'), 'Food & Dining');
  assert.equal(categorize('SHELL OIL'), 'Transport');
  assert.equal(categorize('COMCAST'), 'Bills');
});
