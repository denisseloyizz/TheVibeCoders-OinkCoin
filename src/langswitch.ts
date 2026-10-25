import { getLang, setLang, t, type Lang } from './i18n';

/** The English | Español switch. Each language is always written in its own language. */
export function langSwitchHtml(compact = false): string {
  const button = (lang: Lang, label: string) =>
    `<button type="button" data-lang="${lang}" aria-pressed="${getLang() === lang}" lang="${lang === 'es' ? 'es-MX' : 'en'}">${label}</button>`;
  return `<div class="lang-switch${compact ? ' compact' : ''}" role="group" aria-label="${t('Language')}">${button('en', 'English')}${button('es', 'Español')}</div>`;
}

export function bindLangSwitch(root: ParentNode): void {
  root.querySelectorAll<HTMLButtonElement>('[data-lang]').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang as Lang)));
}
