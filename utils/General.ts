import AsyncStorage from '@react-native-async-storage/async-storage'

type Preset = {
  id: string
  name: string
  sets: number
  workTime: number
  restTime: number
  createdAt: number
}

const PRESETS_STORAGE_KEY = 'timer_presets'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

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

async function persistPresetsToStorage(presets: Preset[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch (error) {
    console.error('Failed to save presets:', error)
  }
}

export { formatTime, loadPresetsFromStorage, persistPresetsToStorage }
export type { Preset }
