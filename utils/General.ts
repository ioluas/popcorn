import AsyncStorage from '@react-native-async-storage/async-storage'

type Preset = {
  id: string
  name: string
  sets: number
  workTime: number
  restTime: number
  createdAt: number
}

const PRESETS_STORAGE_KEY = 'poptimer:presets'

/**
 * Converts a time duration from seconds into a string formatted as MM:SS.
 *
 * @param {number} seconds - The total duration in seconds to be converted.
 * @return {string} A string representing the time in MM:SS format, where MM is minutes and SS is seconds.
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Loads preset configurations from storage.
 *
 * The method retrieves data stored under a predefined key and parses it into an array of presets.
 * If no data is found or an error occurs, it returns an empty array.
 *
 * @return {Promise<Preset[]>} A promise that resolves to an array of presets retrieved from storage.
 */
async function loadPresetsFromStorage(): Promise<Preset[]> {
  try {
    const stored = await AsyncStorage.getItem(PRESETS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    return []
  } catch (error) {
    console.error('Failed to load presets:', error)
    return []
  }
}

/**
 * Persists the given presets to storage.
 *
 * @param {Preset[]} presets - The array of preset objects to be saved.
 * @return {Promise<void>} A promise that resolves when the presets have been successfully saved or rejects if an error occurs.
 */
async function persistPresetsToStorage(presets: Preset[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error('Failed to save presets:', error)
  }
}

export { formatTime, loadPresetsFromStorage, persistPresetsToStorage }
export type { Preset }
