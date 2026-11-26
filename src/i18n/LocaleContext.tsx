import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Locale, Translations, TRANSLATIONS } from './translations';

const STORAGE_LOCALE_KEY = 'rallyman_locale_v1';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_LOCALE_KEY);
    if (saved === 'fr' || saved === 'en') {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en';
    }
  } catch {
    // ignore storage errors
  }
  return 'fr';
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectInitialLocale);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOCALE_KEY, locale);
    } catch {
      // ignore storage errors
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.title =
        locale === 'en' ? 'Rallyman Chrono — DIRT & GT' : 'Rallyman Chrono — DIRT & GT';
    }
  }, [locale]);

  const value: LocaleContextValue = {
    locale,
    setLocale: setLocaleState,
    t: TRANSLATIONS[locale],
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }
  return ctx;
}
