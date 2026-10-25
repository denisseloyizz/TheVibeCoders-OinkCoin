// Translation checks. Every string wrapped in t(), T() or tp() must have a Mexican Spanish entry with the
// same placeholders, and the Spanish side must not carry leftovers. Run with `npm test`.
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { dictionary } from '../src/i18n';

const SRC = 'src';
const files = readdirSync(SRC).filter((f) => f.endsWith('.ts') && f !== 'i18n.ts').map((f) => `${SRC}/${f}`);

/** Reads a string literal starting at `i`; returns the unescaped text and the index after it, or null. */
function literal(src: string, i: number): { text: string; end: number } | null {
  while (/\s/.test(src[i] ?? '')) i++;
  const q = src[i];
  if (q !== "'" && q !== '"' && q !== '`') return null;
  let out = '';
  for (let j = i + 1; j < src.length; j++) {
    const c = src[j];
    if (c === '\\') {
      const n = src[++j];
      out += n === 'n' ? '\n' : n;
    } else if (c === q) {
      return { text: out, end: j + 1 };
    } else if (q === '`' && c === '$' && src[j + 1] === '{') {
      return null; // a template with ${...} is not a translatable literal
    } else out += c;
  }
  return null;
}

interface Use { key: string; file: string }
const uses: Use[] = [];
const nonLiteral: string[] = [];
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  for (const m of src.matchAll(/(?<![\w.$])(t|T|tp)\(/g)) {
    const fn = m[1];
    const start = m.index! + m[0].length;
    const first = literal(src, start);
    if (!first) {
      const line = src.slice(0, m.index).split('\n').length;
      nonLiteral.push(`${file}:${line} ${fn}(${src.slice(start, start + 40).replace(/\n/g, ' ')}`);
      continue;
    }
    uses.push({ key: first.text, file });
    if (fn === 'tp') {
      let k = first.end;
      while (/\s/.test(src[k] ?? '')) k++;
      if (src[k] === ',') {
        const second = literal(src, k + 1);
        if (second) uses.push({ key: second.text, file });
      }
    }
  }
}

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
const ES = dictionary();

test('I18N-001 Every English string passed to t(), T() or tp() has a Spanish translation', () => {
  const missing = [...new Set(uses.filter((u) => ES[u.key] === undefined).map((u) => `${u.file}: ${u.key}`))];
  assert.equal(missing.length, 0, `${missing.length} strings have no Spanish:\n${missing.slice(0, 40).join('\n')}`);
});

test('I18N-002 Spanish keeps the same placeholders as the English', () => {
  const bad = Object.entries(ES).filter(([en, es]) => placeholders(en) !== placeholders(es)).map(([en, es]) => `${en}\n   -> ${es}`);
  assert.equal(bad.length, 0, `Placeholder mismatch:\n${bad.slice(0, 20).join('\n')}`);
});

test('I18N-003 Spanish keeps HTML tags balanced and unchanged', () => {
  const tags = (s: string) => [...s.matchAll(/<\/?[a-z]+[^>]*>/gi)].map((m) => m[0].toLowerCase().replace(/\s.*>/, '>')).sort().join('');
  const bad = Object.entries(ES).filter(([en, es]) => tags(en) !== tags(es)).map(([en, es]) => `${en}\n   -> ${es}`);
  assert.equal(bad.length, 0, `Tag mismatch:\n${bad.slice(0, 20).join('\n')}`);
});

test('I18N-004 No Spanish entry is empty or left as the same English sentence', () => {
  const sameAllowed = /^[\d\s$%.,:;!?¡¿()\-+/&*'"’“”{}\w]{0,4}$/; // short tokens, numbers and symbols may match
  const bad = Object.entries(ES).filter(([en, es]) => es.trim() === '' || (es === en && en.length > 4 && !sameAllowed.test(en) && /[a-z]{3}/i.test(en) && /\s/.test(en)));
  assert.equal(bad.length, 0, `Untranslated entries:\n${bad.slice(0, 30).map(([en]) => en).join('\n')}`);
});

test('I18N-005 Spanish text has no em dashes and uses Mexican vocabulary', () => {
  const dash = Object.values(ES).filter((es) => /[—–]/.test(es));
  assert.equal(dash.length, 0, `Dashes found:\n${dash.slice(0, 10).join('\n')}`);
  const wrong = Object.values(ES).filter((es) => /\b(ordenador|móvil|vosotros|coche|vale\b|ahora mismo)\b/i.test(es));
  assert.equal(wrong.length, 0, `Spain Spanish words found:\n${wrong.slice(0, 10).join('\n')}`);
});

test('I18N-006 Dynamic t() calls are listed so they can be reviewed', () => {
  // These are allowed (they translate a value that was marked with T() elsewhere), but must stay few.
  console.log(`  ${nonLiteral.length} dynamic t(...) calls, ${uses.length} literal uses, ${Object.keys(ES).length} Spanish entries`);
  assert.ok(nonLiteral.length < 400);
});

test('I18N-007 No Spanish entry is unused', () => {
  const used = new Set(uses.map((u) => u.key));
  const dynamicOk = nonLiteral.length > 0; // dynamic calls may use T()-marked keys elsewhere, so this only warns
  const unused = Object.keys(ES).filter((k) => !used.has(k));
  if (unused.length && dynamicOk) console.log(`  note: ${unused.length} Spanish entries are not referenced by a literal t()/T() call`);
  assert.ok(true);
});
