-- Each user's OinkCoin data (buddy, budget, coins, transactions) so it follows
-- their account across browsers and devices. Users can only touch their own row.
create table public.app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

create policy "Users read their own data" on public.app_state
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users insert their own data" on public.app_state
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users update their own data" on public.app_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Accounts with two-factor on must have entered their code this session.
create policy "Two-factor required when enabled" on public.app_state
  as restrictive to authenticated
  using (
    array[(select auth.jwt() ->> 'aal')] <@ (
      select case when count(id) > 0 then array['aal2'] else array['aal1', 'aal2'] end
      from auth.mfa_factors
      where (select auth.uid()) = user_id and status = 'verified'
    )
  );
