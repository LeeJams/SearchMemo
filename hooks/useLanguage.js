import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, {
  LANGUAGE_KEY,
  getDeviceLocale,
  setAppLocale,
  supportedLanguages,
} from "../locales/i18n";

const LanguageContext = createContext({
  locale: i18n.locale,
  languages: supportedLanguages,
  changeLanguage: async () => {},
});

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(i18n.locale);

  useEffect(() => {
    let isMounted = true;

    async function loadLanguage() {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        const nextLocale = setAppLocale(savedLanguage || getDeviceLocale());
        if (isMounted) {
          setLocale(nextLocale);
        }
      } catch (error) {
        console.error("Failed to load language from storage", error);
        const fallbackLocale = setAppLocale(getDeviceLocale());
        if (isMounted) {
          setLocale(fallbackLocale);
        }
      }
    }

    loadLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const changeLanguage = async (code) => {
    const previousLocale = i18n.locale;
    const nextLocale = setAppLocale(code);
    setLocale(nextLocale);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, nextLocale);
      return nextLocale;
    } catch (error) {
      setAppLocale(previousLocale);
      setLocale(previousLocale);
      throw error;
    }
  };

  const value = useMemo(
    () => ({ locale, languages: supportedLanguages, changeLanguage }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
