import { formatMoney, type Analysis } from './budget';
import { t, T } from './i18n';
import { goalLabel } from './labels';
import type { Goal, Profile } from './types';
import { esc } from './util';

interface Lesson {
  title: string;
  body: string;
}

const SECTIONS: { title: string; intro: string; lessons: Lesson[] }[] = [
  {
    title: T('Saving methods'),
    intro: T('Simple systems that make saving automatic.'),
    lessons: [
      { title: T('50/30/20 rule'), body: T('Split your take-home pay: 50% needs, 30% wants, 20% savings and debt. OinkCoin already tracks needs vs. wants for you.') },
      { title: T('Pay yourself first'), body: T('Set up an automatic transfer to savings on payday, before you can spend it. Even $25 a paycheck adds up.') },
      { title: T('Envelope (cash stuffing) method'), body: T("Give each want category a fixed amount in a cash or digital envelope. When it's empty, you're done for the month.") },
      { title: T('No-spend challenge'), body: T('Pick a week or weekend where you only pay for needs. Great for resetting shopping and dining habits.') },
      { title: T('52-week challenge'), body: T("Save $1 in week 1, $2 in week 2, and so on. By week 52 you'll have $1,378.") },
      { title: T('Round-ups'), body: T('Round every purchase up to the next dollar and move the difference to savings. Many banks can do this automatically.') },
    ],
  },
  {
    title: T('Paying off debt'),
    intro: T('Two proven ways to get out of debt faster.'),
    lessons: [
      { title: T('Avalanche method'), body: T('Pay the minimum on everything, then put every extra dollar toward the highest-interest debt. Saves the most money overall.') },
      { title: T('Snowball method'), body: T('Pay the minimum on everything, then attack the smallest balance first. Quick wins keep you motivated.') },
    ],
  },
  {
    title: T('How to start investing'),
    intro: T('Follow these steps in order.'),
    lessons: [
      { title: T('1. Build an emergency fund'), body: T('Before investing, save 3-6 months of essential expenses in a high-yield savings account.') },
      { title: T('2. Pay off high-interest debt'), body: T('Credit cards often charge 20%+ interest. Paying them off is a guaranteed return no investment can match.') },
      { title: T('3. Get your employer match'), body: T("If your job offers a 401(k) match, contribute at least enough to get it. It's free money.") },
      { title: T('4. Open a Roth IRA'), body: T('Your money grows tax-free and can be withdrawn tax-free in retirement. Many brokers let you start with $0.') },
      { title: T('5. Pick low-cost index funds'), body: T('Index funds and ETFs spread your money across hundreds of companies with low fees. Diversifying lowers your risk.') },
      { title: T('6. Invest regularly'), body: T('Invest the same amount every month no matter what the market does (dollar-cost averaging). Time in the market beats timing the market.') },
    ],
  },
];

export const PICK_FOR_GOAL: Record<Goal, string> = {
  'Save more money': T('Pay yourself first'),
  'Stop impulse buying': T('No-spend challenge'),
  'Pay off debt': T('Avalanche method'),
  'Just track my spending': T('50/30/20 rule'),
};

export function renderLearn(profile: Profile, now: Analysis): string {
  const pick = PICK_FOR_GOAL[profile.goal];
  const monthlyCut = now.wantsSpent * 0.2;

  return `
    <section class="card learn-hero">
      <h2>${t('Grow your money')}</h2>
      <p>${t('Your goal is <strong>{goal}</strong>. A good place to start: <strong>{pick}</strong>.', { goal: esc(goalLabel(profile.goal).toLowerCase()), pick: esc(t(pick)) })}</p>
      ${
        monthlyCut > 0
          ? `<p class="projection">${t('Cutting your wants by 20% ({monthly}/month) would save <strong>{yearly}</strong> in a year.', { monthly: formatMoney(monthlyCut), yearly: formatMoney(monthlyCut * 12) })}</p>`
          : ''
      }
    </section>
    ${SECTIONS.map(
      (s) => `
      <section class="card">
        <h2>${esc(t(s.title))}</h2>
        <p class="hint">${esc(t(s.intro))}</p>
        ${s.lessons
          .map(
            (l) => `
          <details class="lesson"${l.title === pick ? ' open' : ''}>
            <summary>${esc(t(l.title))}${l.title === pick ? `<span class="tag want">${t('For you')}</span>` : ''}</summary>
            <p>${esc(t(l.body))}</p>
          </details>`,
          )
          .join('')}
      </section>`,
    ).join('')}
    <p class="disclaimer">${t('For education only, not financial advice.')}</p>`;
}
