import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * A constant representing the key used to store or retrieve the work background color setting.
 * This key is used for accessing the corresponding value within storage or configuration mechanisms.
 */
export const WORK_COLOR_KEY = 'poptimer:work_bg_color'

/**
 * A constant key used for storing and retrieving the background color
 * related to the rest state in the application.
 *
 * The key is used in conjunction with persistent storage mechanisms
 * (e.g., localStorage, sessionStorage, etc.) to manage the rest state
 * background color settings under the namespace 'poptimer'.
 */
export const REST_COLOR_KEY = 'poptimer:rest_bg_color'

/**
 * Represents the default background color used in the application.
 * This color is typically applied as a fallback or base styling
 * for visual components that do not specify a custom background color.
 *
 * Value: '#242424' (a dark gray shade)
 */
export const DEFAULT_BG_COLOR = '#242424'

export type TimerColors = {
  workBgColor: string | null
  restBgColor: string | null
}

export type UseTimerColorsReturn = {
  workBgColor: string | null
  restBgColor: string | null
  setWorkBgColor: (color: string | null) => Promise<void>
  setRestBgColor: (color: string | null) => Promise<void>
  isLoading: boolean
}

/**
 * A custom hook to manage and persist background colors for work and rest timer states.
 *
 * This hook provides state values for `workBgColor` and `restBgColor`,
 * along with setter functions `setWorkBgColor` and `setRestBgColor`,
 * enabling the retrieval and updating of stored color configurations
 * associated with the timer. It also exposes the `isLoading` state
 * which indicates whether the stored colors are being fetched from
 * persistent storage.
 *
 * @return {UseTimerColorsReturn} An object containing:
 * - `workBgColor`: The background color for the work timer state, or `null` if not set.
 * - `restBgColor`: The background color for the rest timer state, or `null` if not set.
 * - `setWorkBgColor`: A function to update and persist the work timer background color.
 * - `setRestBgColor`: A function to update and persist the rest timer background color.
 * - `isLoading`: A boolean indicating if the colors are being loaded from persistent storage.
 */
export function useTimerColors(): UseTimerColorsReturn {
  const [workBgColor, setWorkBgColorState] = useState<string | null>(null)
  const [restBgColor, setRestBgColorState] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadColors() {
      try {
        const [work, rest] = await Promise.all([
          AsyncStorage.getItem(WORK_COLOR_KEY),
          AsyncStorage.getItem(REST_COLOR_KEY),
        ])
        setWorkBgColorState(work)
        setRestBgColorState(rest)
      } catch (error) {
        console.error('Failed to load timer colors:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void loadColors()
  }, [])

  const setWorkBgColor = useCallback(async (color: string | null) => {
    setWorkBgColorState(color)
    try {
      if (color === null) {
        await AsyncStorage.removeItem(WORK_COLOR_KEY)
      } else {
        await AsyncStorage.setItem(WORK_COLOR_KEY, color)
      }
    } catch (error) {
      console.error('Failed to save work color:', error)
    }
  }, [])

  const setRestBgColor = useCallback(async (color: string | null) => {
    setRestBgColorState(color)
    try {
      if (color === null) {
        await AsyncStorage.removeItem(REST_COLOR_KEY)
      } else {
        await AsyncStorage.setItem(REST_COLOR_KEY, color)
      }
    } catch (error) {
      console.error('Failed to save rest color:', error)
    }
  }, [])

  return {
    workBgColor,
    restBgColor,
    setWorkBgColor,
    setRestBgColor,
    isLoading,
  }
}
