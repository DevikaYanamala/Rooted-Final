import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PreferencesContext = createContext();

export function PreferencesProvider({ children }) {
  const { i18n } = useTranslation();
  
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('rooted_location') || 'Newcastle upon Tyne';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('rooted_language') || 'en';
  });

  const updateLocation = (newLocation) => {
    setLocation(newLocation);
    localStorage.setItem('rooted_location', newLocation);
  };

  const updateLanguage = (lng) => {
    setLanguage(lng);
    localStorage.setItem('rooted_language', lng);
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    if (i18n.changeLanguage) {
      i18n.changeLanguage(language);
    }
  }, [language, i18n]);

  return (
    <PreferencesContext.Provider value={{ location, updateLocation, language, updateLanguage }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    return { location: 'Newcastle upon Tyne', updateLocation: () => {}, language: 'en', updateLanguage: () => {} };
  }
  return ctx;
}
