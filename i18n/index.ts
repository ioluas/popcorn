import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Localization from 'expo-localization'
import en from './locales/en'
import sv from './locales/sv'
import ar from './locales/ar'
import { getSavedLanguage } from './utils/languageStorage'
import { SUPPORTED_LANGUAGES, SupportedLanguage } from './types'

// Re-export types and utilities
export { SUPPORTED_LANGUAGES, type SupportedLanguage } from './types'
export { isRTL, applyRTL, needsRTLRestart } from './rtl'
export { getSavedLanguage, saveLanguage } from './utils/languageStorage'

export async function initI18n(): Promise<typeof i18n> {
  // Check for saved language preference first
  const savedLanguage = await getSavedLanguage()
  const deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'en'
  const languageToUse =
    savedLanguage ?? (SUPPORTED_LANGUAGES.includes(deviceLocale as SupportedLanguage) ? deviceLocale : 'en')
  // eslint-disable-next-line import/no-named-as-default-member
  await i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      sv: { translation: sv },
      ar: { translation: ar },
    },
    lng: languageToUse,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

  return i18n
}

export default i18n
