import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LINE } from './icons';
import { brand } from './logo';
import { supabase } from './supabase';
import { esc } from './util';

// With Supabase configured, accounts live on the server. Without it they fall back to
// this device only, which guards a shared device but is not real security.

const ACCOUNT_KEY = 'oinkcoin-account-v1';
const SESSION_KEY = 'oinkcoin-session-v1';
const ITERATIONS = 150_000;
const MIN_PASSWORD = 8;
const PRIVACY_LINK = '<a href="privacy.html" target="_blank" rel="noopener">Privacy Policy</a>';

export type Scope = 'balances' | 'transactions' | 'sync' | 'alerts';

export const SCOPES: { id: Scope; label: string; detail: string; required: boolean }[] = [
  { id: 'balances', label: 'View account balances', detail: 'See how much is in your checking and savings accounts.', required: true },
  { id: 'transactions', label: 'View transaction history', detail: 'Read your purchases so your buddy can sort them into categories.', required: true },
  { id: 'sync', label: 'Refresh automatically', detail: 'Check for new transactions once a day so your budget stays current.', required: false },
  { id: 'alerts', label: 'Spending alerts', detail: 'Notify you when you are close to a category limit.', required: false },
];

export interface Consent {
  scopes: Scope[];
  agreedAt: number;
}

export interface User {
  email: string;
  consent: Consent | null;
}

interface LocalAccount extends User {
  salt: string;
  hash: string;
}

let user: User | null = null;
export const currentUser = (): User | null => user;

function loadLocal(): LocalAccount | null {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount) : null;
  } catch {
    return null;
  }
}

const saveLocal = (account: LocalAccount) => localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));

const fromSupabase = (u: SupabaseUser | undefined): User | null =>
  u?.email ? { email: u.email, consent: (u.user_metadata?.consent as Consent | undefined) ?? null } : null;

export async function initAuth(onSignedOut: () => void): Promise<void> {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    user = fromSupabase(data.session?.user);
    supabase.auth.onAuthStateChange((event, session) => {
      user = fromSupabase(session?.user);
      if (event === 'SIGNED_OUT') onSignedOut();
    });
    return;
  }
  const local = loadLocal();
  user = local && localStorage.getItem(SESSION_KEY) === local.email ? { email: local.email, consent: local.consent } : null;
}

export async function saveConsent(consent: Consent): Promise<void> {
  if (supabase) {
    const { error } = await supabase.auth.updateUser({ data: { consent } });
    if (error) throw new Error(error.message);
  } else {
    const local = loadLocal();
    if (local) saveLocal({ ...local, consent });
  }
  if (user) user = { ...user, consent };
}

export async function signOut(): Promise<void> {
  if (supabase) await supabase.auth.signOut();
  localStorage.removeItem(SESSION_KEY);
  user = null;
}

/** Removes the device-only account. Server accounts are deleted by the bank function instead. */
export function deleteLocalAccount(): void {
  localStorage.removeItem(ACCOUNT_KEY);
  localStorage.removeItem(SESSION_KEY);
  user = null;
}

const toHex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const fromHex = (hex: string) => Uint8Array.from(hex.match(/../g)!, (h) => parseInt(h, 16));

async function hashPassword(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS }, key, 256);
  return toHex(bits);
}

/** Returns false when the account was created but the email still needs confirming. */
async function signUp(email: string, password: string): Promise<boolean> {
  if (supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Bring the confirmation link back to wherever the app is running (dev server or Pages).
      options: { emailRedirectTo: location.origin + location.pathname },
    });
    if (error) throw new Error(error.message);
    user = fromSupabase(data.session?.user);
    return !!data.session;
  }
  const existing = loadLocal();
  if (existing && existing.email !== email && !confirm('Another account is saved on this device. Replace it?')) {
    throw new Error('');
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  saveLocal({ email, salt: toHex(salt.buffer), hash: await hashPassword(password, salt), consent: null });
  localStorage.setItem(SESSION_KEY, email);
  user = { email, consent: null };
  return true;
}

async function logIn(email: string, password: string): Promise<void> {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.code === 'email_not_confirmed' ? 'Confirm your email first, then log in.' : 'Email or password is incorrect.');
    user = fromSupabase(data.user);
    return;
  }
  const local = loadLocal();
  if (!local || local.email !== email || (await hashPassword(password, fromHex(local.salt))) !== local.hash) {
    throw new Error('Email or password is incorrect.');
  }
  localStorage.setItem(SESSION_KEY, email);
  user = { email, consent: local.consent };
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

let mode: 'signup' | 'login' | null = null;
let authMsg = '';
let authError = false;

export function renderAuth(app: HTMLElement, done: () => void): void {
  const remembered = supabase ? null : loadLocal();
  mode ??= supabase || remembered ? 'login' : 'signup';
  const signup = mode === 'signup';
  const rerender = () => renderAuth(app, done);

  app.innerHTML = `
    <main class="onboard card auth">
      <div class="onboard-head">${brand()}</div>
      <h2>${signup ? 'Create your account' : 'Welcome back'}</h2>
      <p class="hint">${signup ? 'Sign up to start budgeting with your buddy.' : 'Log in to check on your buddy.'}</p>
      <form id="auth-form" novalidate>
        <label class="field">Email
          <input name="email" type="email" autocomplete="email" required value="${esc(signup ? '' : (remembered?.email ?? ''))}" placeholder="you@example.com" />
        </label>
        <label class="field">Password
          <input name="password" type="password" autocomplete="${signup ? 'new-password' : 'current-password'}" required minlength="${MIN_PASSWORD}" />
        </label>
        ${
          signup
            ? `<label class="field">Confirm password
                <input name="confirm" type="password" autocomplete="new-password" required minlength="${MIN_PASSWORD}" />
              </label>`
            : ''
        }
        ${authMsg ? `<p class="import-msg${authError ? ' error' : ''}" role="${authError ? 'alert' : 'status'}">${esc(authMsg)}</p>` : ''}
        <div class="actions"><button type="submit">${signup ? 'Sign up' : 'Log in'}</button></div>
      </form>
      <p class="auth-switch">
        ${signup ? 'Already have an account?' : 'New here?'}
        <button type="button" class="link" id="switch">${signup ? 'Log in' : 'Create an account'}</button>
      </p>
      ${signup ? `<p class="auth-switch legal">By signing up you agree to our ${PRIVACY_LINK}.</p>` : ''}
    </main>`;

  app.querySelector('#switch')!.addEventListener('click', () => {
    mode = signup ? 'login' : 'signup';
    authMsg = '';
    rerender();
  });

  const form = app.querySelector<HTMLFormElement>('#auth-form')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = normalizeEmail(String(data.get('email')));
    const password = String(data.get('password'));
    const show = (msg: string, error = true) => {
      authMsg = msg;
      authError = error;
      rerender();
    };

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return show('Enter a valid email address.');
    if (password.length < MIN_PASSWORD) return show(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (signup && password !== String(data.get('confirm'))) return show('Passwords do not match.');

    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
    try {
      if (signup && !(await signUp(email, password))) {
        mode = 'login';
        return show('Check your inbox to confirm your email, then log in.', false);
      }
      if (!signup) await logIn(email, password);
    } catch (err) {
      return show(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
    mode = null;
    authMsg = '';
    done();
  });
}

export function renderConsent(app: HTMLElement, current: User, done: () => void, cancel: (() => void) | null): void {
  const granted = new Set(current.consent?.scopes ?? SCOPES.map((s) => s.id));

  app.innerHTML = `
    <main class="onboard card consent">
      <div class="onboard-head">
        ${brand()}
        ${cancel ? `<button type="button" class="icon" id="cancel" aria-label="Close">${LINE.close}</button>` : ''}
      </div>
      <h2>Connect your bank</h2>
      <p class="hint">OinkCoin needs your permission to read your bank account so your buddy can track your budget.</p>
      <form id="consent-form">
        <p class="q">OinkCoin will be able to:</p>
        <div class="options">
          ${SCOPES.map(
            (s) => `
            <label class="option scope">
              <input type="checkbox" name="scope" value="${s.id}" ${s.required || granted.has(s.id) ? 'checked' : ''} ${s.required ? 'disabled' : ''} />
              <span><strong>${esc(s.label)}${s.required ? ' <em>Required</em>' : ''}</strong><small>${esc(s.detail)}</small></span>
            </label>`,
          ).join('')}
        </div>
        <div class="never">
          <strong>OinkCoin will never:</strong>
          <ul>
            <li>Move money, make payments or transfers</li>
            <li>See or store your bank username and password</li>
            <li>Sell or share your data</li>
          </ul>
        </div>
        <p class="hint">You can change these permissions or disconnect any time in Profile &amp; Settings. Read our ${PRIVACY_LINK}.</p>
        <label class="option agree">
          <input type="checkbox" name="agree" required ${current.consent ? 'checked' : ''} />
          <span>I agree to let OinkCoin access my bank account as described above.</span>
        </label>
        <p class="import-msg error" id="consent-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Agree &amp; continue</button></div>
      </form>
    </main>`;

  app.querySelector('#cancel')?.addEventListener('click', () => cancel?.());

  const form = app.querySelector<HTMLFormElement>('#consent-form')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const chosen = new FormData(form).getAll('scope').map(String);
    const scopes = SCOPES.filter((s) => s.required || chosen.includes(s.id)).map((s) => s.id);
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.disabled = true;
    try {
      await saveConsent({ scopes, agreedAt: Date.now() });
      done();
    } catch (err) {
      const msg = form.querySelector<HTMLElement>('#consent-error')!;
      msg.textContent = err instanceof Error ? err.message : 'Could not save your choices.';
      msg.hidden = false;
      button.disabled = false;
    }
  });
}
