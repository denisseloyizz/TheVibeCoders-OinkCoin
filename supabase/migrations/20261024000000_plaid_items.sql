-- Plaid access tokens are as sensitive as bank credentials. RLS is on with no
-- policies, so only the service role (the `bank` function) can read them.
create table public.plaid_items (
  item_id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  access_token text not null,
  created_at timestamptz not null default now()
);

create index plaid_items_user_id_idx on public.plaid_items (user_id);

alter table public.plaid_items enable row level security;
