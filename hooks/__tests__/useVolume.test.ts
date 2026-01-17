import { renderHook, act, waitFor } from '@testing-library/react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useVolume, VOLUME_STORAGE_KEY } from '../useVolume'

describe('useVolume', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
    jest.clearAllMocks()
  })

  it('initializes with default volume of 1.0', async () => {
    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.volume).toBe(1.0)
  })

  it('loads existing volume from storage', async () => {
    await AsyncStorage.setItem(VOLUME_STORAGE_KEY, '0.5')

    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.volume).toBe(0.5)
  })

  it('sets and persists new volume', async () => {
    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.setVolume(0.7)
    })

    expect(result.current.volume).toBe(0.7)

    const stored = await AsyncStorage.getItem(VOLUME_STORAGE_KEY)
    expect(stored).toBe('0.7')
  })

  it('clamps volume to minimum of 0', async () => {
    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.setVolume(-0.5)
    })

    expect(result.current.volume).toBe(0)

    const stored = await AsyncStorage.getItem(VOLUME_STORAGE_KEY)
    expect(stored).toBe('0')
  })

  it('clamps volume to maximum of 1', async () => {
    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.setVolume(1.5)
    })

    expect(result.current.volume).toBe(1)

    const stored = await AsyncStorage.getItem(VOLUME_STORAGE_KEY)
    expect(stored).toBe('1')
  })

  it('ignores invalid stored volume and uses default', async () => {
    await AsyncStorage.setItem(VOLUME_STORAGE_KEY, 'invalid')

    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.volume).toBe(1.0)
  })

  it('ignores out-of-range stored volume and uses default', async () => {
    await AsyncStorage.setItem(VOLUME_STORAGE_KEY, '2.5')

    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.volume).toBe(1.0)
  })

  it('sets volume to 0 (muted)', async () => {
    const { result } = renderHook(() => useVolume())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    await act(async () => {
      await result.current.setVolume(0)
    })

    expect(result.current.volume).toBe(0)

    const stored = await AsyncStorage.getItem(VOLUME_STORAGE_KEY)
    expect(stored).toBe('0')
  })
})
