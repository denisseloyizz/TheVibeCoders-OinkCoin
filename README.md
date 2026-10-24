# TheVibeCoders-OinkCoin

A budget tracker with a virtual buddy (male, female, non-binary, or pig) whose mood depends on how you spend.

```sh
npm install
npm run dev
```
## Accounts and bank linking

Without configuration, accounts are stored on the device only (fine for demos, not real security).
For real accounts and bank linking, set up [Supabase](https://supabase.com) and [Plaid](https://plaid.com):

1. Create a Supabase project and a Plaid account (Sandbox is free and uses test banks).
2. `cp .env.example .env` and fill in the Supabase URL and anon key (Project Settings > API).
3. With the [Supabase CLI](https://supabase.com/docs/guides/cli):

   ```sh
   supabase link --project-ref <your-project-ref>
   supabase db push
   supabase secrets set PLAID_CLIENT_ID=... PLAID_SECRET=... PLAID_ENV=sandbox
   supabase functions deploy bank
   ```

4. `npm run dev`, sign up, agree to the permissions and connect a bank.
   In Sandbox, pick any bank and log in with `user_good` / `pass_good`.

The Plaid secret and bank access tokens live only in the `bank` function and the
`plaid_items` table (no client access). The app never moves money.
