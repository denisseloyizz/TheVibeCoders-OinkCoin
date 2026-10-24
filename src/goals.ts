import { formatMoney, MOOD_STEPS, NEEDS, WANTS, type Analysis } from './budget';
import { PICK_FOR_GOAL } from './learn';
import { COINS_PER_GOAL, currentWeekWants } from './rewards';
import type { AppState, Mood, Profile } from './types';
import { esc } from './util';

const MOOD_NAME: Record<Mood, string> = { happy: 'Happy', okay: 'Okay', sad: 'Sad', angry: 'Angry', dead: 'Fainted' };

interface Goal {
  title: string;
  spent: number;
  limit: number;
  note: string;
}

/** A compact row: name, amounts and bar; tap the arrow for what it means. */
function goalRow(g: Goal): string {
  const ratio = g.limit > 0 ? g.spent / g.limit : g.spent > 0 ? Infinity : 0;
  const state = ratio > 1 ? 'over' : ratio >= 0.8 ? 'warn' : 'ok';
  const money = (n: number) => formatMoney(Math.round(n)).replace(/\.00$/, '');
  return `
    <details class="goal-row ${state}">
      <summary>
        <div class="goal-head">
          <strong>${esc(g.title)}</strong>
          <span class="${ratio > 1 ? 'neg' : ''}">${money(g.spent)} / ${money(g.limit)}</span>
        </div>
        <div class="bar"><div class="fill ${state}" style="width:${Math.min(100, Math.round(ratio * 100))}%"></div></div>
      </summary>
      <small>${g.note}</small>
    </details>`;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** This month's targets, what each one does, and how the buddy's mood is decided. */
/** Folded to one line ("This month's goals · 2 of 7 on track") until opened. */
export function renderGoals(state: AppState, profile: Profile, a: Analysis, open = false): string {
  const name = esc(profile.name);
  const week = currentWeekWants(state);
  const goals: Goal[] = [
    { title: 'Wants', spent: a.wantsSpent, limit: a.wantsLimit, note: `${esc(WANTS.join(', '))}. This sets ${name}'s mood.` },
    ...a.categories
      .filter((c) => profile.focus.includes(c.category))
      .map((c) => ({
        title: `Cut back: ${c.category}`,
        spent: c.spent,
        limit: c.limit,
        note: `20% less than usual, because you picked it in your goals. Going over makes ${name} one step sadder.`,
      })),
    { title: 'Needs', spent: a.needsSpent, limit: a.needsLimit, note: `${esc([...NEEDS, 'Other'].join(', '))}. Going over makes ${name} sad, never worse.` },
    { title: 'This week', spent: week.spent, limit: week.limit, note: `Wants this week. Stay under to earn <b>+${COINS_PER_GOAL} coins</b> when the week ends.` },
    { title: 'Whole month', spent: a.spent, limit: profile.budget, note: `Finish under your budget with wants on budget to earn <b>+${COINS_PER_GOAL} coins</b>.` },
  ];
  const onTrack = goals.filter((g) => g.spent <= g.limit).length;

  const steps = MOOD_STEPS.map((st, i) => {
    const next = MOOD_STEPS[i + 1];
    const range = next ? (st.from === 0 ? `under ${pct(next.from)}` : `${pct(st.from)} to ${pct(next.from)}`) : `over ${pct(st.from)}`;
    return `<li><span class="mood-chip mood-${st.mood}"><span class="mood-badge">${MOOD_NAME[st.mood]}</span></span> wants ${range} of budget</li>`;
  }).join('');

  return `
    <details class="card goals fold" id="goals-card" ${open ? 'open' : ''}>
      <summary class="fold-head">
        <h2>This month's goals</h2>
        <span class="fold-count ${onTrack === goals.length ? 'pos' : onTrack === 0 ? 'neg' : ''}">${onTrack} of ${goals.length} on track</span>
      </summary>
      ${goals.map(goalRow).join('')}

      <details class="mood-rules">
        <summary>How ${name}'s mood works</summary>
        <ul class="mood-steps">${steps}</ul>
        <ul>
          <li>Only <b>wants</b> can make ${name} faint.</li>
          <li>Going over a category you chose to cut back on makes ${name} one step sadder (angry at most).</li>
          <li>Needs over plan make ${name} sad at most. Bills happen.</li>
          <li>If Hunger, Fun or Love drops under 25%, ${name} feels a bit worse. Feed, play and pet to fix it.</li>
          <li>A fresh ${name} starts every month. Past months are in Pet History.</li>
        </ul>
      </details>

      <p class="goal-main">Your main goal: <b>${esc(profile.goal)}</b>. Try <button class="link" data-view="learn">${esc(PICK_FOR_GOAL[profile.goal])}</button> in Grow Your Money.</p>
    </details>`;
}
