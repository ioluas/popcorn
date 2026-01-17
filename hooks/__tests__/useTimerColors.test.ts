import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useTimerColors, DEFAULT_BG_COLOR, WORK_COLOR_KEY, REST_COLOR_KEY } from '../useTimerColors'

jest.mock('@react-native-async-storage/async-storage', () => {
  let store: { [key: string]: string } = {}
  return {
    getItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(store[key] || null)
      })
    },
    setItem: (key: string, value: string) => {
      return new Promise((resolve) => {
        store[key] = value
        resolve(null)
      })
    },
    removeItem: (key: string) => {
      return new Promise((resolve) => {
        delete store[key]
        resolve(null)
      })
    },
    clear: () => {
      return new Promise((resolve) => {
        store = {}
        resolve(null)
      })
    },
  }
})

// eslint-disable-next-line import/first
import AsyncStorage from '@react-native-async-storage/async-storage'

describe('useTimerColors', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  describe('initialization', () => {
    it('initializes with null colors', async () => {
      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.workBgColor).toBeNull()
      expect(result.current.restBgColor).toBeNull()
    })

    it('sets isLoading to false after loading', async () => {
      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('loads existing colors from storage', async () => {
      await AsyncStorage.setItem(WORK_COLOR_KEY, '#FF0000')
      await AsyncStorage.setItem(REST_COLOR_KEY, '#00FF00')

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.workBgColor).toBe('#FF0000')
      expect(result.current.restBgColor).toBe('#00FF00')
    })

    it('handles storage error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const getItemSpy = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('Storage error'))

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load timer colors:', expect.any(Error))
      consoleSpy.mockRestore()
      getItemSpy.mockRestore()
    })
  })

  describe('setWorkBgColor', () => {
    it('sets work background color and persists to storage', async () => {
      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.setWorkBgColor('#FF6B35')
      })

      expect(result.current.workBgColor).toBe('#FF6B35')

      const stored = await AsyncStorage.getItem(WORK_COLOR_KEY)
      expect(stored).toBe('#FF6B35')
    })

    it('removes work color from storage when set to null', async () => {
      await AsyncStorage.setItem(WORK_COLOR_KEY, '#FF0000')

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.workBgColor).toBe('#FF0000')
      })

      await act(async () => {
        await result.current.setWorkBgColor(null)
      })

      expect(result.current.workBgColor).toBeNull()

      const stored = await AsyncStorage.getItem(WORK_COLOR_KEY)
      expect(stored).toBeNull()
    })

    it('handles storage error when saving work color', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const setItemSpy = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'))

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.setWorkBgColor('#FF0000')
      })

      // State still updates even if storage fails
      expect(result.current.workBgColor).toBe('#FF0000')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save work color:', expect.any(Error))
      consoleSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('setRestBgColor', () => {
    it('sets rest background color and persists to storage', async () => {
      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.setRestBgColor('#2ECC71')
      })

      expect(result.current.restBgColor).toBe('#2ECC71')

      const stored = await AsyncStorage.getItem(REST_COLOR_KEY)
      expect(stored).toBe('#2ECC71')
    })

    it('removes rest color from storage when set to null', async () => {
      await AsyncStorage.setItem(REST_COLOR_KEY, '#00FF00')

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.restBgColor).toBe('#00FF00')
      })

      await act(async () => {
        await result.current.setRestBgColor(null)
      })

      expect(result.current.restBgColor).toBeNull()

      const stored = await AsyncStorage.getItem(REST_COLOR_KEY)
      expect(stored).toBeNull()
    })

    it('handles storage error when saving rest color', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const setItemSpy = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('Storage error'))

      const { result } = renderHook(() => useTimerColors())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      await act(async () => {
        await result.current.setRestBgColor('#00FF00')
      })

      // State still updates even if storage fails
      expect(result.current.restBgColor).toBe('#00FF00')
      expect(consoleSpy).toHaveBeenCalledWith('Failed to save rest color:', expect.any(Error))
      consoleSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('DEFAULT_BG_COLOR', () => {
    it('exports the correct default background color', () => {
      expect(DEFAULT_BG_COLOR).toBe('#242424')
    })
  })
})
