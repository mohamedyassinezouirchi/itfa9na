'use client'

import { useLanguage } from '@/lib/language'

export function LanguageToggle() {
  const { isFrench, toggleLanguage } = useLanguage()
  return <button type="button" onClick={toggleLanguage} className="rounded-full border border-current/15 px-3 py-1.5 text-xs font-semibold opacity-75 transition hover:opacity-100" aria-label={isFrench ? 'Passer à l’arabe' : 'Changer la langue en français'}>{isFrench ? 'العربية' : 'FR / Français'}</button>
}
