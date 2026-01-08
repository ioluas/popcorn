import { renderHook, act } from '@testing-library/react-native'
import { useSounds } from '../useSounds'

const mockPlay = jest.fn()
const mockSeekTo = jest.fn()

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: mockPlay,
    seekTo: mockSeekTo,
  })),
}))

describe('useSounds', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns playBeep function', () => {
    const { result } = renderHook(() => useSounds())

    expect(result.current.playBeep).toBeDefined()
    expect(typeof result.current.playBeep).toBe('function')
  })

  it('plays beep sound from beginning', () => {
    const { result } = renderHook(() => useSounds())

    act(() => {
      result.current.playBeep()
    })

    expect(mockSeekTo).toHaveBeenCalledWith(0)
    expect(mockPlay).toHaveBeenCalled()
  })

  it('can play beep multiple times', () => {
    const { result } = renderHook(() => useSounds())

    act(() => {
      result.current.playBeep()
      result.current.playBeep()
      result.current.playBeep()
    })

    expect(mockSeekTo).toHaveBeenCalledTimes(3)
    expect(mockPlay).toHaveBeenCalledTimes(3)
  })
})
