import { useState, useEffect, useRef, useCallback } from 'react'

interface UseCockatooResult {
  isAnimationPlaying: boolean
  onAnimationComplete: () => void
}

const MAGIC_VALUE = 303

/**
 * Represents the delay time, in milliseconds, before triggering a specific operation or event.
 * This constant can be used to introduce controlled delays in functionality
 * where timing is critical or to prevent rapid successive executions.
 */
const TRIGGER_DELAY_MS = 500

/**
 * A custom hook that manages an animation state based on a provided work time value.
 *
 * @param {number} workTime - The duration or trigger value that determines when the animation starts.
 * @return {Object} - Returns an object containing the animation state and a callback to reset the animation state on completion.
 * @return {boolean} return.isAnimationPlaying - Indicates whether the animation is currently playing.
 * @return {UseCockatooResult} return.onAnimationComplete - Callback to be triggered when the animation completes, which resets the animation state.
 */
export function useCockatoo(workTime: number): UseCockatooResult {
  const [isAnimationPlaying, setIsAnimationPlaying] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (workTime === MAGIC_VALUE && !isAnimationPlaying) {
      timeoutRef.current = setTimeout(() => {
        setIsAnimationPlaying(true)
      }, TRIGGER_DELAY_MS)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [workTime, isAnimationPlaying])

  const onAnimationComplete = useCallback(() => {
    setIsAnimationPlaying(false)
  }, [])

  return { isAnimationPlaying, onAnimationComplete }
}
