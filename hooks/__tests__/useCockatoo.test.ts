import { renderHook, act } from '@testing-library/react-native'
import { useCockatoo } from '../useCockatoo'

describe('useCockatooEasterEgg', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('does not trigger for non-magic values', () => {
    const { result } = renderHook(() => useCockatoo(60))

    expect(result.current.isAnimationPlaying).toBe(false)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.isAnimationPlaying).toBe(false)
  })

  it('triggers after 500ms delay when workTime is 303', () => {
    const { result } = renderHook(() => useCockatoo(303))

    expect(result.current.isAnimationPlaying).toBe(false)

    act(() => {
      jest.advanceTimersByTime(499)
    })

    expect(result.current.isAnimationPlaying).toBe(false)

    act(() => {
      jest.advanceTimersByTime(1)
    })

    expect(result.current.isAnimationPlaying).toBe(true)
  })

  it('cancels trigger if value changes before delay', () => {
    const { result, rerender } = renderHook(({ workTime }: { workTime: number }) => useCockatoo(workTime), {
      initialProps: { workTime: 303 },
    })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current.isAnimationPlaying).toBe(false)

    rerender({ workTime: 60 })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.isAnimationPlaying).toBe(false)
  })

  it('does not re-trigger while animation is playing', () => {
    const { result, rerender } = renderHook(({ workTime }: { workTime: number }) => useCockatoo(workTime), {
      initialProps: { workTime: 303 },
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.isAnimationPlaying).toBe(true)

    // Change value and change back to magic value
    rerender({ workTime: 60 })
    rerender({ workTime: 303 })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Should still be true from first trigger, not re-triggered
    expect(result.current.isAnimationPlaying).toBe(true)
  })

  it('can trigger again after animation completes', () => {
    const { result, rerender } = renderHook(({ workTime }: { workTime: number }) => useCockatoo(workTime), {
      initialProps: { workTime: 303 },
    })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.isAnimationPlaying).toBe(true)

    act(() => {
      result.current.onAnimationComplete()
    })

    expect(result.current.isAnimationPlaying).toBe(false)

    // Change to non-magic value and back
    rerender({ workTime: 60 })
    rerender({ workTime: 303 })

    act(() => {
      jest.advanceTimersByTime(500)
    })

    expect(result.current.isAnimationPlaying).toBe(true)
  })

  it('returns onAnimationComplete callback', () => {
    const { result } = renderHook(() => useCockatoo(303))

    expect(result.current.onAnimationComplete).toBeDefined()
    expect(typeof result.current.onAnimationComplete).toBe('function')
  })
})
