import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../utils/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('satta_language') || 'en');

  const changeLanguage = (lang) => {
    if (TRANSLATIONS[lang]) {
      setLanguage(lang);
      localStorage.setItem('satta_language', lang);
    }
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

