import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../locales/en/translation.json';
import hi from '../locales/hi/translation.json';
import es from '../locales/es/translation.json';
import pt from '../locales/pt/translation.json';
import zh from '../locales/zh/translation.json';
import fr from '../locales/fr/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es },
      pt: { translation: pt },
      zh: { translation: zh },
      fr: { translation: fr },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
