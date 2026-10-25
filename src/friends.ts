import { renderAvatar } from './avatar';
import { renderHouse } from './house';
import { t, tp } from './i18n';
import { moodLabel } from './labels';
import type { Friend, FriendsData } from './social';
import type { AppState, Mood, Profile } from './types';
import { esc } from './util';

const VISIT_LINE: Record<Mood, (name: string) => string> = {
  happy: (n) => t('{name} is doing great this month!', { name: n }),
  okay: (n) => t('{name} is doing okay.', { name: n }),
  sad: (n) => t('{name} is a little sad. A cheer would help.', { name: n }),
  angry: (n) => t('{name} is grumpy about spending this month.', { name: n }),
  dead: (n) => t('{name} fainted! Send a cheer to show you care.', { name: n }),
};

export function myHouseHtml(state: AppState, profile: Profile, mood: Mood): string {
  return `
    <section class="card house-card mood-${mood}">
      <h2>${t("{name}'s house", { name: esc(profile.name) })}</h2>
      ${renderHouse(state.house, { character: profile.character, mood, equipped: state.equipped }, t("{name}'s house", { name: profile.name }))}
      <p class="hint">${t("Friends see your buddy's house and mood, never your money.")}</p>
      <button class="secondary" data-view="store">${t('Decorate in the Store')}</button>
    </section>`;
}

function friendRow(f: Friend, actions: string): string {
  const b = f.buddy;
  return `
    <li class="friend${b ? ` mood-${b.mood}` : ''}">
      <div class="friend-pet">${b ? renderAvatar(b.character, b.mood, b.equipped) : ''}</div>
      <div class="friend-body">
        <strong>${esc(f.displayName)}</strong>
        ${b ? `<small>${esc(b.name)} <span class="mood-badge">${moodLabel(b.mood)}</span></small>` : `<small>${t('No buddy yet')}</small>`}
      </div>
      <div class="friend-actions">${actions}</div>
    </li>`;
}

export function friendsHtml(data: FriendsData | null, loading: boolean, message: string): string {
  if (!data) {
    return `<section class="card"><h2>${t('Friends')}</h2><p class="hint">${loading ? t('Loading your friends...') : esc(message || t('Could not load friends.'))}</p>
      ${loading ? '' : `<button class="secondary" id="retry-friends">${t('Try again')}</button>`}</section>`;
  }
  return `
    <section class="card friends">
      <h2>${t('Friends')}</h2>
      ${
        data.me
          ? `<div class="friend-code">
              <div><small>${t('Your friend code')}</small><strong>${esc(data.me.friendCode)}</strong></div>
              <button class="small secondary" id="copy-code" data-code="${esc(data.me.friendCode)}">${t('Copy')}</button>
            </div>`
          : ''
      }
      <form id="add-friend" class="add-friend">
        <input name="code" placeholder="${t("Friend's code, e.g. OINK-7F3K2A")}" aria-label="${t('Friend code')}" autocomplete="off" required />
        <button type="submit">${t('Add')}</button>
      </form>
      ${message ? `<p class="import-msg" role="status">${esc(message)}</p>` : ''}
      <label class="field">${t('Your name for friends')}
        <input id="display-name" maxlength="30" value="${esc(data.me?.displayName ?? '')}" placeholder="${t("So friends know it's you")}" />
      </label>

      ${
        data.incoming.length
          ? `<h3>${t('Friend requests')}</h3><ul class="friend-list">${data.incoming
              .map((f) =>
                friendRow(
                  f,
                  `<button class="small" data-accept="${f.id}">${t('Accept')}</button><button class="small secondary" data-decline="${f.id}">${t('Decline')}</button>`,
                ),
              )
              .join('')}</ul>`
          : ''
      }
      ${data.outgoing ? `<p class="hint">${tp('{n} request waiting for a reply.', '{n} requests waiting for a reply.', data.outgoing)}</p>` : ''}

      <h3>${t('Your friends')}</h3>
      ${
        data.friends.length
          ? `<ul class="friend-list">${data.friends
              .map((f) => friendRow(f, `<button class="small" data-visit="${f.id}">${t('Visit')}</button>`))
              .join('')}</ul>`
          : `<p class="empty">${t('No friends yet. Share your code so friends can add you.')}</p>`
      }
    </section>`;
}

export function visitHtml(friend: Friend, message: string): string {
  const b = friend.buddy;
  if (!b) {
    return `<section class="card"><button class="link" id="back-friends">${t('&larr; Friends')}</button><p class="hint">${t("{name} hasn't set up a buddy yet.", { name: esc(friend.displayName) })}</p></section>`;
  }
  return `
    <section class="card house-card visit mood-${b.mood}">
      <button class="link" id="back-friends">${t('&larr; Friends')}</button>
      <h2>${t("{name}'s house", { name: esc(b.name) })}</h2>
      <p class="hint">${esc(friend.displayName)}</p>
      ${renderHouse(b.house, { character: b.character, mood: b.mood, equipped: b.equipped }, t("{name}'s house", { name: b.name }))}
      <div class="pet-name"><h2>${esc(b.name)}</h2><span class="mood-badge">${moodLabel(b.mood)}</span></div>
      <p class="speech">${esc(VISIT_LINE[b.mood](b.name))}</p>
      ${message ? `<p class="import-msg" role="status">${esc(message)}</p>` : ''}
      <button id="cheer" data-cheer="${friend.id}">${t('Send a cheer (+10 Love)')}</button>
      <button class="danger" id="unfriend" data-unfriend="${friend.id}">${t('Remove friend')}</button>
    </section>`;
}
