import { formatMoney, isWant, NEEDS, WANTS, type Analysis } from './budget';
import { getLang, t, T, tp } from './i18n';
import { catLabel, goalLabel } from './labels';
import { cutOne, forecast, LEVERS, LUMPY } from './predict';
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

export const SUGGESTIONS = [T('What is my balance?'), T('How much is left?'), T('Will I stay on budget?'), T('What if I cut coffee in half?'), T('Where am I overspending?'), T('Give me a saving tip')];

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
    T('New month, new me. Your wallet and I are totally on the same page. Probably.'),
    T('Zero spent so far. Screenshot this, it will not last.'),
    T('Blank slate! Add an expense or sync your bank before I fall asleep.'),
    T('Day one energy. Let us see how long the good vibes last.'),
  ],
  comfy: [
    T('You still have {left}. Who are you and what did you do with the DoorDash addict?'),
    T('Only {pct}% used. Financially, you are the main character right now.'),
    T('Look at that wallet glow. Maybe put some in savings before it gets ideas?'),
    T('Barely touched the budget. Your future self just sent a thank you text.'),
  ],
  steady: [
    T('{pct}% gone already? Cute. Let us pace ourselves, champ.'),
    T('{left} left. That is a lot of iced coffees or exactly one bad decision.'),
    T('We are in the middle zone. One more Amazon box and I will start sweating.'),
    T('You are doing fine, but I am watching the boba budget.'),
  ],
  tight: [
    T('Only {left} left. Time to learn to love instant ramen again.'),
    T('{pct}% used. Whatever is in your cart, the cart can wait.'),
    T('My curly tail is shaking. Does this really need free two day shipping?'),
    T('Tight month. Say it with me: "I will make coffee at home."'),
    T('Only {left} left. Can you survive on dining hall food? Asking for a pig.'),
  ],
  over: [
    T('You are {over} over budget. I am not mad, I am just disappointed. Okay I am a little mad.'),
    T('Over by {over}. Please step away from the checkout button.'),
    T('{over} over. That is a lot of oat milk lattes, my friend.'),
    T('The budget has left the chat. You are {over} past it. Call Venmo, call mom, call someone.'),
  ],
};

const MOOD_LINES: Partial<Record<Mood, string[]>> = {
  sad: [
    T('I am sad. The wants are eating into my snack fund.'),
    T('Sniff. I saw that third coffee today. I said nothing. I felt everything.'),
    T('Remember when we had savings? Me neither.'),
  ],
  angry: [
    T('GRRR! Another delivery fee?! I can cook! Well, I can try!'),
    T('I am a pig with a plan and you are NOT following it!'),
    T('Put the card down. Slowly. Nobody gets hurt.'),
  ],
  dead: [
    T('x_x I am gone. Tell my snack fund I loved it.'),
    T('*faints dramatically* Revive me by skipping the next impulse buy.'),
    T('Cause of death: too many weekend trips and a coffee a day.'),
  ],
};

function fill(text: string, { a }: ChatContext): string {
  return text
    .replace(/\{left\}/g, formatMoney(Math.max(0, roundCents(a.remaining))))
    .replace(/\{over\}/g, formatMoney(Math.max(0, -roundCents(a.remaining))))
    .replace(/\{pct\}/g, String(Math.round(a.usage * 100)));
}

/** A short line for the speech bubble, chosen by mood first, then by how much money is left. */
export function buddyPhrase(c: ChatContext): string {
  const tier = moneyTier(c.a, c.profile.budget);
  const moody = MOOD_LINES[c.mood];
  const pool = moody && tier !== 'fresh' ? [...moody, ...PHRASES[tier]] : PHRASES[tier];
  return fill(t(pick(pool)), c);
}

const ALIASES: Record<Category, RegExp> = {
  Shopping: /shop|clothes|amazon|online order|compras|\bropa\b/,
  'Food & Dining': /food|dining|restaurant|\beat|takeout|coffee|dinner|lunch|comida|cafe\b|cenar|\bcomer\b|desayun/,
  Entertainment: /entertain|movie|game|netflix|subscription|concert|fun money|entretenimiento|pelicula|juegos?\b|\bcine\b|suscripcion/,
  Transport: /transport|\bgas(oline)?\b|uber|lyft|\bbus(es)?\b|train|commute|car\b|gasolina|camion|\bmetro\b|\btaxi\b|\bdidi\b/,
  Bills: /bill|rent|utilit|phone|internet|insurance|servicios|recibos|telefono|seguro/,
  Groceries: /grocer|supermarket|\bsuper\b|supermercado|despensa/,
  Health: /health|doctor|medic|pharmac|salud|farmacia/,
  Other: /\bother\b|\botros?\b/,
};

const has = (q: string, re: RegExp) => re.test(q);

/** Lowercase, no accents, no Spanish question or exclamation marks, so one set of patterns reads both languages. */
const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\u00bf\u00a1]/g, '').trim();

/** Whole dollars read better in a chat bubble. */
const whole = (n: number) => formatMoney(Math.round(n)).replace(/\.00$/, '');

const LEVER_WORDS: Record<string, RegExp> = {
  coffee: /coffee|latte|starbucks|dunkin|boba|espresso|\bcafes?\b|cafeteria/,
  delivery: /deliver|doordash|uber ?eats|grubhub|domicilio|rappi|didi ?food/,
  dining: /dining|restaurant|eat(ing)? out|takeout|comer fuera|salir a comer|fuera de casa/,
  shopping: /shop|amazon|clothes|online order|compras|\bropa\b/,
  fun: /entertain|concert|netflix|streaming|subscription|movie|game|entretenimiento|pelicula|juegos?\b|suscripcion|\bcine\b/,
  trips: /trip|travel|vacation|flight|hotel|cabo|spring break|viaje|vacaciones|vuelo|boleto de avion|\bviajar\b/,
};

/** "cut coffee in half" -> 50, "stop doordash" -> 100, "reduce shopping by 30%" -> 30. Also in Spanish. */
function cutPercent(q: string): number {
  const n = q.match(/(\d{1,3})\s*(%|por ciento)/);
  if (n) return Math.min(100, Number(n[1]));
  if (has(q, /half|mitad/)) return 50;
  if (has(q, /third|tercio|tercera parte/)) return 33;
  if (has(q, /stop|quit|skip|ditch|no more|give up|drop|cancel|zero|none|dejar de|\bdejo\b|\bdeja\b|\bquito\b|elimino|\bya no\b|\bsin\b|\bcero\b|cancelo|\bnada\b/)) return 100;
  return 50;
}

function categoryAnswer(cat: Category, c: ChatContext): string {
  const stat = c.a.categories.find((x) => x.category === cat)!;
  const kind = isWant(cat) ? t('a want') : t('a need');
  const label = catLabel(cat);
  if (stat.limit <= 0) return t('{cat} ({kind}): {spent} spent this month. You have not set a limit for it.', { cat: label, kind, spent: formatMoney(stat.spent) });
  const left = stat.limit - stat.spent;
  return left >= 0
    ? t('{cat} ({kind}): {spent} of {limit} used, so {left} left.', { cat: label, kind, spent: formatMoney(stat.spent), limit: formatMoney(stat.limit), left: formatMoney(left) })
    : t('{cat} ({kind}): {spent} spent, which is {over} over your {limit} limit.', { cat: label, kind, spent: formatMoney(stat.spent), over: formatMoney(-left), limit: formatMoney(stat.limit) });
}

const SAVING_TIPS = [
  T('Pay yourself first. Move a little to savings the day money lands, before the vending machine finds it.'),
  T('The 48 hour rule: wait two days before any non essential buy. Half the time you forget why you wanted it.'),
  T('Pause the streaming service you have not opened since finals. Share one with roommates instead.'),
  T('Build a $500 to $1,000 emergency fund first, then work toward 3 months of needs. Surprise car repairs love broke students.'),
  T('Cook at home a few more nights. Your ramen game could use a glow up anyway.'),
  T('Use your student discount. Ask everywhere, the worst they say is no.'),
  T('Buy used textbooks or rent them. Your back and your wallet will thank you.'),
  T('Make coffee at home three days a week. A $6 latte a day is about $1,800 a year.'),
];

/** Topics that have their own answer, so a Spanish "me recomiendas invertir?" is not taken for a saving tip. */
const TOPIC_ES = /fondo de emergencia|emergencia|invertir|inversion|inversiones|afore|retiro|historial crediticio|buro|\bscore\b|deuda|tarjeta de credito|prestamo/;

/** Answers a typed question from the user's own numbers. Never gives product or investment advice. */
export function reply(question: string, c: ChatContext): string {
  const q = normalize(question);
  const es = getLang() === 'es';
  const { a, profile, state } = c;
  const remaining = roundCents(a.remaining);
  const name = profile.name;
  if (!q) return t('Oink? Say something! Ask about your balance, spending, or budget.');

  const lever = LEVERS.find((l) => has(q, LEVER_WORDS[l.id]));
  if (lever && has(q, /\b(cut|skip|stop|quit|reduce|less|half|save|drop|ditch|give up|cancel|what if|if i)\b|\b(recort|reduc|dej|quit|elimin|cancel|ahorr|mitad|menos|tercio|y si|que pasa si|ya no|sin|bajar|baj)/)) {
    const f = forecast(state, profile);
    const pct = cutPercent(q);
    const r = cutOne(f, lever.id, pct);
    const label = t(lever.label);
    if (r.baseline < 1) return t('I do not see any {label} spending this month, so there is nothing to cut. Suspiciously disciplined.', { label: label.toLowerCase() });
    if (LUMPY.has(lever.id)) {
      const part = pct === 100 ? t('all of it') : t('{pct}% of it', { pct });
      return t('You have spent {baseline} on {label} this month. Skipping {part} keeps {monthly}. If you did that every month it would be {yearly} a year, but trips are usually a once in a while thing. Try the Forecast page.', {
        baseline: whole(r.baseline),
        label: label.toLowerCase(),
        part,
        monthly: whole(r.monthly),
        yearly: whole(r.yearly),
      });
    }
    return t('Cutting {label} by {pct}% keeps about {monthly} a month. That is {yearly} a year, or roughly {five} in 5 years in a 4% savings account. Play with it on the Forecast page.', {
      label,
      pct,
      monthly: whole(r.monthly),
      yearly: whole(r.yearly),
      five: whole(r.fiveYears),
    });
  }
  if (lever && has(q, /spend|spent|how much|how many|cost|gast|cuanto|costo/)) {
    const f = forecast(state, profile);
    const n = f.counts[lever.id] ?? 0;
    const label = t(lever.label);
    if (n === 0) return t('Zero on {label} this month. Who are you?', { label: label.toLowerCase() });
    const pace = LUMPY.has(lever.id) ? '' : t(', on pace for about {amount}', { amount: whole(f.byBucket[lever.id]) });
    return tp('{label}: {amount} across {n} purchase so far this month{pace}', '{label}: {amount} across {n} purchases so far this month{pace}', n, { label, amount: whole(f.soFar[lever.id]), pace });
  }
  if (has(q, /forecast|predict|projection|project|end of (the )?month|on pace|on track|stay on budget|go over|run out|finish the month|pronostic|proyeccion|prediccion|a este ritmo|fin de mes|final del mes|me voy a pasar|voy a pasar|voy bien|dentro (del|de mi|de tu) presupuesto|terminar el mes|acabar el mes|me quedo sin|se me acaba/)) {
    const f = forecast(state, profile);
    if (f.spent === 0) return t('No spending yet, so nothing to forecast. Add some expenses and ask me again!');
    const diff = f.projected - f.budget;
    if (f.remaining <= 0) return t('You have already used your {budget} budget with {days} days left, and at this pace you will end near {projected}. Every day from here should be a no spend day.', { budget: whole(f.budget), days: f.daysLeft, projected: whole(f.projected) });
    return diff > 0
      ? t('At this pace you will spend about {projected} this month, which is {diff} over your {budget} budget. Keep it under {perDay} a day to still make it.', { projected: whole(f.projected), diff: whole(diff), budget: whole(f.budget), perDay: whole(f.safePerDay) })
      : t('At this pace you finish near {projected}, about {diff} under your {budget} budget. Nice. You can spend up to {perDay} a day.', { projected: whole(f.projected), diff: whole(-diff), budget: whole(f.budget), perDay: whole(f.safePerDay) });
  }

  // Specific categories first, so "how much on food" isn't swallowed by the generic spending answer.
  const mentioned = CATEGORIES.filter((cat) => has(q, ALIASES[cat]));
  if (mentioned.length > 0 && has(q, /spend|spent|how much|left|limit|budget|over|\bon\b|gast|cuanto|queda|limite|presupuesto|sobra|falta|\ben\b/)) {
    return mentioned.map((cat) => categoryAnswer(cat, c)).join(' ');
  }

  if (has(q, /^(hi|hello|hey|oink|hola|holi|buenas|buen dia|buenos dias|que onda|que tal)\b/) || (!es && has(q, /^yo\b/)) || (es && q === 'yo')) {
    return t('Oink oink! I am {name}, your broke bestie with a curly tail. Ask me about your balance, what is left, or where your money went.', { name });
  }
  if (has(q, /roast|insult|judge|regan|carrilla|\bponme\b|insulta|critica/)) {
    const top = a.top;
    if (!top) return t('You have not spent anything, so there is nothing to roast. Suspicious. Are you even a college student?');
    const cat = catLabel(top.category);
    const lines = [
      t('{amount} on {cat} this month. Your wallet is filing for emotional damages.', { amount: formatMoney(top.spent), cat }),
      t('{cat} is your biggest category at {amount}. That is not a personality, that is a habit.', { amount: formatMoney(top.spent), cat }),
      t('Spent {amount} so far. Bold of you to open this app.', { amount: formatMoney(a.spent) }),
    ];
    return pick(lines);
  }
  if (has(q, /joke|funny|make me laugh|chiste|broma|hazme reir|haz(me)? reir|algo gracioso/)) {
    return t(
      pick([
        T('Why did the student bring a ladder to the bank? To reach the high interest rates.'),
        T('What do you call a pig with no money? Bacon on a budget.'),
        T('My savings account and my sleep schedule have one thing in common: both are a myth.'),
        T('I told my wallet a joke. It did not laugh. It had no cash.'),
      ]),
    );
  }
  if (has(q, /thank|thx|nice|good (job|boy|girl|oink)|gracias|chido|buen trabajo|buen cerdito|buen puerquito|eres el mejor/)) {
    return t(pick([T('Anytime! Staying on budget is the real flex.'), T('Oink! I accept payment in snacks.'), T('You are doing great. Keep going, I believe in you and your wallet.')]));
  }
  if (has(q, /help|what can (you|i)|commands?|ayuda|ayudame|que puedes|que sabes|que haces|puedes hacer|comandos/)) {
    return t('Try: "What is my balance?", "How much is left?", "How much did I spend on food?", "Where am I overspending?", "Wants vs needs", "Give me a saving tip", or if you are brave, "Roast me".');
  }
  if (has(q, /how are you|how do you feel|mood|feeling|como estas|como te sientes|como andas|estado de animo|como te va/)) {
    return c.mood === 'happy' || c.mood === 'okay'
      ? t('I feel {feeling}. {message}', { feeling: c.mood === 'happy' ? t('amazing, like free pizza on campus') : t('okay, like a Tuesday'), message: a.message })
      : a.message;
  }

  if (has(q, /balance|account|bank|how much (money )?do i have|saldo|\bcuentas?\b|banco|cuanto (dinero )?tengo|cuanta lana tengo|cuanto hay en/)) {
    const total = bankBalance(state);
    if (total === null) {
      const month =
        remaining >= 0
          ? t('{amount} left of your {budget} budget', { amount: formatMoney(remaining), budget: formatMoney(profile.budget) })
          : t('gone {amount} over your {budget} budget', { amount: formatMoney(-remaining), budget: formatMoney(profile.budget) });
      return t('No bank is linked, so I cannot peek at your balance. I am a pig, not a wizard. This month you have {month}. Link a bank in Profile & Settings to see real balances.', { month });
    }
    const lines = (state.bank?.accounts ?? []).filter((x) => x.balance !== null).map((x) => `${x.name}${x.mask ? ` ****${x.mask}` : ''}: ${formatMoney(x.balance ?? 0)}`);
    return t('Checking and savings add up to {total}. {lines}.', { total: formatMoney(total), lines: lines.join('. ') });
  }

  if (has(q, /left|remain|afford|can i spend|safe to spend|queda|\bfalta\b|sobra|puedo gastar|me alcanza|disponible|restante/)) {
    return remaining >= 0
      ? t('You have {left} left of your {budget} budget this month. Wants have {room} of room.', { left: formatMoney(remaining), budget: formatMoney(profile.budget), room: formatMoney(Math.max(0, a.wantsLimit - a.wantsSpent)) })
      : t('You are {over} over your {budget} budget. Hold off on wants for now. Yes, even the boba.', { over: formatMoney(-remaining), budget: formatMoney(profile.budget) });
  }

  if (has(q, /want|need|\bgustos?\b|necesidad|\bcapricho/)) {
    return t('Needs ({needs}): {needsSpent}. Wants ({wants}): {wantsSpent} of {wantsLimit}. Only wants change my mood.', {
      needs: NEEDS.map(catLabel).join(', '),
      needsSpent: formatMoney(a.needsSpent),
      wants: WANTS.map(catLabel).join(', '),
      wantsSpent: formatMoney(a.wantsSpent),
      wantsLimit: formatMoney(a.wantsLimit),
    });
  }

  if (has(q, /overspend|too much|biggest|top|most|worst|where.*(money|go)|de mas|demasiado|mayor gasto|gasto mayor|mas gasto|peor|donde (se va|se fue|va)|en que (estoy )?gast|en que se me va/)) {
    if (!a.top) return t('Nothing spent yet this month, so I have nothing to roast. Enjoy it while it lasts!');
    const over = a.categories.filter((x) => x.limit > 0 && x.ratio > 1);
    const head = t('Your biggest category is {cat} at {amount}.', { cat: catLabel(a.top.category), amount: formatMoney(a.top.spent) });
    return over.length > 0
      ? `${head} ${t('Over limit: {list}.', { list: over.map((x) => `${catLabel(x.category)} (+${formatMoney(x.spent - x.limit)})`).join(', ') })}${a.tip ? ` ${t('Tip: {tip}', { tip: a.tip })}` : ''}`
      : `${head} ${t('Nothing is over its limit. Who raised you?')}`;
  }

  if (has(q, /spend|spent|spending|cost|gast|costo|cuanto he/)) {
    return t('This month you have spent {spent} of {budget} ({pct}%).', { spent: formatMoney(a.spent), budget: formatMoney(profile.budget), pct: Math.round(a.usage * 100) });
  }

  if (has(q, /budget|limit|presupuesto|limite/)) {
    return t('Your monthly budget is {budget}. Your goal is "{goal}". You can change both in Profile & Settings.', { budget: formatMoney(profile.budget), goal: goalLabel(profile.goal) });
  }

  if (has(q, /save|saving|tip|advice|idea|cut back|ahorr|consejo|\btips?\b|recomend|recomiend|sugerencia/) && !(es && has(q, TOPIC_ES))) {
    return `${t(pick(SAVING_TIPS))}${a.tip ? ` ${t('For you right now: {tip}', { tip: a.tip })}` : ''}`;
  }

  if (has(q, /debt|credit card|loan|deuda|tarjeta de credito|prestamo/)) {
    return t('For debt, pay every minimum, then send extra to the highest interest balance first (avalanche) or the smallest balance first (snowball). Pick whichever you will actually stick with. Student loans are a marathon, not a sprint.');
  }
  if (has(q, /emergency|emergencia/)) {
    return t('An emergency fund covers surprises like car repairs. Start with $500 to $1,000, then build toward 3 months of needs. It is the "my laptop just died" fund.');
  }
  if (has(q, /invest|stock|crypto|401|retire|invertir|inversion|afore|retiro|cripto|acciones/)) {
    return t('I am a budgeting pig, not an advisor, so I will not pick investments. A good order is: emergency fund, pay off high interest debt, then ask a licensed professional about investing. Your meme coin is not on that list. Check out Grow Your Money in the menu.');
  }
  if (has(q, /credit score|historial crediticio|buro|\bscore\b/)) {
    return t('Pay on time, keep card balances low compared to your limit, and avoid opening many new accounts at once. Those matter most for a credit score. Yes, that store card for 15% off counts.');
  }

  return t(
    pick([
      T('Oink? I did not catch that. I am great with money and terrible with everything else. Try "How much is left?".'),
      T('I only know about your money, sorry. Ask about your balance, budget, categories, or saving tips. Not your ex.'),
      T('That went over my snout. Try asking about your balance, spending, or say "roast me".'),
    ]),
  );
}
