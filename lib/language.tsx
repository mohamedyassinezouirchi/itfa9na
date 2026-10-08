'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Language = 'ar' | 'fr'

type LanguageContextValue = {
  language: Language
  isFrench: boolean
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)
const COOKIE_NAME = 'atfaqna-language'

function readLanguage(): Language {
  if (typeof document === 'undefined') return 'ar'
  return document.cookie.split('; ').find((part) => part.startsWith(`${COOKIE_NAME}=`))?.split('=')[1] === 'fr' ? 'fr' : 'ar'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Keep the first client render identical to the server render. The saved
  // language is applied after hydration to avoid changing the markup mid-hydration.
  const [language, setLanguageState] = useState<Language>('ar')

  useEffect(() => {
    const savedLanguage = readLanguage()
    setLanguageState(savedLanguage)
  }, [])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'fr' ? 'ltr' : 'rtl'
    document.cookie = `${COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`
  }, [language])

  function setLanguage(nextLanguage: Language) {
    setLanguageState(nextLanguage)
  }

  return <LanguageContext.Provider value={{ language, isFrench: language === 'fr', setLanguage, toggleLanguage: () => setLanguageState((current) => current === 'fr' ? 'ar' : 'fr') }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
