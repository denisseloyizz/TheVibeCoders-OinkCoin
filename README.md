# TheVibeCoders-OinkCoin

A budget tracker with a virtual buddy (male, female, non-binary, or pig) whose mood depends on how you spend.

```sh
npm install
npm run dev
```

Then open http://localhost:5173.

## How it works

1. **Sign up or log in** with email and password.
2. **Agree to bank permissions.** Viewing balances and transactions is required; daily auto-refresh and
   spending alerts are optional. OinkCoin never moves money or sees your bank login.
3. **Connect your bank** through [Plaid](https://plaid.com). Transactions are imported and sorted into
   spending categories automatically.
4. **Set up your buddy**, budget and goals, then keep your buddy happy by staying on budget.

Bank permissions, linked accounts, sync and disconnect live in **Profile & Settings**.

Without a backend configured, the app still runs: accounts are stored on the device only (fine for demos,
not real security) and spending comes from CSV uploads.

## Backend setup (Supabase + Plaid)

Accounts use [Supabase Auth](https://supabase.com/docs/guides/auth). Bank linking goes through a Supabase
Edge Function (`supabase/functions/bank`) that is the only place holding the Plaid secret and bank access
tokens. Tokens are stored in the `plaid_items` table, which has row-level security on and no client access.

### 1. Create the accounts

- A [Supabase](https://supabase.com) project.
- A [Plaid](https://dashboard.plaid.com) account. Sandbox is free and uses test banks.

### 2. Point the app at Supabase

```sh
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from Supabase **Project Settings > API Keys**
(the `anon` / publishable key, never the service role or secret key).

In Supabase **Authentication > URL Configuration**, set the Site URL to `http://localhost:5173` and add
these Redirect URLs so email confirmation links come back to the app:

- `http://localhost:5173/**`
- `https://denisseloyizz.github.io/TheVibeCoders-OinkCoin/**`

### 3. Deploy the database table and bank function

Run each command from the project folder and wait for it to finish before the next:

```sh
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
npx supabase functions deploy bank
```

### 4. Add the Plaid keys

The easiest way is the dashboard: **Edge Functions > Secrets** in your Supabase project. Add:

| Name | Value |
| --- | --- |
| `PLAID_CLIENT_ID` | From Plaid **Developers > Keys** |
| `PLAID_SECRET` | The **Sandbox** secret from the same page |
| `PLAID_ENV` | `sandbox` |
| `PLAID_TOKEN_KEY` | Encryption key for stored bank tokens (see below) |

Or from the terminal, with the values in quotes:

```sh
npx supabase secrets set PLAID_CLIENT_ID="..." PLAID_SECRET="..." PLAID_ENV=sandbox
npx supabase secrets set "PLAID_TOKEN_KEY=$(openssl rand -base64 32)"
```

`PLAID_TOKEN_KEY` encrypts each bank's access token before it's saved. Set it once and don't change it:
a new key means every user has to reconnect their bank.

The function picks up new secrets without redeploying.

### 5. Try it

Sign up, confirm your email, agree to the permissions, and connect a bank. In Sandbox:

- Choose **First Platypus Bank** (banks that redirect to their own site, like "Platypus OAuth Bank" or
  Chase, open a pop-up that VS Code's preview browser blocks; use Chrome or Safari for those).
- Log in with `user_good` / `pass_good` (all lowercase), or `user_transactions_dynamic` with any password
  for more realistic data. If asked for a code, use `1234`.
- If it says your bank is still preparing transactions, wait a minute and press **Sync now**.

## Troubleshooting

| Message | Fix |
| --- | --- |
| `Plaid error: INVALID_API_KEYS` or `INVALID_FIELD - client_id ...` | The Plaid secrets are missing or wrong. Re-enter them (step 4). |
| `Could not reach the bank service` | The `bank` function isn't deployed (step 3). |
| `Confirm your email first` | Click the link in the confirmation email, then log in. |
| Plaid says "you will be redirected" and stays there | Pop-up blocked. Use First Platypus Bank, or open the app in Chrome/Safari and allow pop-ups. |

In Sandbox, errors show Plaid's error code. Full details are in Supabase **Edge Functions > bank > Logs**.

## Going live with real banks

1. In the Plaid dashboard, request Production access. You'll need the privacy policy URL:
   `https://denisseloyizz.github.io/TheVibeCoders-OinkCoin/privacy.html` (source: `public/privacy.html`).
2. Once approved, set `PLAID_ENV=production` and `PLAID_SECRET` to the Production secret.
3. For banks that log in on their own site (OAuth: Chase, Wells Fargo, Capital One...):
   - In Plaid **Developers > API > Allowed redirect URIs**, add
     `https://denisseloyizz.github.io/TheVibeCoders-OinkCoin/`.
   - Set the `PLAID_REDIRECT_URIS` secret to the same URL (comma-separate several).
   - Complete Plaid's OAuth registration for those banks in the dashboard.

   Without `PLAID_REDIRECT_URIS`, OAuth banks still work on desktop through Plaid's pop-up window.
   The iOS app needs a universal link for OAuth, which isn't set up yet.

Budget, buddy and expenses are stored per user on each device; they don't sync between devices yet.

## Deploy

GitHub Pages serves the built site from `docs/` on `main`:

```sh
npm run build
```

Commit and push the updated `docs/` folder to `main`; the `Deploy to GitHub Pages` workflow publishes it
in about a minute. Build locally, because the build includes the Supabase URL and publishable key from
`.env` (safe to be public), which GitHub doesn't have.
