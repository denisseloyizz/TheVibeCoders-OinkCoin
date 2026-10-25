import { formatMoney, MOOD_STEPS, NEEDS, WANTS, type Analysis } from './budget';
import { PICK_FOR_GOAL } from './learn';
import { COINS_PER_GOAL, currentWeekWants } from './rewards';
import { t } from './i18n';
import { catLabel, goalLabel, moodLabel } from './labels';
import type { AppState, Profile } from './types';
import { esc } from './util';

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
    { title: t('Wants'), spent: a.wantsSpent, limit: a.wantsLimit, note: t("{list}. This sets {name}'s mood.", { list: esc(WANTS.map(catLabel).join(', ')), name }) },
    ...a.categories
      .filter((c) => profile.focus.includes(c.category))
      .map((c) => ({
        title: t('Cut back: {category}', { category: catLabel(c.category) }),
        spent: c.spent,
        limit: c.limit,
        note: t('20% less than usual, because you picked it in your goals. Going over makes {name} one step sadder.', { name }),
      })),
    { title: t('Needs'), spent: a.needsSpent, limit: a.needsLimit, note: t('{list}. Going over makes {name} sad, never worse.', { list: esc([...NEEDS, 'Other' as const].map(catLabel).join(', ')), name }) },
    { title: t('This week'), spent: week.spent, limit: week.limit, note: t('Wants this week. Stay under to earn <b>+{n} coins</b> when the week ends.', { n: COINS_PER_GOAL }) },
    { title: t('Whole month'), spent: a.spent, limit: profile.budget, note: t('Finish under your budget with wants on budget to earn <b>+{n} coins</b>.', { n: COINS_PER_GOAL }) },
  ];
  const onTrack = goals.filter((g) => g.spent <= g.limit).length;

  const steps = MOOD_STEPS.map((st, i) => {
    const next = MOOD_STEPS[i + 1];
    const range = next ? (st.from === 0 ? t('under {pct}', { pct: pct(next.from) }) : t('{from} to {to}', { from: pct(st.from), to: pct(next.from) })) : t('over {pct}', { pct: pct(st.from) });
    return `<li><span class="mood-chip mood-${st.mood}"><span class="mood-badge">${moodLabel(st.mood)}</span></span> ${t('wants {range} of budget', { range })}</li>`;
  }).join('');

  return `
    <details class="card goals fold" id="goals-card" ${open ? 'open' : ''}>
      <summary class="fold-head">
        <h2>${t("This month's goals")}</h2>
        <span class="fold-count ${onTrack === goals.length ? 'pos' : onTrack === 0 ? 'neg' : ''}">${t('{done} of {total} on track', { done: onTrack, total: goals.length })}</span>
      </summary>
      ${goals.map(goalRow).join('')}

      <details class="mood-rules">
        <summary>${t("How {name}'s mood works", { name })}</summary>
        <ul class="mood-steps">${steps}</ul>
        <ul>
          <li>${t('Only <b>wants</b> can make {name} faint.', { name })}</li>
          <li>${t('Going over a category you chose to cut back on makes {name} one step sadder (angry at most).', { name })}</li>
          <li>${t('Needs over plan make {name} sad at most. Bills happen.', { name })}</li>
          <li>${t('If Hunger, Fun or Love drops under 25%, {name} feels a bit worse. Feed, play and pet to fix it.', { name })}</li>
          <li>${t('A fresh {name} starts every month. Past months are in Pet History.', { name })}</li>
        </ul>
      </details>

      <p class="goal-main">${t('Your main goal: <b>{goal}</b>. Try <button class="link" data-view="learn">{pick}</button> in Grow Your Money.', { goal: esc(goalLabel(profile.goal)), pick: esc(t(PICK_FOR_GOAL[profile.goal])) })}</p>
    </details>`;
}
