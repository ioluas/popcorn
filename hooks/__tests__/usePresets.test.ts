import { renderHook, act, waitFor } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { usePresets } from '../usePresets'

const PRESETS_STORAGE_KEY = 'poptimer:presets'

describe('usePresets', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('initializes with empty presets', async () => {
    const { result } = renderHook(() => usePresets())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.presets).toEqual([])
  })

  it('loads existing presets from storage', async () => {
    const existingPresets = [{ id: '1', name: 'Test', sets: 3, workTime: 30, restTime: 10, createdAt: 123 }]
    await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(existingPresets))

    const { result } = renderHook(() => usePresets())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.presets).toEqual(existingPresets)
  })

  it('saves a new preset', async () => {
    const { result } = renderHook(() => usePresets())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.savePreset('New Preset', { sets: 5, workTime: 45, restTime: 15 })
    })

    expect(result.current.presets).toHaveLength(1)
    expect(result.current.presets[0]!.name).toBe('New Preset')
    expect(result.current.presets[0]!.sets).toBe(5)
    expect(result.current.presets[0]!.workTime).toBe(45)
    expect(result.current.presets[0]!.restTime).toBe(15)

    // Verify persisted to storage
    const stored = await AsyncStorage.getItem(PRESETS_STORAGE_KEY)
    expect(JSON.parse(stored!)).toHaveLength(1)
  })

  it('deletes a preset', async () => {
    const existingPresets = [
      { id: '1', name: 'Preset 1', sets: 3, workTime: 30, restTime: 10, createdAt: 123 },
      { id: '2', name: 'Preset 2', sets: 5, workTime: 45, restTime: 15, createdAt: 456 },
    ]
    await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(existingPresets))

    const { result } = renderHook(() => usePresets())

    await waitFor(() => {
      expect(result.current.presets).toHaveLength(2)
    })

    await act(async () => {
      await result.current.deletePreset('1')
    })

    expect(result.current.presets).toHaveLength(1)
    expect(result.current.presets[0]!.id).toBe('2')

    // Verify persisted to storage
    const stored = await AsyncStorage.getItem(PRESETS_STORAGE_KEY)
    expect(JSON.parse(stored!)).toHaveLength(1)
  })
})
