import { T, t } from './i18n';

const STEPS = [
  {
    icon: '🐷',
    eyebrow: T('YOUR MONEY SIDEKICK'),
    title: T('Meet your Budget Buddy'),
    text: T('Your buddy reacts to your spending and helps make money habits feel a little more fun. Check in, give them a name, and watch them grow with you.'),
  },
  {
    icon: '🧾',
    eyebrow: T('A CLEARER PICTURE'),
    title: T('Track spending your way'),
    text: T('Add expenses as you go, upload a bank statement, or connect a bank for read-only transaction imports. Your history and report help you spot patterns.'),
  },
  {
    icon: '🎯',
    eyebrow: T('SMALL STEPS ADD UP'),
    title: T('Make a budget that fits'),
    text: T('Choose a monthly budget, set category limits, and pick a goal. Your buddy’s mood gives you a friendly nudge as you make progress.'),
  },
  {
    icon: '✨',
    eyebrow: T('LEARN AS YOU GO'),
    title: T('Grow, earn, and decorate'),
    text: T('Find bite-sized money tips in Grow Your Money. Reach goals to earn coins, then visit the Store to treat your buddy to something new.'),
  },
  {
    icon: '🏡',
    eyebrow: T('TOTALLY OPTIONAL'),
    title: T('Make it yours'),
    text: T('Visit Friends & House to decorate your buddy’s space or connect with friends. You can explore everything at your own pace from the menu.'),
  },
];

export function tutorialHtml(step: number): string {
  const current = STEPS[step];
  return `
    <div class="tutorial-backdrop">
      <section class="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" aria-describedby="tutorial-text">
        <div class="tutorial-topline"><span>${t('QUICK TOUR')}</span><span>${t('{n} of {total}', { n: step + 1, total: STEPS.length })}</span></div>
        <div class="tutorial-art" aria-hidden="true">${current.icon}</div>
        <p class="tutorial-eyebrow">${t(current.eyebrow)}</p>
        <h2 id="tutorial-title">${t(current.title)}</h2>
        <p class="tutorial-copy" id="tutorial-text">${t(current.text)}</p>
        <div class="tutorial-progress" aria-label="${t('Step {n} of {total}', { n: step + 1, total: STEPS.length })}">
          ${STEPS.map((_, i) => `<span class="${i === step ? 'current' : i < step ? 'done' : ''}"></span>`).join('')}
        </div>
        <div class="tutorial-actions">
          <button type="button" class="link tutorial-skip" id="tutorial-skip">${step === STEPS.length - 1 ? t('Close tour') : t('Skip tour')}</button>
          <div>
            ${step > 0 ? `<button type="button" class="secondary" id="tutorial-back">${t('Back')}</button>` : ''}
            <button type="button" id="tutorial-next">${step === STEPS.length - 1 ? t('Let’s go') : t('Next')}</button>
          </div>
        </div>
      </section>
    </div>`;
}

export const tutorialLength = STEPS.length;