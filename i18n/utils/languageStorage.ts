import AsyncStorage from '@react-native-async-storage/async-storage'
import { SupportedLanguage, SUPPORTED_LANGUAGES } from '../types'

export const LANGUAGE_STORAGE_KEY = 'timer_language'

function isValidLanguage(value: string | null): value is SupportedLanguage {
  return value !== null && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
}

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

export async function saveLanguage(language: SupportedLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language)
  } catch (error) {
    console.error('Failed to save language preference:', error)
  }
}

export async function clearLanguage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear language preference:', error)
  }
}
