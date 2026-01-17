import AsyncStorage from '@react-native-async-storage/async-storage'
import { SupportedLanguage, SUPPORTED_LANGUAGES, LANGUAGE_STORAGE_KEY } from '../types'

/**
 * Checks if the given value is a valid-supported language.
 *
 * @param {string | null} value - The value to be validated as a supported language.
 * @return {value is SupportedLanguage} Returns true if the value is a valid-supported language, false otherwise.
 */
function isValidLanguage(value: string | null): value is SupportedLanguage {
  return value !== null && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

/**
 * Retrieves the saved language preference from persistent storage.
 *
 * The method attempts to fetch the saved language identifier from storage and validate it.
 * If the stored value is valid, it is returned. If the stored value is invalid, a warning is logged, and null is returned.
 * In case of an error during retrieval, an error message is logged, and null is returned.
 *
 * @return {Promise<SupportedLanguage | null>} A promise that resolves to the saved language if valid, or null if not found or invalid.
 */
export async function getSavedLanguage(): Promise<SupportedLanguage | null> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (isValidLanguage(saved)) {
      return saved
    }
    if (saved !== null) {
      console.warn(`Invalid saved language "${saved}", ignoring`)
    }
    return null
  } catch (error) {
    console.error('Failed to load language preference:', error)
    return null
  }
}

/**
 * Saves the preferred language to persistent storage.
 *
 * @param {SupportedLanguage} language - The language to be saved.
 * @return {Promise<void>} A promise that resolves when the language is successfully saved.
 */
export async function saveLanguage(language: SupportedLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
}

/**
 * Clears the stored language preference from persistent storage.
 *
 * The method attempts to remove the language preference key from
 * AsyncStorage. If an error occurs during the removal process, it
 * logs an error message to the console.
 *
 * @return {Promise<void>} A promise that resolves when the language preference is successfully cleared or rejects with an error.
 */
export async function clearLanguage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear language preference:', error)
  }
}
