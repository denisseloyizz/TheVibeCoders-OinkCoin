import { formatMoney, isWant, NEEDS, WANTS, type Analysis } from './budget';
import { CATEGORIES, type AppState, type Category, type Mood, type Profile } from './types';

// The buddy's speech bubble and chat. Everything here runs on the user's own numbers on the device:
// no network, no AI service. Replies come from simple keyword matching, so they stay predictable.

export interface ChatContext {
  profile: Profile;
  state: AppState;
  a: Analysis;
  mood: Mood;
}

export interface ChatMessage {
  from: 'you' | 'oink';
  text: string;
}

export const SUGGESTIONS = ['What is my balance?', 'How much is left?', 'Where am I overspending?', 'Give me a saving tip'];

type Tier = 'fresh' | 'comfy' | 'steady' | 'tight' | 'over';

/** How the month is going, judged by the whole budget (what's left to spend). */
const roundCents = (n: number) => Math.round(n * 100) / 100 + 0; // + 0 turns -0 into 0

export function moneyTier(a: Analysis, budget: number): Tier {
  if (a.spent === 0) return 'fresh';
  if (roundCents(a.remaining) < 0) return 'over';
  if (budget > 0 && a.usage >= 0.8) return 'tight';
  if (budget > 0 && a.usage >= 0.5) return 'steady';
  return 'comfy';
}

/** Linked bank balance, counting only checking and savings so a credit card doesn't skew it. */
export function bankBalance(state: AppState): number | null {
  const accounts = state.bank?.accounts.filter((x) => x.balance !== null && /depository|checking|savings/i.test(x.type)) ?? [];
  return accounts.length > 0 ? accounts.reduce((s, x) => s + (x.balance ?? 0), 0) : null;
}

const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)];

// The buddy speaks in the first person. {left}, {over} and {pct} are filled in from the month's numbers.
const PHRASES: Record<Tier, string[]> = {
  fresh: [
    'New month, new me. Your wallet and I are totally on the same page. Probably.',
    'Zero spent so far. Screenshot this, it will not last.',
    'Blank slate! Add an expense or sync your bank before I fall asleep.',
    'Day one energy. Let us see how long the good vibes last.',
  ],
  comfy: [
    'You still have {left}. Who are you and what did you do with the DoorDash addict?',
    'Only {pct}% used. Financially, you are the main character right now.',
    'Look at that wallet glow. Maybe put some in savings before it gets ideas?',
    'Barely touched the budget. Your future self just sent a thank you text.',
  ],
  steady: [
    '{pct}% gone already? Cute. Let us pace ourselves, champ.',
    '{left} left. That is a lot of iced coffees or exactly one bad decision.',
    'We are in the middle zone. One more Amazon box and I will start sweating.',
    'You are doing fine, but I am watching the boba budget.',
  ],
  tight: [
    'Only {left} left. Time to learn to love instant ramen again.',
    '{pct}% used. Whatever is in your cart, the cart can wait.',
    'My curly tail is shaking. Does this really need free two day shipping?',
    'Tight month. Say it with me: "I will make coffee at home."',
    'Only {left} left. Can you survive on dining hall food? Asking for a pig.',
  ],
  over: [
    'You are {over} over budget. I am not mad, I am just disappointed. Okay I am a little mad.',
    'Over by {over}. Please step away from the checkout button.',
    '{over} over. That is a lot of oat milk lattes, my friend.',
    'The budget has left the chat. You are {over} past it. Call Venmo, call mom, call someone.',
  ],
};

const MOOD_LINES: Partial<Record<Mood, string[]>> = {
  sad: [
    'I am sad. The wants are eating into my snack fund.',
    'Sniff. I saw that third coffee today. I said nothing. I felt everything.',
    'Remember when we had savings? Me neither.',
  ],
  angry: [
    'GRRR! Another delivery fee?! I can cook! Well, I can try!',
    'I am a pig with a plan and you are NOT following it!',
    'Put the card down. Slowly. Nobody gets hurt.',
  ],
  dead: [
    'x_x I am gone. Tell my snack fund I loved it.',
    '*faints dramatically* Revive me by skipping the next impulse buy.',
    'Cause of death: too many weekend trips and a coffee a day.',
  ],
};

function fill(text: string, { a }: ChatContext): string {
  return text
    .replace('{left}', formatMoney(Math.max(0, roundCents(a.remaining))))
    .replace('{over}', formatMoney(Math.max(0, -roundCents(a.remaining))))
    .replace('{pct}', String(Math.round(a.usage * 100)));
}

/** A short line for the speech bubble, chosen by mood first, then by how much money is left. */
export function buddyPhrase(c: ChatContext): string {
  const tier = moneyTier(c.a, c.profile.budget);
  const moody = MOOD_LINES[c.mood];
  const pool = moody && tier !== 'fresh' ? [...moody, ...PHRASES[tier]] : PHRASES[tier];
  return fill(pick(pool), c);
}

const ALIASES: Record<Category, RegExp> = {
  Shopping: /shop|clothes|amazon|online order/,
  'Food & Dining': /food|dining|restaurant|eat|takeout|coffee|dinner|lunch/,
  Entertainment: /entertain|movie|game|netflix|subscription|concert|fun money/,
  Transport: /transport|gas|uber|lyft|bus|train|commute|car\b/,
  Bills: /bill|rent|utilit|phone|internet|insurance/,
  Groceries: /grocer|supermarket/,
  Health: /health|doctor|medic|pharmac/,
  Other: /\bother\b/,
};

const has = (q: string, re: RegExp) => re.test(q);

function categoryAnswer(cat: Category, c: ChatContext): string {
  const stat = c.a.categories.find((x) => x.category === cat)!;
  const kind = isWant(cat) ? 'a want' : 'a need';
  if (stat.limit <= 0) return `${cat} (${kind}): ${formatMoney(stat.spent)} spent this month. You have not set a limit for it.`;
  const left = stat.limit - stat.spent;
  return left >= 0
    ? `${cat} (${kind}): ${formatMoney(stat.spent)} of ${formatMoney(stat.limit)} used, so ${formatMoney(left)} left.`
    : `${cat} (${kind}): ${formatMoney(stat.spent)} spent, which is ${formatMoney(-left)} over your ${formatMoney(stat.limit)} limit.`;
}

const SAVING_TIPS = [
  'Pay yourself first. Move a little to savings the day money lands, before the vending machine finds it.',
  'The 48 hour rule: wait two days before any non essential buy. Half the time you forget why you wanted it.',
  'Pause the streaming service you have not opened since finals. Share one with roommates instead.',
  'Build a $500 to $1,000 emergency fund first, then work toward 3 months of needs. Surprise car repairs love broke students.',
  'Cook at home a few more nights. Your ramen game could use a glow up anyway.',
  'Use your student discount. Ask everywhere, the worst they say is no.',
  'Buy used textbooks or rent them. Your back and your wallet will thank you.',
  'Make coffee at home three days a week. A $6 latte a day is about $1,800 a year.',
];

/** Answers a typed question from the user's own numbers. Never gives product or investment advice. */
export function reply(question: string, c: ChatContext): string {
  const q = question.toLowerCase().trim();
  const { a, profile, state } = c;
  const remaining = roundCents(a.remaining);
  const name = profile.name;
  if (!q) return 'Oink? Say something! Ask about your balance, spending, or budget.';

  // Specific categories first, so "how much on food" isn't swallowed by the generic spending answer.
  const mentioned = CATEGORIES.filter((cat) => has(q, ALIASES[cat]));
  if (mentioned.length > 0 && has(q, /spend|spent|how much|left|limit|budget|over|\bon\b/)) {
    return mentioned.map((cat) => categoryAnswer(cat, c)).join(' ');
  }

  if (has(q, /^(hi|hello|hey|yo|oink)\b/)) return `Oink oink! I am ${name}, your broke bestie with a curly tail. Ask me about your balance, what is left, or where your money went.`;
  if (has(q, /roast|insult|judge/)) {
    const top = a.top;
    if (!top) return 'You have not spent anything, so there is nothing to roast. Suspicious. Are you even a college student?';
    const lines = [
      `${formatMoney(top.spent)} on ${top.category} this month. Your wallet is filing for emotional damages.`,
      `${top.category} is your biggest category at ${formatMoney(top.spent)}. That is not a personality, that is a habit.`,
      `Spent ${formatMoney(a.spent)} so far. Bold of you to open this app.`,
    ];
    return pick(lines);
  }
  if (has(q, /joke|funny|make me laugh/)) {
    return pick([
      'Why did the student bring a ladder to the bank? To reach the high interest rates.',
      'What do you call a pig with no money? Bacon on a budget.',
      'My savings account and my sleep schedule have one thing in common: both are a myth.',
      'I told my wallet a joke. It did not laugh. It had no cash.',
    ]);
  }
  if (has(q, /thank|thx|nice|good (job|boy|girl|oink)/)) return pick(['Anytime! Staying on budget is the real flex.', 'Oink! I accept payment in snacks.', 'You are doing great. Keep going, I believe in you and your wallet.']);
  if (has(q, /help|what can (you|i)|commands?/)) {
    return 'Try: "What is my balance?", "How much is left?", "How much did I spend on food?", "Where am I overspending?", "Wants vs needs", "Give me a saving tip", or if you are brave, "Roast me".';
  }
  if (has(q, /how are you|how do you feel|mood|feeling/)) {
    return c.mood === 'happy' || c.mood === 'okay'
      ? `I feel ${c.mood === 'happy' ? 'amazing, like free pizza on campus' : 'okay, like a Tuesday'}. ${a.message}`
      : a.message;
  }

  if (has(q, /balance|account|bank|how much (money )?do i have/)) {
    const total = bankBalance(state);
    if (total === null) {
      const month = remaining >= 0 ? `${formatMoney(remaining)} left of your ${formatMoney(profile.budget)} budget` : `gone ${formatMoney(-remaining)} over your ${formatMoney(profile.budget)} budget`;
      return `No bank is linked, so I cannot peek at your balance. I am a pig, not a wizard. This month you have ${month}. Link a bank in Profile & Settings to see real balances.`;
    }
    const lines = (state.bank?.accounts ?? []).filter((x) => x.balance !== null).map((x) => `${x.name}${x.mask ? ` ****${x.mask}` : ''}: ${formatMoney(x.balance ?? 0)}`);
    return `Checking and savings add up to ${formatMoney(total)}. ${lines.join('. ')}.`;
  }

  if (has(q, /left|remain|afford|can i spend|safe to spend/)) {
    return remaining >= 0
      ? `You have ${formatMoney(remaining)} left of your ${formatMoney(profile.budget)} budget this month. Wants have ${formatMoney(Math.max(0, a.wantsLimit - a.wantsSpent))} of room.`
      : `You are ${formatMoney(-remaining)} over your ${formatMoney(profile.budget)} budget. Hold off on wants for now. Yes, even the boba.`;
  }

  if (has(q, /want|need/)) {
    return `Needs (${NEEDS.join(', ')}): ${formatMoney(a.needsSpent)}. Wants (${WANTS.join(', ')}): ${formatMoney(a.wantsSpent)} of ${formatMoney(a.wantsLimit)}. Only wants change my mood.`;
  }

  if (has(q, /overspend|too much|biggest|top|most|worst|where.*(money|go)/)) {
    if (!a.top) return 'Nothing spent yet this month, so I have nothing to roast. Enjoy it while it lasts!';
    const over = a.categories.filter((x) => x.limit > 0 && x.ratio > 1);
    const head = `Your biggest category is ${a.top.category} at ${formatMoney(a.top.spent)}.`;
    return over.length > 0
      ? `${head} Over limit: ${over.map((x) => `${x.category} (+${formatMoney(x.spent - x.limit)})`).join(', ')}.${a.tip ? ` Tip: ${a.tip}` : ''}`
      : `${head} Nothing is over its limit. Who raised you?`;
  }

  if (has(q, /spend|spent|spending|cost/)) {
    return `This month you have spent ${formatMoney(a.spent)} of ${formatMoney(profile.budget)} (${Math.round(a.usage * 100)}%).`;
  }

  if (has(q, /budget|limit/)) {
    return `Your monthly budget is ${formatMoney(profile.budget)}. Your goal is "${profile.goal}". You can change both in Profile & Settings.`;
  }

  if (has(q, /save|saving|tip|advice|idea|cut back/)) {
    return `${pick(SAVING_TIPS)}${a.tip ? ` For you right now: ${a.tip}` : ''}`;
  }

  if (has(q, /debt|credit card|loan/)) {
    return 'For debt, pay every minimum, then send extra to the highest interest balance first (avalanche) or the smallest balance first (snowball). Pick whichever you will actually stick with. Student loans are a marathon, not a sprint.';
  }
  if (has(q, /emergency/)) {
    return 'An emergency fund covers surprises like car repairs. Start with $500 to $1,000, then build toward 3 months of needs. It is the "my laptop just died" fund.';
  }
  if (has(q, /invest|stock|crypto|401|retire/)) {
    return 'I am a budgeting pig, not an advisor, so I will not pick investments. A good order is: emergency fund, pay off high interest debt, then ask a licensed professional about investing. Your meme coin is not on that list. Check out Grow Your Money in the menu.';
  }
  if (has(q, /credit score/)) {
    return 'Pay on time, keep card balances low compared to your limit, and avoid opening many new accounts at once. Those matter most for a credit score. Yes, that store card for 15% off counts.';
  }

  return pick([
    'Oink? I did not catch that. I am great with money and terrible with everything else. Try "How much is left?".',
    'I only know about your money, sorry. Ask about your balance, budget, categories, or saving tips. Not your ex.',
    'That went over my snout. Try asking about your balance, spending, or say "roast me".',
  ]);
}
