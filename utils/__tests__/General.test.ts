import AsyncStorage from '@react-native-async-storage/async-storage'
import { formatTime, loadPresetsFromStorage, persistPresetsToStorage, Preset } from '../General'

describe('formatTime', () => {
  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats seconds only', () => {
    expect(formatTime(45)).toBe('00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(90)).toBe('01:30')
  })

  it('formats with leading zeros', () => {
    expect(formatTime(65)).toBe('01:05')
  })

  it('formats large values', () => {
    expect(formatTime(3661)).toBe('61:01')
  })
})

describe('loadPresetsFromStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns empty array when no presets stored', async () => {
    const result = await loadPresetsFromStorage()
    expect(result).toEqual([])
  })

  it('returns stored presets', async () => {
    const presets: Preset[] = [{ id: '1', name: 'Test', sets: 3, workTime: 30, restTime: 10, createdAt: 123 }]
    await AsyncStorage.setItem('timer_presets', JSON.stringify(presets))

    const result = await loadPresetsFromStorage()
    expect(result).toEqual(presets)
  })

  it('returns empty array on error', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('Storage error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await loadPresetsFromStorage()

    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith('Failed to load presets:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})

describe('persistPresetsToStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('saves presets to storage', async () => {
    const presets: Preset[] = [{ id: '1', name: 'Workout', sets: 5, workTime: 45, restTime: 15, createdAt: 456 }]

    await persistPresetsToStorage(presets)

    const stored = await AsyncStorage.getItem('timer_presets')
    expect(JSON.parse(stored!)).toEqual(presets)
  })

  it('saves empty array', async () => {
    await persistPresetsToStorage([])

    const stored = await AsyncStorage.getItem('timer_presets')
    expect(JSON.parse(stored!)).toEqual([])
  })

  it('handles error gracefully', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    await persistPresetsToStorage([])

    expect(consoleSpy).toHaveBeenCalledWith('Failed to save presets:', expect.any(Error))
    consoleSpy.mockRestore()
  })
})
