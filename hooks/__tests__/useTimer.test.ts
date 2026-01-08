import { renderHook, act } from '@testing-library/react-native'
import { useTimer } from '../useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initial state', () => {
    it('initializes with correct default state', () => {
      const { result } = renderHook(() => useTimer({ sets: 3, workTime: 30, restTime: 10 }))

      expect(result.current.state).toEqual({
        currentSet: 1,
        totalSets: 3,
        phase: 'work',
        timeRemaining: 30,
        isPlaying: true,
      })
    })

    it('starts playing automatically', () => {
      const { result } = renderHook(() => useTimer({ sets: 2, workTime: 10, restTime: 5 }))

      expect(result.current.state.isPlaying).toBe(true)
    })
  })

  describe('play/pause/toggle', () => {
    it('pauses the timer', () => {
      const { result } = renderHook(() => useTimer({ sets: 3, workTime: 30, restTime: 10 }))

      act(() => {
        result.current.pause()
      })

      expect(result.current.state.isPlaying).toBe(false)
    })

    it('resumes the timer with play', () => {
      const { result } = renderHook(() => useTimer({ sets: 3, workTime: 30, restTime: 10 }))

      act(() => {
        result.current.pause()
      })
      expect(result.current.state.isPlaying).toBe(false)

      act(() => {
        result.current.play()
      })
      expect(result.current.state.isPlaying).toBe(true)
    })

    it('toggles play state', () => {
      const { result } = renderHook(() => useTimer({ sets: 3, workTime: 30, restTime: 10 }))

      expect(result.current.state.isPlaying).toBe(true)

      act(() => {
        result.current.toggle()
      })
      expect(result.current.state.isPlaying).toBe(false)

      act(() => {
        result.current.toggle()
      })
      expect(result.current.state.isPlaying).toBe(true)
    })
  })

  describe('reset', () => {
    it('resets timer to initial state', () => {
      const { result } = renderHook(() => useTimer({ sets: 3, workTime: 30, restTime: 10 }))

      // Advance timer
      act(() => {
        jest.advanceTimersByTime(5000)
      })

      expect(result.current.state.timeRemaining).toBe(25)

      act(() => {
        result.current.reset()
      })

      expect(result.current.state).toEqual({
        currentSet: 1,
        totalSets: 3,
        phase: 'work',
        timeRemaining: 30,
        isPlaying: false,
      })
    })
  })

  describe('countdown', () => {
    it('decrements time each second', () => {
      const { result } = renderHook(() => useTimer({ sets: 1, workTime: 5, restTime: 3 }))

      expect(result.current.state.timeRemaining).toBe(5)

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(result.current.state.timeRemaining).toBe(4)

      act(() => {
        jest.advanceTimersByTime(1000)
      })
      expect(result.current.state.timeRemaining).toBe(3)
    })

    it('does not decrement when paused', () => {
      const { result } = renderHook(() => useTimer({ sets: 1, workTime: 10, restTime: 5 }))

      act(() => {
        result.current.pause()
      })

      act(() => {
        jest.advanceTimersByTime(5000)
      })

      expect(result.current.state.timeRemaining).toBe(10)
    })
  })

  describe('phase transitions', () => {
    it('transitions from work to rest', () => {
      const onTransition = jest.fn()
      const { result } = renderHook(() => useTimer({ sets: 2, workTime: 2, restTime: 2, onTransition }))

      // Work phase: 2 -> 1 -> 0 -> -1 (transition)
      act(() => {
        jest.advanceTimersByTime(4000)
      })

      expect(result.current.state.phase).toBe('rest')
      expect(result.current.state.timeRemaining).toBe(2)
      expect(onTransition).toHaveBeenCalledWith('work_to_rest')
    })

    it('transitions from rest to work for next set', () => {
      const onTransition = jest.fn()
      const { result } = renderHook(() => useTimer({ sets: 2, workTime: 2, restTime: 2, onTransition }))

      // Complete work phase
      act(() => {
        jest.advanceTimersByTime(4000)
      })
      expect(result.current.state.phase).toBe('rest')

      // Complete rest phase
      act(() => {
        jest.advanceTimersByTime(4000)
      })

      expect(result.current.state.phase).toBe('work')
      expect(result.current.state.currentSet).toBe(2)
      expect(onTransition).toHaveBeenCalledWith('rest_to_work')
    })

    it('completes after final rest', () => {
      const onTransition = jest.fn()
      const { result } = renderHook(() => useTimer({ sets: 1, workTime: 2, restTime: 2, onTransition }))

      // Complete work phase
      act(() => {
        jest.advanceTimersByTime(4000)
      })

      // Complete rest phase
      act(() => {
        jest.advanceTimersByTime(4000)
      })

      expect(result.current.state.phase).toBe('complete')
      expect(result.current.state.isPlaying).toBe(false)
      expect(onTransition).toHaveBeenCalledWith('complete')
    })
  })

  describe('complete state', () => {
    it('does not allow play when complete', () => {
      const { result } = renderHook(() => useTimer({ sets: 1, workTime: 1, restTime: 1 }))

      // Fast forward to completion
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      expect(result.current.state.phase).toBe('complete')

      act(() => {
        result.current.play()
      })

      expect(result.current.state.isPlaying).toBe(false)
    })

    it('does not allow toggle when complete', () => {
      const { result } = renderHook(() => useTimer({ sets: 1, workTime: 1, restTime: 1 }))

      // Fast forward to completion
      act(() => {
        jest.advanceTimersByTime(6000)
      })

      act(() => {
        result.current.toggle()
      })

      expect(result.current.state.isPlaying).toBe(false)
    })
  })
})
