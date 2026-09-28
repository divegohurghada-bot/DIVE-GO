import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LanguageCode,
  LANGUAGES,
  LanguageInfo,
  TranslationSchema,
  getTranslation,
} from '../i18n';

interface LanguageContextType {
  currentLang: LanguageCode;
  currentLangInfo: LanguageInfo;
  setLang: (code: LanguageCode) => void;
  t: TranslationSchema;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'divego_preferred_lang_v1';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLangState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
    } catch (e) {
      // ignore
    }
    // Default to German or English
    return 'de';
  });

  const currentLangInfo =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];
  const t = getTranslation(currentLang);
  const dir = currentLangInfo.dir;

  const setLang = (code: LanguageCode) => {
    setCurrentLangState(code);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, code);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = dir;
  }, [currentLang, dir]);

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLangInfo,
        setLang,
        t,
        dir,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
