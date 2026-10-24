import { formatMoney, MOOD_STEPS, NEEDS, WANTS, type Analysis } from './budget';
import { PICK_FOR_GOAL } from './learn';
import { COINS_PER_GOAL, currentWeekWants } from './rewards';
import type { AppState, Mood, Profile } from './types';
import { esc } from './util';

const MOOD_NAME: Record<Mood, string> = { happy: 'Happy', okay: 'Okay', sad: 'Sad', angry: 'Angry', dead: 'Fainted' };

function goalRow(title: string, spent: number, limit: number, note: string): string {
  const ratio = limit > 0 ? spent / limit : spent > 0 ? Infinity : 0;
  const state = ratio > 1 ? 'over' : ratio >= 0.8 ? 'warn' : 'ok';
  return `
    <div class="goal-row ${state}">
      <div class="goal-head">
        <strong>${esc(title)}</strong>
        <span class="${ratio > 1 ? 'neg' : ''}">${formatMoney(spent)} / ${formatMoney(limit)}</span>
      </div>
      <div class="bar"><div class="fill ${state}" style="width:${Math.min(100, Math.round(ratio * 100))}%"></div></div>
      <small>${note}</small>
    </div>`;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;

/** This month's targets, what each one does, and how the buddy's mood is decided. */
export function renderGoals(state: AppState, profile: Profile, a: Analysis): string {
  const name = esc(profile.name);
  const week = currentWeekWants(state);
  const focusRows = a.categories
    .filter((c) => profile.focus.includes(c.category))
    .map((c) => goalRow(`Cut back on ${c.category}`, c.spent, c.limit, `20% less than usual, because you picked it in your goals. Going over makes ${name} one step sadder.`));

  const steps = MOOD_STEPS.map((st, i) => {
    const next = MOOD_STEPS[i + 1];
    const range = next ? (st.from === 0 ? `under ${pct(next.from)}` : `${pct(st.from)} to ${pct(next.from)}`) : `over ${pct(st.from)}`;
    return `<li><span class="mood-chip mood-${st.mood}"><span class="mood-badge">${MOOD_NAME[st.mood]}</span></span> wants ${range} of budget</li>`;
  }).join('');

  return `
    <section class="card goals">
      <h2>This month's goals</h2>
      ${goalRow('Keep wants on budget', a.wantsSpent, a.wantsLimit, `${esc(WANTS.join(', '))}. This sets ${name}'s mood.`)}
      ${focusRows.join('')}
      ${goalRow('Keep needs on plan', a.needsSpent, a.needsLimit, `${esc([...NEEDS, 'Other'].join(', '))}. Going over makes ${name} sad, never worse.`)}
      ${goalRow("This week's wants", week.spent, week.limit, `Stay under to earn <b>+${COINS_PER_GOAL} coins</b> when the week ends.`)}
      ${goalRow('Whole month', a.spent, profile.budget, `Finish under your budget with wants on budget to earn <b>+${COINS_PER_GOAL} coins</b>.`)}

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
    </section>`;
}
