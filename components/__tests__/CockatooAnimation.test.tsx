import { render, waitFor, act } from '@testing-library/react-native'
import CockatooAnimation from '../CockatooAnimation'
import { useVolume } from '../../hooks/useVolume' // Import the actual hook to mock it

const mockPlay = jest.fn()
const mockSeekTo = jest.fn()
const mockStop = jest.fn()
const mockSetVolume = jest.fn()

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: mockPlay,
    seekTo: mockSeekTo,
    stop: mockStop,
    set volume(value: number) {
      mockSetVolume(value)
    },
    get isPlaying() {
      // Simplistic mock: consider it playing if play was called more recently than stop
      return mockPlay.mock.calls.length > mockStop.mock.calls.length
    },
  })),
}))

// Mock useVolume to immediately return a non-loading state
jest.mock('../../hooks/useVolume', () => ({
  useVolume: jest.fn(() => ({
    volume: 1.0, // Default volume for tests
    setVolume: jest.fn(),
    isLoading: false, // Mock it as already loaded
  })),
}))

describe('CockatooAnimation', () => {
  const defaultProps = {
    isPlaying: false,
    onComplete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks() // Corrected line
    // Reset the mock for useVolume before each test to its default state
    ;(useVolume as jest.Mock).mockReturnValue({
      volume: 1.0,
      setVolume: jest.fn(),
      isLoading: false,
    })
  })

  it('renders nothing when not playing', async () => {
    const { queryByTestId } = render(<CockatooAnimation {...defaultProps} />)
    // Wait for any potential asynchronous effects from useVolume mock
    await act(async () => {})
    expect(queryByTestId('cockatoo-animation')).toBeNull()
  })

  it('renders image when playing', async () => {
    const { getByTestId } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)
    // Wait for any potential asynchronous effects from useVolume mock
    await act(async () => {})
    expect(getByTestId('cockatoo-animation')).toBeTruthy()
  })

  it('plays sound when animation starts and sets volume', async () => {
    const mockVolume = 0.5
    ;(useVolume as jest.Mock).mockReturnValue({
      // Set specific volume for this test
      volume: mockVolume,
      setVolume: jest.fn(),
      isLoading: false,
    })

    render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    // Use waitFor to ensure all asynchronous updates have settled
    await waitFor(() => {
      expect(mockSeekTo).toHaveBeenCalledWith(0)
      expect(mockPlay).toHaveBeenCalled()
      expect(mockSetVolume).toHaveBeenCalledWith(mockVolume)
    })
  })

  it('does not play sound when not playing', async () => {
    render(<CockatooAnimation {...defaultProps} isPlaying={false} />)
    // Wait for any potential asynchronous effects from useVolume mock
    await act(async () => {})
    expect(mockPlay).not.toHaveBeenCalled()
  })
})
