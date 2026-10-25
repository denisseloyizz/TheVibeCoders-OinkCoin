import { renderAvatar } from './avatar';
import { renderHouse } from './house';
import type { Friend, FriendsData } from './social';
import type { AppState, Mood, Profile } from './types';
import { esc } from './util';

const MOOD_LABEL: Record<Mood, string> = { happy: 'Happy', okay: 'Okay', sad: 'Sad', angry: 'Angry', dead: 'Fainted' };

const VISIT_LINE: Record<Mood, (name: string) => string> = {
  happy: (n) => `${n} is doing great this month!`,
  okay: (n) => `${n} is doing okay.`,
  sad: (n) => `${n} is a little sad. A cheer would help.`,
  angry: (n) => `${n} is grumpy about spending this month.`,
  dead: (n) => `${n} fainted! Send a cheer to show you care.`,
};

export function myHouseHtml(state: AppState, profile: Profile, mood: Mood): string {
  return `
    <section class="card house-card mood-${mood}">
      <h2>${esc(profile.name)}'s house</h2>
      ${renderHouse(state.house, { character: profile.character, mood, equipped: state.equipped }, `${profile.name}'s house`)}
      <p class="hint">Friends see your buddy's house and mood, never your money.</p>
      <button class="secondary" data-view="store">Decorate in the Store</button>
    </section>`;
}

function friendRow(f: Friend, actions: string): string {
  const b = f.buddy;
  return `
    <li class="friend${b ? ` mood-${b.mood}` : ''}">
      <div class="friend-pet">${b ? renderAvatar(b.character, b.mood, b.equipped) : ''}</div>
      <div class="friend-body">
        <strong>${esc(f.displayName)}</strong>
        ${b ? `<small>${esc(b.name)} <span class="mood-badge">${MOOD_LABEL[b.mood]}</span></small>` : '<small>No buddy yet</small>'}
      </div>
      <div class="friend-actions">${actions}</div>
    </li>`;
}

export function friendsHtml(data: FriendsData | null, loading: boolean, message: string): string {
  if (!data) {
    return `<section class="card"><h2>Friends</h2><p class="hint">${loading ? 'Loading your friends...' : esc(message || 'Could not load friends.')}</p>
      ${loading ? '' : '<button class="secondary" id="retry-friends">Try again</button>'}</section>`;
  }
  return `
    <section class="card friends">
      <h2>Friends</h2>
      ${
        data.me
          ? `<div class="friend-code">
              <div><small>Your friend code</small><strong>${esc(data.me.friendCode)}</strong></div>
              <button class="small secondary" id="copy-code" data-code="${esc(data.me.friendCode)}">Copy</button>
            </div>`
          : ''
      }
      <form id="add-friend" class="add-friend">
        <input name="code" placeholder="Friend's code, e.g. OINK-7F3K2A" aria-label="Friend code" autocomplete="off" required />
        <button type="submit">Add</button>
      </form>
      ${message ? `<p class="import-msg" role="status">${esc(message)}</p>` : ''}
      <label class="field">Your name for friends
        <input id="display-name" maxlength="30" value="${esc(data.me?.displayName ?? '')}" placeholder="So friends know it's you" />
      </label>

      ${
        data.incoming.length
          ? `<h3>Friend requests</h3><ul class="friend-list">${data.incoming
              .map((f) =>
                friendRow(
                  f,
                  `<button class="small" data-accept="${f.id}">Accept</button><button class="small secondary" data-decline="${f.id}">Decline</button>`,
                ),
              )
              .join('')}</ul>`
          : ''
      }
      ${data.outgoing ? `<p class="hint">${data.outgoing} request${data.outgoing === 1 ? '' : 's'} waiting for a reply.</p>` : ''}

      <h3>Your friends</h3>
      ${
        data.friends.length
          ? `<ul class="friend-list">${data.friends
              .map((f) => friendRow(f, `<button class="small" data-visit="${f.id}">Visit</button>`))
              .join('')}</ul>`
          : '<p class="empty">No friends yet. Share your code so friends can add you.</p>'
      }
    </section>`;
}

export function visitHtml(friend: Friend, message: string): string {
  const b = friend.buddy;
  if (!b) {
    return `<section class="card"><button class="link" id="back-friends">&larr; Friends</button><p class="hint">${esc(friend.displayName)} hasn't set up a buddy yet.</p></section>`;
  }
  return `
    <section class="card house-card visit mood-${b.mood}">
      <button class="link" id="back-friends">&larr; Friends</button>
      <h2>${esc(b.name)}'s house</h2>
      <p class="hint">${esc(friend.displayName)}</p>
      ${renderHouse(b.house, { character: b.character, mood: b.mood, equipped: b.equipped }, `${b.name}'s house`)}
      <div class="pet-name"><h2>${esc(b.name)}</h2><span class="mood-badge">${MOOD_LABEL[b.mood]}</span></div>
      <p class="speech">${esc(VISIT_LINE[b.mood](b.name))}</p>
      ${message ? `<p class="import-msg" role="status">${esc(message)}</p>` : ''}
      <button id="cheer" data-cheer="${friend.id}">Send a cheer (+10 Love)</button>
      <button class="danger" id="unfriend" data-unfriend="${friend.id}">Remove friend</button>
    </section>`;
}
