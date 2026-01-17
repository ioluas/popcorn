import AsyncStorage from '@react-native-async-storage/async-storage'
import { getSavedLanguage, saveLanguage, clearLanguage, LANGUAGE_STORAGE_KEY } from '../languageStorage'

describe('languageStorage', () => {
  afterEach(async () => {
    await AsyncStorage.clear()
    jest.restoreAllMocks()
  })

  describe('getSavedLanguage', () => {
    it('should return the saved language if it exists', async () => {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'sv')
      const language = await getSavedLanguage()
      expect(language).toBe('sv')
    })

    it('should return null if no language is saved', async () => {
      const language = await getSavedLanguage()
      expect(language).toBeNull()
    })

    it('should return null and log an error if AsyncStorage fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('AsyncStorage failed')
      jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(error)

      const language = await getSavedLanguage()

      expect(language).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to load language preference:', error)
    })
  })

  describe('saveLanguage', () => {
    it('should save the language to AsyncStorage', async () => {
      await saveLanguage('ar')
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      expect(saved).toBe('ar')
    })

    it('should log an error if AsyncStorage fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('AsyncStorage failed')
      jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(error)

      await saveLanguage('en')

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to save language preference:', error)
    })
  })

  describe('clearLanguage', () => {
    it('should remove the language from AsyncStorage', async () => {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'sv')
      await clearLanguage()
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      expect(saved).toBeNull()
    })

    it('should log an error if AsyncStorage fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      const error = new Error('AsyncStorage failed')
      jest.spyOn(AsyncStorage, 'removeItem').mockRejectedValueOnce(error)

      await clearLanguage()

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to clear language preference:', error)
    })
  })
})
