import { FunctionsHttpError } from '@supabase/supabase-js';
import { categorize } from './statement';
import { supabase } from './supabase';
import type { BankAccount, Category, Expense } from './types';

// Bank linking goes through Plaid. The Plaid secret and access tokens stay in the
// `bank` Supabase function; the app only ever sees short-lived link tokens.

export const bankEnabled = !!supabase;

interface PlaidHandler {
  open(): void;
  destroy(): void;
}

declare global {
  interface Window {
    Plaid?: {
      create(config: {
        token: string;
        onSuccess: (publicToken: string) => void;
        onExit: (err: { display_message?: string | null; error_message?: string } | null) => void;
      }): PlaidHandler;
    };
  }
}

interface RawTransaction {
  id: string;
  date: string;
  amount: number;
  name: string;
  primary: string | null;
  detailed: string | null;
  pending: boolean;
}

export interface SyncResult {
  linked: boolean;
  ready: boolean;
  accounts: BankAccount[];
  expenses: Expense[];
}

async function call<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
  if (!supabase) throw new Error('Bank connection is not set up yet.');
  const { data, error } = await supabase.functions.invoke('bank', { body: { action, ...body } });
  if (error) {
    const detail = error instanceof FunctionsHttpError ? await error.context.json().catch(() => null) : null;
    throw new Error(detail?.error ?? 'Could not reach the bank service. Try again.');
  }
  return data as T;
}

let plaidScript: Promise<void> | null = null;

function loadPlaid(): Promise<void> {
  plaidScript ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
    s.onload = () => resolve();
    s.onerror = () => {
      plaidScript = null;
      reject(new Error('Could not load the bank connection screen.'));
    };
    document.head.append(s);
  });
  return plaidScript;
}

/** Opens Plaid Link. Resolves true once a bank is linked, false if the user closed it. */
export async function connectBank(): Promise<boolean> {
  const [{ link_token }] = await Promise.all([call<{ link_token: string }>('link_token'), loadPlaid()]);
  return new Promise((resolve, reject) => {
    const handler = window.Plaid!.create({
      token: link_token,
      onSuccess: (publicToken) => {
        handler.destroy();
        call('exchange', { public_token: publicToken }).then(() => resolve(true), reject);
      },
      onExit: (err) => {
        handler.destroy();
        if (err) reject(new Error(err.display_message || err.error_message || 'Could not connect to your bank.'));
        else resolve(false);
      },
    });
    handler.open();
  });
}

const SKIP_PRIMARY = new Set(['INCOME', 'TRANSFER_IN', 'TRANSFER_OUT']);
const SKIP_DETAILED = new Set(['LOAN_PAYMENTS_CREDIT_CARD_PAYMENT']);

const PRIMARY_CATEGORY: Record<string, Category> = {
  FOOD_AND_DRINK: 'Food & Dining',
  GENERAL_MERCHANDISE: 'Shopping',
  HOME_IMPROVEMENT: 'Shopping',
  ENTERTAINMENT: 'Entertainment',
  TRANSPORTATION: 'Transport',
  TRAVEL: 'Transport',
  RENT_AND_UTILITIES: 'Bills',
  LOAN_PAYMENTS: 'Bills',
  MEDICAL: 'Health',
  PERSONAL_CARE: 'Health',
};

function toExpense(t: RawTransaction): Expense | null {
  // Plaid amounts are positive for money leaving the account.
  if (t.pending || t.amount <= 0) return null;
  if ((t.primary && SKIP_PRIMARY.has(t.primary)) || (t.detailed && SKIP_DETAILED.has(t.detailed))) return null;
  const category: Category =
    t.detailed === 'FOOD_AND_DRINK_GROCERIES' ? 'Groceries' : ((t.primary ? PRIMARY_CATEGORY[t.primary] : undefined) ?? categorize(t.name));
  return { id: `plaid:${t.id}`, amount: Math.round(t.amount * 100) / 100, category, note: t.name.slice(0, 60), date: t.date };
}

export async function syncBank(): Promise<SyncResult> {
  const r = await call<{ linked: boolean; ready: boolean; accounts: BankAccount[]; transactions: RawTransaction[] }>('sync');
  return {
    linked: r.linked,
    ready: r.ready,
    accounts: r.accounts,
    expenses: r.transactions.map(toExpense).filter((e): e is Expense => e !== null),
  };
}

export const disconnectBank = () => call('disconnect');

/** Revokes bank access and deletes the server account. */
export const deleteServerAccount = () => call('delete_account');
