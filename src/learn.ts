import { formatMoney, type Analysis } from './budget';
import type { Goal, Profile } from './types';
import { esc } from './util';

interface Lesson {
  title: string;
  body: string;
}

const SECTIONS: { title: string; intro: string; lessons: Lesson[] }[] = [
  {
    title: 'Saving methods',
    intro: 'Simple systems that make saving automatic.',
    lessons: [
      { title: '50/30/20 rule', body: 'Split your take-home pay: 50% needs, 30% wants, 20% savings and debt. OinkCoin already tracks needs vs. wants for you.' },
      { title: 'Pay yourself first', body: 'Set up an automatic transfer to savings on payday, before you can spend it. Even $25 a paycheck adds up.' },
      { title: 'Envelope (cash stuffing) method', body: "Give each want category a fixed amount in a cash or digital envelope. When it's empty, you're done for the month." },
      { title: 'No-spend challenge', body: 'Pick a week or weekend where you only pay for needs. Great for resetting shopping and dining habits.' },
      { title: '52-week challenge', body: "Save $1 in week 1, $2 in week 2, and so on. By week 52 you'll have $1,378." },
      { title: 'Round-ups', body: 'Round every purchase up to the next dollar and move the difference to savings. Many banks can do this automatically.' },
    ],
  },
  {
    title: 'Paying off debt',
    intro: 'Two proven ways to get out of debt faster.',
    lessons: [
      { title: 'Avalanche method', body: 'Pay the minimum on everything, then put every extra dollar toward the highest-interest debt. Saves the most money overall.' },
      { title: 'Snowball method', body: 'Pay the minimum on everything, then attack the smallest balance first. Quick wins keep you motivated.' },
    ],
  },
  {
    title: 'How to start investing',
    intro: 'Follow these steps in order.',
    lessons: [
      { title: '1. Build an emergency fund', body: 'Before investing, save 3-6 months of essential expenses in a high-yield savings account.' },
      { title: '2. Pay off high-interest debt', body: 'Credit cards often charge 20%+ interest. Paying them off is a guaranteed return no investment can match.' },
      { title: '3. Get your employer match', body: "If your job offers a 401(k) match, contribute at least enough to get it. It's free money." },
      { title: '4. Open a Roth IRA', body: 'Your money grows tax-free and can be withdrawn tax-free in retirement. Many brokers let you start with $0.' },
      { title: '5. Pick low-cost index funds', body: 'Index funds and ETFs spread your money across hundreds of companies with low fees. Diversifying lowers your risk.' },
      { title: '6. Invest regularly', body: 'Invest the same amount every month no matter what the market does (dollar-cost averaging). Time in the market beats timing the market.' },
    ],
  },
];

export const PICK_FOR_GOAL: Record<Goal, string> = {
  'Save more money': 'Pay yourself first',
  'Stop impulse buying': 'No-spend challenge',
  'Pay off debt': 'Avalanche method',
  'Just track my spending': '50/30/20 rule',
};

export function renderLearn(profile: Profile, now: Analysis): string {
  const pick = PICK_FOR_GOAL[profile.goal];
  const monthlyCut = now.wantsSpent * 0.2;

  return `
    <section class="card learn-hero">
      <h2>Grow your money</h2>
      <p>Your goal is <strong>${esc(profile.goal.toLowerCase())}</strong>. A good place to start: <strong>${esc(pick)}</strong>.</p>
      ${
        monthlyCut > 0
          ? `<p class="projection">Cutting your wants by 20% (${formatMoney(monthlyCut)}/month) would save <strong>${formatMoney(monthlyCut * 12)}</strong> in a year.</p>`
          : ''
      }
    </section>
    ${SECTIONS.map(
      (s) => `
      <section class="card">
        <h2>${esc(s.title)}</h2>
        <p class="hint">${esc(s.intro)}</p>
        ${s.lessons
          .map(
            (l) => `
          <details class="lesson"${l.title === pick ? ' open' : ''}>
            <summary>${esc(l.title)}${l.title === pick ? '<span class="tag want">For you</span>' : ''}</summary>
            <p>${esc(l.body)}</p>
          </details>`,
          )
          .join('')}
      </section>`,
    ).join('')}
    <p class="disclaimer">For education only, not financial advice.</p>`;
}
