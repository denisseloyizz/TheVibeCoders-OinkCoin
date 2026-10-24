export const line = (d: string): string =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;

export const LINE = {
  chevronLeft: line('<path d="M15 18l-6-6 6-6"/>'),
  chevronRight: line('<path d="M9 18l6-6-6-6"/>'),
  close: line('<path d="M6 6l12 12M18 6L6 18"/>'),
  bulb: line('<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.8 10.6c.6.6.8 1.3.8 2.4h6c0-1.1.2-1.8.8-2.4A6 6 0 0 0 12 3z"/>'),
  feed: line('<path d="M3 11h18a9 9 0 0 1-18 0zM8.5 7.5c0-1.5 1-2 1-3.5M12.5 7.5c0-1.5 1-2 1-3.5"/>'),
  play: line('<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6c3.5 3.5 3.5 9.3 0 12.8M18.4 5.6c-3.5 3.5-3.5 9.3 0 12.8"/>'),
  bell: line('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
  pet: line('<path d="M12 20s-7-4.4-9-8.5C1.5 8 3.5 5 6.5 5c2 0 3.5 1.2 5.5 3 2-1.8 3.5-3 5.5-3 3 0 5 3 3.5 6.5-2 4.1-9 8.5-9 8.5z"/>'),
};

export const ICONS = {
  cookie: `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#f2b95c" stroke="#d48f2f" stroke-width="2"/><circle cx="13" cy="15" r="3" fill="#6b3e1f"/><circle cx="25" cy="12" r="2.5" fill="#6b3e1f"/><circle cx="23" cy="25" r="3" fill="#6b3e1f"/><circle cx="12" cy="26" r="2" fill="#6b3e1f"/><circle cx="29" cy="19" r="1.8" fill="#6b3e1f"/></svg>`,
  ball: `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="#ffc93c" stroke="#e8a200" stroke-width="2"/><path d="M20 3 Q8 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><path d="M20 3 Q32 20 20 37" stroke="#ff5c9a" stroke-width="4" fill="none"/><circle cx="14" cy="11" r="3" fill="#fff" opacity=".7"/></svg>`,
  heart: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 35 C6 25 2 17 6 10 C10 4 18 5 20 11 C22 5 30 4 34 10 C38 17 34 25 20 35Z" fill="#ff5c9a" stroke="#e0407f" stroke-width="2"/><ellipse cx="12" cy="13" rx="3" ry="2" fill="#fff" opacity=".6"/></svg>`,
  bag: `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M9 14h22l-2 21H11z" fill="#b69cff" stroke="#8b6cf0" stroke-width="2" stroke-linejoin="round"/><path d="M15 15v-4a5 5 0 0 1 10 0v4" fill="none" stroke="#8b6cf0" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="24" r="4.5" fill="#ffc93c" stroke="#e8a200" stroke-width="1.5"/></svg>`,
  coin: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="13" r="10" fill="#d98a00"/><circle cx="12" cy="11.5" r="10" fill="#ffc93c"/><circle cx="12" cy="11.5" r="6.5" fill="none" stroke="#e8a200" stroke-width="1.5"/><path d="M6 7.5a8 8 0 0 1 4-3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity=".7"/></svg>`,
};
