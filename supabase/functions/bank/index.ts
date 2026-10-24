// Supabase Edge Function: the only place that talks to Plaid or sees access tokens.
// Secrets (set with `supabase secrets set`): PLAID_CLIENT_ID, PLAID_SECRET, PLAID_ENV.
import { createClient, type User } from 'npm:@supabase/supabase-js@2';

const PLAID_ENV = Deno.env.get('PLAID_ENV') ?? 'sandbox';
const PLAID_URL = `https://${PLAID_ENV}.plaid.com`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });

// deno-lint-ignore no-explicit-any
async function plaid(path: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${PLAID_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: Deno.env.get('PLAID_CLIENT_ID'), secret: Deno.env.get('PLAID_SECRET'), ...body }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error(path, data.error_code, data.error_message);
    const fallback = PLAID_ENV === 'sandbox' ? `Plaid error: ${data.error_code}` : 'Your bank could not be reached. Try again later.';
    throw new HttpError(502, data.display_message ?? fallback);
  }
  return data;
}

function requireConsent(user: User): void {
  const scopes: string[] = user.user_metadata?.consent?.scopes ?? [];
  if (!scopes.includes('balances') || !scopes.includes('transactions')) {
    throw new HttpError(403, 'Agree to the bank permissions first.');
  }
}

async function items(user: User): Promise<{ item_id: string; access_token: string }[]> {
  const { data, error } = await admin.from('plaid_items').select('item_id, access_token').eq('user_id', user.id);
  if (error) throw error;
  return data;
}

async function removeItems(user: User): Promise<void> {
  for (const item of await items(user)) {
    await plaid('/item/remove', { access_token: item.access_token }).catch(() => {});
  }
  const { error } = await admin.from('plaid_items').delete().eq('user_id', user.id);
  if (error) throw error;
}

async function sync(user: User) {
  requireConsent(user);
  const linked = await items(user);
  const accounts = [];
  const transactions = [];
  let ready = true;

  for (const item of linked) {
    const acc = await plaid('/accounts/get', { access_token: item.access_token });
    for (const a of acc.accounts) {
      accounts.push({ name: a.official_name ?? a.name, mask: a.mask, type: a.subtype ?? a.type, balance: a.balances.current });
    }

    // Always sync from the start: the app keeps transactions on the device and dedupes them.
    let cursor: string | undefined;
    let hasMore = true;
    while (hasMore) {
      const page = await plaid('/transactions/sync', {
        access_token: item.access_token,
        cursor,
        count: 500,
        options: { include_personal_finance_category: true },
      });
      if (page.transactions_update_status === 'NOT_READY') ready = false;
      for (const t of [...page.added, ...page.modified]) {
        transactions.push({
          id: t.transaction_id,
          date: t.date,
          amount: t.amount,
          name: t.merchant_name ?? t.name,
          primary: t.personal_finance_category?.primary ?? null,
          detailed: t.personal_finance_category?.detailed ?? null,
          pending: t.pending,
        });
      }
      cursor = page.next_cursor;
      hasMore = page.has_more;
    }
  }
  return { linked: linked.length > 0, ready, accounts, transactions };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    const { data } = await admin.auth.getUser(jwt);
    const user = data.user;
    if (!user) throw new HttpError(401, 'Please log in again.');

    const body = await req.json();
    switch (body.action) {
      case 'link_token': {
        requireConsent(user);
        const r = await plaid('/link/token/create', {
          user: { client_user_id: user.id },
          client_name: 'OinkCoin',
          products: ['transactions'],
          transactions: { days_requested: 180 },
          country_codes: ['US'],
          language: 'en',
        });
        return json({ link_token: r.link_token });
      }
      case 'exchange': {
        requireConsent(user);
        if (typeof body.public_token !== 'string') throw new HttpError(400, 'Missing bank token.');
        const r = await plaid('/item/public_token/exchange', { public_token: body.public_token });
        const { error } = await admin.from('plaid_items').insert({ item_id: r.item_id, user_id: user.id, access_token: r.access_token });
        if (error) throw error;
        return json({ ok: true });
      }
      case 'sync':
        return json(await sync(user));
      case 'disconnect':
        await removeItems(user);
        return json({ ok: true });
      case 'delete_account': {
        await removeItems(user);
        const { error } = await admin.auth.admin.deleteUser(user.id);
        if (error) throw error;
        return json({ ok: true });
      }
      default:
        throw new HttpError(400, 'Unknown action.');
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    console.error(err);
    return json({ error: 'Something went wrong on our side. Try again.' }, 500);
  }
});
