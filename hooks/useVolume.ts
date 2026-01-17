import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * A constant key used for storing and retrieving the volume setting
 * in the application's local storage or any similar storage mechanism.
 * This key is intended to uniquely identify the volume setting value
 * for the application to ensure consistent and reliable storage access.
 */
export const VOLUME_STORAGE_KEY = 'poptimer:volume'

/**
 * Represents the default volume level for audio playback.
 * This value is typically used as the initial setting for volume
 * controls, with 1.0 signifying 100% volume.
 *
 * The value must be a floating-point number where:
 * - `0.0` represents muted (0% volume).
 * - `1.0` represents full volume (100% volume).
 */
const DEFAULT_VOLUME = 1.0

/**
 * Validates if the given number is a valid volume level.
 * The valid range for the volume is between 0 and 1, inclusive.
 *
 * @param {number} value - The volume value to validate.
 * @return {boolean} Returns true if the value is between 0 and 1 (inclusive), otherwise false.
 */
function isValidVolume(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1
}

export type UseVolumeReturn = {
  volume: number
  setVolume: (newVolume: number) => Promise<void>
  isLoading: boolean
}

/**
 * A custom hook for managing and persisting volume preferences.
 *
 * This hook provides a stateful volume value, a function to update and persist the volume,
 * and a loading state indicating whether the initial volume has been loaded.
 *
 * @return {UseVolumeReturn} An object containing the following properties:
 * - `volume` {number}: The current volume value, ranging from 0 to 1.
 * - `setVolume` {Function}: A function to update the volume. Accepts a number between 0 and 1.
 * - `isLoading` {boolean}: A boolean indicating whether the volume is still being initialized.
 */
export function useVolume(): UseVolumeReturn {
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadVolume() {
      try {
        const saved = await AsyncStorage.getItem(VOLUME_STORAGE_KEY)
        if (saved !== null) {
          const parsed = parseFloat(saved)
          if (isValidVolume(parsed)) {
            setVolumeState(parsed)
          }
        }
      } catch (error) {
        console.error('Failed to load volume preference:', error)
      } finally {
        setIsLoading(false)
      }
    }
    void loadVolume()
  }, [])

  const setVolume = useCallback(async (newVolume: number) => {
    const finiteVolume = Number.isFinite(newVolume) ? newVolume : 0
    const clampedVolume = Math.max(0, Math.min(1, finiteVolume))
    setVolumeState(clampedVolume)
    try {
      await AsyncStorage.setItem(VOLUME_STORAGE_KEY, clampedVolume.toString())
    } catch (error) {
      console.error('Failed to save volume preference:', error)
    }
  }, [])

  return { volume, setVolume, isLoading }
}
