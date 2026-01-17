import { useState, useEffect, useRef, useCallback } from 'react'

export type TimerPhase = 'work' | 'rest' | 'complete'
export type TransitionType = 'work_to_rest' | 'rest_to_work' | 'complete'

interface TimerState {
  currentSet: number
  totalSets: number
  phase: TimerPhase
  timeRemaining: number
  isPlaying: boolean
}

interface UseTimerOptions {
  sets: number
  workTime: number
  restTime: number
  onTransition?: (type: TransitionType) => void
}

interface UseTimerReturn {
  state: TimerState
  play: () => void
  pause: () => void
  toggle: () => void
  reset: () => void
  skip: () => void
}

export function useTimer({ sets, workTime, restTime, onTransition }: UseTimerOptions): UseTimerReturn {
  const [state, setState] = useState<TimerState>(
    (): TimerState => ({
      currentSet: 1,
      totalSets: sets,
      phase: 'work',
      timeRemaining: workTime,
      isPlaying: true,
    })
  )

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onTransitionRef = useRef<((type: TransitionType) => void) | undefined>(onTransition)
  onTransitionRef.current = onTransition

  useEffect(() => {
    if (!state.isPlaying || state.phase === 'complete') {
      if (!intervalRef.current) return
      clearInterval(intervalRef.current)
      intervalRef.current = null
      return
    }

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        // Decrement normally
        if (prev.timeRemaining > 1) return { ...prev, timeRemaining: prev.timeRemaining - 1 }

        // Reaching 0 - play beep, show 00:00
        if (prev.timeRemaining === 1) {
          switch (true) {
            case prev.phase === 'work':
              onTransitionRef.current?.('work_to_rest')
              break
            case prev.currentSet < prev.totalSets:
              onTransitionRef.current?.('rest_to_work')
              break
            default:
              onTransitionRef.current?.('complete')
              break
          }
          return { ...prev, timeRemaining: 0 }
        }

        // Delay tick - stay at 0 for one more second
        if (prev.timeRemaining === 0) {
          return { ...prev, timeRemaining: -1 }
        }

        // After delay - transition to next phase
        if (prev.phase === 'work') {
          return { ...prev, phase: 'rest', timeRemaining: restTime }
        }
        if (prev.currentSet < prev.totalSets) {
          return { ...prev, currentSet: prev.currentSet + 1, phase: 'work', timeRemaining: workTime }
        }
        return { ...prev, phase: 'complete', isPlaying: false, timeRemaining: 0 }
      })
    }, 1000)

    return () => {
      if (!intervalRef.current) return
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [state.isPlaying, state.phase, workTime, restTime])

  const play = useCallback(() => {
    setState((prev) => (prev.phase !== 'complete' ? { ...prev, isPlaying: true } : prev))
  }, [])

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }))
  }, [])

  const toggle = useCallback(() => {
    setState((prev) => (prev.phase !== 'complete' ? { ...prev, isPlaying: !prev.isPlaying } : prev))
  }, [])

  const reset = useCallback(() => {
    setState({
      currentSet: 1,
      totalSets: sets,
      phase: 'work',
      timeRemaining: workTime,
      isPlaying: false,
    })
  }, [sets, workTime])

  const skip = useCallback(() => {
    // Manually trigger haptics/sound via onTransition
    if (state.phase === 'work') {
      onTransitionRef.current?.('work_to_rest')
    } else if (state.currentSet < state.totalSets) {
      onTransitionRef.current?.('rest_to_work')
    } else {
      onTransitionRef.current?.('complete')
    }

    setState((prev) => {
      if (prev.phase === 'work') {
        return { ...prev, phase: 'rest', timeRemaining: restTime }
      }
      if (prev.currentSet < prev.totalSets) {
        return { ...prev, currentSet: prev.currentSet + 1, phase: 'work', timeRemaining: workTime }
      }
      return { ...prev, phase: 'complete', isPlaying: false }
    })
  }, [state.phase, state.currentSet, state.totalSets, restTime, workTime])

  return { state, play, pause, toggle, reset, skip }
}
