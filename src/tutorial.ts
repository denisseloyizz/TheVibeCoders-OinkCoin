const STEPS = [
  {
    icon: '🐷',
    eyebrow: 'YOUR MONEY SIDEKICK',
    title: 'Meet your Budget Buddy',
    text: 'Your buddy reacts to your spending and helps make money habits feel a little more fun. Check in, give them a name, and watch them grow with you.',
  },
  {
    icon: '🧾',
    eyebrow: 'A CLEARER PICTURE',
    title: 'Track spending your way',
    text: 'Add expenses as you go, upload a bank statement, or connect a bank for read-only transaction imports. Your history and report help you spot patterns.',
  },
  {
    icon: '🎯',
    eyebrow: 'SMALL STEPS ADD UP',
    title: 'Make a budget that fits',
    text: 'Choose a monthly budget, set category limits, and pick a goal. Your buddy’s mood gives you a friendly nudge as you make progress.',
  },
  {
    icon: '✨',
    eyebrow: 'LEARN AS YOU GO',
    title: 'Grow, earn, and decorate',
    text: 'Find bite-sized money tips in Grow Your Money. Reach goals to earn coins, then visit the Store to treat your buddy to something new.',
  },
  {
    icon: '🏡',
    eyebrow: 'TOTALLY OPTIONAL',
    title: 'Make it yours',
    text: 'Visit Friends & House to decorate your buddy’s space or connect with friends. You can explore everything at your own pace from the menu.',
  },
];

export function tutorialHtml(step: number): string {
  const current = STEPS[step];
  return `
    <div class="tutorial-backdrop">
      <section class="tutorial-card" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" aria-describedby="tutorial-text">
        <div class="tutorial-topline"><span>QUICK TOUR</span><span>${step + 1} of ${STEPS.length}</span></div>
        <div class="tutorial-art" aria-hidden="true">${current.icon}</div>
        <p class="tutorial-eyebrow">${current.eyebrow}</p>
        <h2 id="tutorial-title">${current.title}</h2>
        <p class="tutorial-copy" id="tutorial-text">${current.text}</p>
        <div class="tutorial-progress" aria-label="Step ${step + 1} of ${STEPS.length}">
          ${STEPS.map((_, i) => `<span class="${i === step ? 'current' : i < step ? 'done' : ''}"></span>`).join('')}
        </div>
        <div class="tutorial-actions">
          <button type="button" class="link tutorial-skip" id="tutorial-skip">${step === STEPS.length - 1 ? 'Close tour' : 'Skip tour'}</button>
          <div>
            ${step > 0 ? '<button type="button" class="secondary" id="tutorial-back">Back</button>' : ''}
            <button type="button" id="tutorial-next">${step === STEPS.length - 1 ? "Let’s go" : 'Next'}</button>
          </div>
        </div>
      </section>
    </div>`;
}

export const tutorialLength = STEPS.length;