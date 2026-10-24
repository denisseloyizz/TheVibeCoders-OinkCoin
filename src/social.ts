import { supabase } from './supabase';
import type { Character, Equipped, Mood } from './types';

// Friends: each user publishes a buddy card (pet name, look, mood and house; never money) to the
// `buddies` table. Database rules only let friends, and people you sent a request to accept, read it.

export const socialEnabled = !!supabase;

export interface BuddyCard {
  name: string;
  character: Character;
  mood: Mood;
  equipped: Equipped;
  house: Partial<Record<string, string>>;
}

export interface Friend {
  id: string;
  displayName: string;
  buddy: BuddyCard | null;
}

export interface FriendsData {
  me: { friendCode: string; displayName: string } | null;
  friends: Friend[];
  incoming: Friend[];
  outgoing: number;
}

async function myId(): Promise<string> {
  const { data } = await supabase!.auth.getSession();
  const id = data.session?.user.id;
  if (!id) throw new Error('Please log in again.');
  return id;
}

const fail = (error: { message: string } | null) => {
  if (error) throw new Error(error.message);
};

let lastPublished = '';
let publishTimer = 0;

/** Publishes the buddy card shortly after it changes (skips if nothing changed). */
export function publishBuddy(card: BuddyCard): void {
  const json = JSON.stringify(card);
  if (json === lastPublished) return;
  clearTimeout(publishTimer);
  publishTimer = window.setTimeout(async () => {
    try {
      const id = await myId();
      const { error } = await supabase!.from('buddies').upsert({ user_id: id, buddy: card, updated_at: new Date().toISOString() });
      fail(error);
      lastPublished = json;
    } catch (err) {
      console.warn('Could not share your buddy with friends:', err);
    }
  }, 1500);
}

export function resetSocial(): void {
  lastPublished = '';
  clearTimeout(publishTimer);
}

export async function loadFriends(card: BuddyCard): Promise<FriendsData> {
  const id = await myId();
  // Make sure we have a card (and so a friend code) before showing it.
  let { data: mine, error } = await supabase!.from('buddies').select('friend_code, display_name').eq('user_id', id).maybeSingle();
  fail(error);
  if (!mine) {
    const res = await supabase!.from('buddies').upsert({ user_id: id, buddy: card }).select('friend_code, display_name').single();
    fail(res.error);
    mine = res.data;
    lastPublished = JSON.stringify(card);
  }

  const { data: links, error: e2 } = await supabase!.from('friendships').select('requester, addressee, status');
  fail(e2);
  const other = (l: { requester: string; addressee: string }) => (l.requester === id ? l.addressee : l.requester);
  const accepted = (links ?? []).filter((l) => l.status === 'accepted').map(other);
  const incoming = (links ?? []).filter((l) => l.status === 'pending' && l.addressee === id).map((l) => l.requester);
  const outgoing = (links ?? []).filter((l) => l.status === 'pending' && l.requester === id).length;

  const ids = [...accepted, ...incoming];
  const cards = new Map<string, { display_name: string; buddy: BuddyCard }>();
  if (ids.length) {
    const { data, error: e3 } = await supabase!.from('buddies').select('user_id, display_name, buddy').in('user_id', ids);
    fail(e3);
    for (const row of data ?? []) cards.set(row.user_id, row);
  }
  const toFriend = (fid: string): Friend => {
    const c = cards.get(fid);
    const buddy = c?.buddy && 'character' in c.buddy ? c.buddy : null;
    return { id: fid, displayName: c?.display_name || (buddy ? `${buddy.name}'s owner` : 'A friend'), buddy };
  };

  return {
    me: mine ? { friendCode: mine.friend_code, displayName: mine.display_name } : null,
    friends: accepted.map(toFriend),
    incoming: incoming.map(toFriend),
    outgoing,
  };
}

export async function setDisplayName(name: string): Promise<void> {
  const { error } = await supabase!.from('buddies').update({ display_name: name.trim().slice(0, 30) }).eq('user_id', await myId());
  fail(error);
}

export async function sendFriendRequest(code: string): Promise<string> {
  const { data, error } = await supabase!.rpc('send_friend_request', { code });
  fail(error);
  return (
    {
      pending: 'Request sent! You will be friends once they accept.',
      accepted: 'You are now friends!',
      already: 'You are already friends.',
      self: "That's your own code.",
      not_found: 'No one has that friend code. Check it and try again.',
    }[data as string] ?? 'Something went wrong. Try again.'
  );
}

export async function acceptFriend(friendId: string): Promise<void> {
  const { error } = await supabase!.from('friendships').update({ status: 'accepted' }).eq('requester', friendId).eq('addressee', await myId());
  fail(error);
}

/** Declines a request or removes a friend. */
export async function removeFriend(friendId: string): Promise<void> {
  const id = await myId();
  const { error } = await supabase!
    .from('friendships')
    .delete()
    .or(`and(requester.eq.${id},addressee.eq.${friendId}),and(requester.eq.${friendId},addressee.eq.${id})`);
  fail(error);
}

export async function sendCheer(friendId: string): Promise<boolean> {
  const { error } = await supabase!.from('cheers').insert({ from_user: await myId(), to_user: friendId });
  if (error?.code === '23505') return false; // already cheered today
  fail(error);
  return true;
}

/** Cheers you haven't seen yet, with who sent them; marks them as seen. */
export async function collectCheers(): Promise<string[]> {
  const id = await myId();
  const { data, error } = await supabase!.from('cheers').select('id, from_user').eq('to_user', id).eq('seen', false);
  fail(error);
  if (!data?.length) return [];
  const { data: senders } = await supabase!.from('buddies').select('user_id, display_name, buddy').in('user_id', [...new Set(data.map((c) => c.from_user))]);
  const names = new Map((senders ?? []).map((s) => [s.user_id, s.display_name || `${(s.buddy as BuddyCard)?.name ?? 'A friend'}'s owner`]));
  await supabase!.from('cheers').update({ seen: true }).in('id', data.map((c) => c.id));
  return data.map((c) => names.get(c.from_user) ?? 'A friend');
}
