import AsyncStorage from '@react-native-async-storage/async-storage'
import { SupportedLanguage } from '../types'

export const LANGUAGE_STORAGE_KEY = 'timer_language'

export async function getSavedLanguage(): Promise<SupportedLanguage | null> {
  try {
    const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
    return saved as SupportedLanguage | null
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
