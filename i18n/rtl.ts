import { I18nManager } from 'react-native'
import { SupportedLanguage, RTL_LANGUAGES } from './types'

export function isRTL(language: string): boolean {
  return RTL_LANGUAGES.includes(language as SupportedLanguage)
}

/**
 * Adjusts the application layout to use a right-to-left (RTL) or left-to-right (LTR) direction based on
 * the provided language.
 *
 * @param language - The language to determine if RTL layout should be applied.
 * @return Returns `true` if the layout's direction was updated and requires a restart, otherwise `false`.
 */
export function applyRTL(language: SupportedLanguage): boolean {
  const shouldBeRTL = isRTL(language)
  const currentlyRTL = I18nManager.isRTL
  if (shouldBeRTL !== currentlyRTL) {
    I18nManager.allowRTL(shouldBeRTL)
    I18nManager.forceRTL(shouldBeRTL)
    return true // Restart needed
  }
  return false
}

export function needsRTLRestart(targetLanguage: SupportedLanguage): boolean {
  const shouldBeRTL = isRTL(targetLanguage)
  return shouldBeRTL !== I18nManager.isRTL
}
