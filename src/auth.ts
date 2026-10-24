import type { User as SupabaseUser } from '@supabase/supabase-js';
import { LINE } from './icons';
import { brand } from './logo';
import { authLinkError, openedFromRecoveryLink, supabase } from './supabase';
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

let recovering = openedFromRecoveryLink;
/** True after opening a password reset link, until a new password is saved. */
export const needsNewPassword = (): boolean => recovering;

/** onChange runs when the user is signed out elsewhere or arrives from a password reset link. */
export async function initAuth(onChange: () => void): Promise<void> {
  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      user = fromSupabase(session?.user);
      if (event === 'PASSWORD_RECOVERY' && !recovering) {
        recovering = true;
        onChange();
      }
      if (event === 'SIGNED_OUT') onChange();
    });
    const { data } = await supabase.auth.getSession();
    user = fromSupabase(data.session?.user);
    await refreshTwoFactor();
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
  twoFactor = null;
  twoFactorPending = false;
}

// Two-factor sign-in uses Supabase MFA with an authenticator app (TOTP).
// null means unavailable, which is the case for device-only accounts.
let twoFactor: boolean | null = null;
let twoFactorPending = false;
export const twoFactorOn = (): boolean | null => twoFactor;
export const needsTwoFactor = (): boolean => twoFactorPending;

async function refreshTwoFactor(): Promise<void> {
  twoFactor = null;
  twoFactorPending = false;
  if (!supabase || !user) return;
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  twoFactor = data?.nextLevel === 'aal2';
  twoFactorPending = data?.currentLevel === 'aal1' && data?.nextLevel === 'aal2';
}

async function verifyCode(factorId: string, code: string): Promise<void> {
  const { error } = await supabase!.auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw new Error("That code didn't work. Check your authenticator app and try again.");
}

export async function disableTwoFactor(): Promise<void> {
  const { data, error } = await supabase!.auth.mfa.listFactors();
  if (error) throw new Error(error.message);
  for (const f of data.totp) {
    const { error: e } = await supabase!.auth.mfa.unenroll({ factorId: f.id });
    if (e) throw new Error(e.message);
  }
  await refreshTwoFactor();
}

const CODE_INPUT =
  '<input name="code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required placeholder="123456" />';

function codeForm(app: HTMLElement, submit: (code: string) => Promise<void>): void {
  const form = app.querySelector<HTMLFormElement>('#code-form')!;
  const msg = app.querySelector<HTMLElement>('#code-error')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    button.disabled = true;
    try {
      await submit(String(new FormData(form).get('code')).trim());
    } catch (err) {
      msg.textContent = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      msg.hidden = false;
      button.disabled = false;
    }
  });
}

/** Asked after the password when the account has two-factor on. */
export function renderTwoFactorChallenge(app: HTMLElement, done: () => void): void {
  app.innerHTML = `
    <main class="onboard card auth">
      <div class="onboard-head">${brand()}</div>
      <h2>Enter your code</h2>
      <p class="hint">Open your authenticator app and enter the 6-digit code for OinkCoin.</p>
      <form id="code-form">
        <label class="field">Code ${CODE_INPUT}</label>
        <p class="import-msg error" id="code-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Verify</button></div>
      </form>
      <p class="auth-switch"><button type="button" class="link" id="switch-account">Use a different account</button></p>
    </main>`;
  app.querySelector<HTMLInputElement>('input[name="code"]')!.focus();
  app.querySelector('#switch-account')!.addEventListener('click', async () => {
    await signOut();
    done();
  });
  codeForm(app, async (code) => {
    const { data, error } = await supabase!.auth.mfa.listFactors();
    const factor = data?.totp[0];
    if (error || !factor) throw new Error('Could not find your authenticator. Try logging in again.');
    await verifyCode(factor.id, code);
    twoFactorPending = false;
    done();
  });
}

/** Turns on two-factor: scan a QR code, then confirm with a first code. */
export async function renderTwoFactorSetup(app: HTMLElement, done: () => void, cancel: () => void): Promise<void> {
  app.innerHTML = `<main class="onboard card auth"><div class="onboard-head">${brand()}</div><p class="hint">Setting up...</p></main>`;
  const mfa = supabase!.auth.mfa;
  const fail = (message: string) => {
    app.innerHTML = `
      <main class="onboard card auth">
        <div class="onboard-head">${brand()}</div>
        <h2>Two-factor sign-in</h2>
        <p class="import-msg error" role="alert">${esc(message)}</p>
        <div class="actions"><button type="button" class="secondary" id="cancel">Back</button></div>
      </main>`;
    app.querySelector('#cancel')!.addEventListener('click', cancel);
  };

  // Clear out half-finished setups so the new one can use the same name.
  const { data: existing } = await mfa.listFactors();
  for (const f of existing?.all ?? []) {
    if (f.factor_type === 'totp' && f.status === 'unverified') await mfa.unenroll({ factorId: f.id });
  }
  const { data, error } = await mfa.enroll({ factorType: 'totp', friendlyName: 'OinkCoin' });
  if (error || !data) return fail(error?.message ?? 'Could not start two-factor setup.');

  const qr = data.totp.qr_code;
  const qrSrc = qr.startsWith('data:') ? qr : `data:image/svg+xml;utf-8,${encodeURIComponent(qr)}`;
  app.innerHTML = `
    <main class="onboard card auth two-factor">
      <div class="onboard-head">${brand()}</div>
      <h2>Turn on two-factor sign-in</h2>
      <p class="hint">Scan this with an authenticator app like Google Authenticator, Microsoft Authenticator or 1Password.</p>
      <img class="qr" src="${esc(qrSrc)}" alt="QR code for your authenticator app" width="200" height="200" />
      <p class="hint">Can't scan it? Enter this key instead:<br /><code class="secret">${esc(data.totp.secret)}</code></p>
      <form id="code-form">
        <label class="field">Then enter the 6-digit code it shows ${CODE_INPUT}</label>
        <p class="import-msg error" id="code-error" role="alert" hidden></p>
        <div class="actions">
          <button type="button" class="secondary" id="cancel">Cancel</button>
          <button type="submit">Turn on</button>
        </div>
      </form>
    </main>`;
  app.querySelector('#cancel')!.addEventListener('click', async () => {
    await mfa.unenroll({ factorId: data.id });
    cancel();
  });
  codeForm(app, async (code) => {
    await verifyCode(data.id, code);
    await refreshTwoFactor();
    done();
  });
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
    await refreshTwoFactor();
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
    if (error?.code === 'email_not_confirmed') throw new UnconfirmedError();
    if (error) throw new Error('Email or password is incorrect.');
    user = fromSupabase(data.user);
    await refreshTwoFactor();
    return;
  }
  const local = loadLocal();
  if (!local || local.email !== email || (await hashPassword(password, fromHex(local.salt))) !== local.hash) {
    throw new Error('Email or password is incorrect.');
  }
  localStorage.setItem(SESSION_KEY, email);
  user = { email, consent: local.consent };
}

class UnconfirmedError extends Error {
  constructor() {
    super('Confirm your email first, then log in. Check your spam folder too.');
  }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();
const isEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const pageUrl = () => location.origin + location.pathname;

// An email link that came back with an error: explain it instead of silently showing the login form.
let mode: 'signup' | 'login' | 'forgot' | null = authLinkError ? 'forgot' : null;
let authMsg = authLinkError
  ? authLinkError === 'otp_expired'
    ? 'That email link has expired or was already used. Links only work once, so request a new one below.'
    : 'That email link did not work. Request a new one below.'
  : '';
let authError = !!authLinkError;
/** Last email typed, so switching screens keeps it and "resend" knows where to send. */
let lastEmail = '';
let canResend = false;

const messageHtml = () =>
  authMsg ? `<p class="import-msg${authError ? ' error' : ''}" role="${authError ? 'alert' : 'status'}">${esc(authMsg)}</p>` : '';

function renderForgot(app: HTMLElement, done: () => void): void {
  const rerender = () => renderAuth(app, done);
  app.innerHTML = `
    <main class="onboard card auth">
      <div class="onboard-head">${brand()}</div>
      <h2>Reset your password</h2>
      <p class="hint">Enter your email and we'll send you a link to choose a new password.</p>
      <form id="forgot-form" novalidate>
        <label class="field">Email
          <input name="email" type="email" autocomplete="email" required value="${esc(lastEmail)}" placeholder="you@example.com" />
        </label>
        ${messageHtml()}
        <div class="actions"><button type="submit">Send reset link</button></div>
      </form>
      <p class="auth-switch"><button type="button" class="link" id="back-login">Back to log in</button></p>
    </main>`;
  app.querySelector('#back-login')!.addEventListener('click', () => {
    mode = 'login';
    authMsg = '';
    rerender();
  });
  const form = app.querySelector<HTMLFormElement>('#forgot-form')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    lastEmail = normalizeEmail(String(new FormData(form).get('email')));
    authError = true;
    if (!isEmail(lastEmail)) {
      authMsg = 'Enter a valid email address.';
      return rerender();
    }
    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
    const { error } = await supabase!.auth.resetPasswordForEmail(lastEmail, { redirectTo: pageUrl() });
    // Same answer whether or not the account exists, so the form can't be used to look up emails.
    authMsg = error?.status === 429 ? 'Too many emails sent. Wait a few minutes and try again.' : "If there's an account for that email, a reset link is on its way. Check your spam folder too.";
    authError = error?.status === 429;
    rerender();
  });
}

/** Shown after opening a password reset link: pick a new password. */
export function renderNewPassword(app: HTMLElement, done: () => void): void {
  if (!user) {
    // The link expired or was already used.
    recovering = false;
    mode = 'forgot';
    authMsg = 'That reset link has expired. Request a new one.';
    authError = true;
    return renderAuth(app, done);
  }
  app.innerHTML = `
    <main class="onboard card auth">
      <div class="onboard-head">${brand()}</div>
      <h2>Choose a new password</h2>
      <p class="hint">For ${esc(user.email)}</p>
      <form id="new-password-form" novalidate>
        <label class="field">New password
          <input name="password" type="password" autocomplete="new-password" required minlength="${MIN_PASSWORD}" />
        </label>
        <label class="field">Confirm new password
          <input name="confirm" type="password" autocomplete="new-password" required minlength="${MIN_PASSWORD}" />
        </label>
        <p class="import-msg error" id="new-password-error" role="alert" hidden></p>
        <div class="actions"><button type="submit">Save password</button></div>
      </form>
    </main>`;
  const form = app.querySelector<HTMLFormElement>('#new-password-form')!;
  const msg = form.querySelector<HTMLElement>('#new-password-error')!;
  const fail = (text: string) => {
    msg.textContent = text;
    msg.hidden = false;
    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = false;
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const password = String(data.get('password'));
    if (password.length < MIN_PASSWORD) return fail(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (password !== String(data.get('confirm'))) return fail('Passwords do not match.');
    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
    const { error } = await supabase!.auth.updateUser({ password });
    if (error) return fail(error.message);
    recovering = false;
    done();
  });
}

export function renderAuth(app: HTMLElement, done: () => void): void {
  const remembered = supabase ? null : loadLocal();
  mode ??= supabase || remembered ? 'login' : 'signup';
  if (mode === 'forgot' && supabase) return renderForgot(app, done);
  const signup = mode === 'signup';
  const rerender = () => renderAuth(app, done);
  lastEmail ||= remembered?.email ?? '';

  app.innerHTML = `
    <main class="onboard card auth">
      <div class="onboard-head">${brand()}</div>
      <h2>${signup ? 'Create your account' : 'Welcome back'}</h2>
      <p class="hint">${signup ? 'Sign up to start budgeting with your buddy.' : 'Log in to check on your buddy.'}</p>
      <form id="auth-form" novalidate>
        <label class="field">Email
          <input name="email" type="email" autocomplete="email" required value="${esc(lastEmail)}" placeholder="you@example.com" />
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
        ${!signup && supabase ? '<p class="forgot"><button type="button" class="link" id="forgot">Forgot password?</button></p>' : ''}
        ${messageHtml()}
        ${canResend && supabase ? '<p class="forgot"><button type="button" class="link" id="resend">Resend confirmation email</button></p>' : ''}
        <div class="actions"><button type="submit">${signup ? 'Sign up' : 'Log in'}</button></div>
      </form>
      <p class="auth-switch">
        ${signup ? 'Already have an account?' : 'New here?'}
        <button type="button" class="link" id="switch">${signup ? 'Log in' : 'Create an account'}</button>
      </p>
      ${signup ? `<p class="auth-switch legal">By signing up you agree to our ${PRIVACY_LINK}.</p>` : ''}
    </main>`;

  const form = app.querySelector<HTMLFormElement>('#auth-form')!;
  const keepEmail = () => (lastEmail = normalizeEmail(String(new FormData(form).get('email'))));

  app.querySelector('#switch')!.addEventListener('click', () => {
    keepEmail();
    mode = signup ? 'login' : 'signup';
    authMsg = '';
    canResend = false;
    rerender();
  });
  app.querySelector('#forgot')?.addEventListener('click', () => {
    keepEmail();
    mode = 'forgot';
    authMsg = '';
    canResend = false;
    rerender();
  });
  app.querySelector('#resend')?.addEventListener('click', async () => {
    const { error } = await supabase!.auth.resend({ type: 'signup', email: lastEmail, options: { emailRedirectTo: pageUrl() } });
    authError = !!error;
    authMsg = error
      ? error.status === 429
        ? 'Too many emails sent. Wait a few minutes and try again.'
        : error.message
      : `Sent another confirmation email to ${lastEmail}. Check your spam folder too.`;
    rerender();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const email = keepEmail();
    const password = String(data.get('password'));
    const show = (msg: string, error = true) => {
      authMsg = msg;
      authError = error;
      rerender();
    };

    if (!isEmail(email)) return show('Enter a valid email address.');
    if (password.length < MIN_PASSWORD) return show(`Password must be at least ${MIN_PASSWORD} characters.`);
    if (signup && password !== String(data.get('confirm'))) return show('Passwords do not match.');

    form.querySelector<HTMLButtonElement>('button[type="submit"]')!.disabled = true;
    try {
      if (signup && !(await signUp(email, password))) {
        mode = 'login';
        canResend = true;
        return show('Check your inbox to confirm your email, then log in. Check your spam folder too.', false);
      }
      if (!signup) await logIn(email, password);
    } catch (err) {
      canResend = err instanceof UnconfirmedError;
      return show(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    }
    mode = null;
    authMsg = '';
    canResend = false;
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
