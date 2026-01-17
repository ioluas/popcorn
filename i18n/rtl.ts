import { I18nManager } from 'react-native'
import { SupportedLanguage, RTL_LANGUAGES } from './types'

/**
 * Determines if a given language is written in a right-to-left (RTL) direction.
 *
 * @param {SupportedLanguage} language - The language to check for RTL orientation.
 * @return {boolean} True if the language is written in RTL, otherwise false.
 */
export function isRTL(language: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(language)
}

/**
 * Adjusts the application's layout direction based on the specified language's right-to-left (RTL) requirement.
 * If the current layout direction does not match the language's requirement, it updates the RTL configuration.
 *
 * @param {SupportedLanguage} language - The target language for determining whether the layout should be RTL.
 * @return {boolean} Returns `true` if the RTL configuration was changed and requires a restart, otherwise `false`.
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

/**
 * Determines if a restart is required due to a change in text direction (RTL or LTR).
 *
 * @param {SupportedLanguage} targetLanguage - The target language to check for RTL compatibility.
 * @return {boolean} - Returns `true` if a restart is required to apply the new RTL setting, otherwise `false`.
 */
export function needsRTLRestart(targetLanguage: SupportedLanguage): boolean {
  const shouldBeRTL = isRTL(targetLanguage)
  return shouldBeRTL !== I18nManager.isRTL
}
