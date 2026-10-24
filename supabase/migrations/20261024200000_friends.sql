-- Friends: each user publishes a "buddy card" (pet name, look, mood, house; never money),
-- adds friends by code, visits their houses and sends cheers.

create table public.buddies (
  user_id uuid primary key references auth.users (id) on delete cascade,
  friend_code text not null unique default ('OINK-' || upper(substr(md5(gen_random_uuid()::text), 1, 6))),
  display_name text not null default '' check (char_length(display_name) <= 30),
  buddy jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.friendships (
  requester uuid not null references auth.users (id) on delete cascade,
  addressee uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted')),
  created_at timestamptz not null default now(),
  primary key (requester, addressee),
  check (requester <> addressee)
);

create table public.cheers (
  id bigint generated always as identity primary key,
  from_user uuid not null references auth.users (id) on delete cascade,
  to_user uuid not null references auth.users (id) on delete cascade,
  cheer_day date not null default (now() at time zone 'utc')::date,
  seen boolean not null default false,
  created_at timestamptz not null default now(),
  unique (from_user, to_user, cheer_day)
);

create index friendships_addressee_idx on public.friendships (addressee);
create index cheers_to_user_idx on public.cheers (to_user) where not seen;

alter table public.buddies enable row level security;
alter table public.friendships enable row level security;
alter table public.cheers enable row level security;

create function public.are_friends(a uuid, b uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from friendships
    where status = 'accepted' and ((requester = a and addressee = b) or (requester = b and addressee = a))
  );
$$;

-- Buddy cards: your own, your friends', and people who sent you a request (so you know who it is).
create policy "Read own, friends' and requesters' buddies" on public.buddies
  for select to authenticated using (
    user_id = (select auth.uid())
    or public.are_friends((select auth.uid()), user_id)
    or exists (
      select 1 from friendships f
      where f.status = 'pending' and f.requester = buddies.user_id and f.addressee = (select auth.uid())
    )
  );
create policy "Create own buddy" on public.buddies
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "Update own buddy" on public.buddies
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Friendships are created only through send_friend_request(). Either side can see or end one;
-- only the person asked can accept.
create policy "See own friendships" on public.friendships
  for select to authenticated using ((select auth.uid()) in (requester, addressee));
create policy "Accept requests sent to you" on public.friendships
  for update to authenticated using (addressee = (select auth.uid())) with check (addressee = (select auth.uid()) and status = 'accepted');
create policy "End own friendships" on public.friendships
  for delete to authenticated using ((select auth.uid()) in (requester, addressee));

-- Cheers: send to friends (once a day each), read the ones you sent or got, mark yours as seen.
create policy "Cheer friends" on public.cheers
  for insert to authenticated with check (from_user = (select auth.uid()) and public.are_friends(from_user, to_user));
create policy "See own cheers" on public.cheers
  for select to authenticated using ((select auth.uid()) in (from_user, to_user));
create policy "Mark own cheers seen" on public.cheers
  for update to authenticated using (to_user = (select auth.uid())) with check (to_user = (select auth.uid()));

-- Look up a friend code without exposing everyone's buddy card. If they already asked you, this accepts.
create function public.send_friend_request(code text) returns text
language plpgsql security definer set search_path = public as $$
declare
  me uuid := auth.uid();
  them uuid;
begin
  if me is null then
    raise exception 'Not signed in';
  end if;
  select user_id into them from buddies where friend_code = upper(trim(code));
  if them is null then
    return 'not_found';
  end if;
  if them = me then
    return 'self';
  end if;
  if public.are_friends(me, them) then
    return 'already';
  end if;
  if exists (select 1 from friendships where requester = them and addressee = me) then
    update friendships set status = 'accepted' where requester = them and addressee = me;
    return 'accepted';
  end if;
  insert into friendships (requester, addressee) values (me, them) on conflict do nothing;
  return 'pending';
end;
$$;

revoke execute on function public.send_friend_request(text) from public, anon;
grant execute on function public.send_friend_request(text) to authenticated;
revoke execute on function public.are_friends(uuid, uuid) from public, anon;
grant execute on function public.are_friends(uuid, uuid) to authenticated;
