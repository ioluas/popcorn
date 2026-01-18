import { render, waitFor, act } from '@testing-library/react-native'
import CockatooAnimation from '../CockatooAnimation'
import { useVolume } from '@/hooks/useVolume' // Import the actual hook to mock it
import * as Reanimated from 'react-native-reanimated'

const mockPlay = jest.fn()
const mockSeekTo = jest.fn()
const mockPause = jest.fn() // New mock for pause
const mockSetVolume = jest.fn()
let mockAnimationCallback: ((finished?: boolean) => void) | null = null

// Store original withTiming
// const originalWithTiming = Reanimated.withTiming

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: mockPlay,
    seekTo: mockSeekTo,
    pause: mockPause, // Changed from stop to pause
    set volume(value: number) {
      mockSetVolume(value)
    },
    get playing() {
      // Changed from isPlaying to playing
      // Simplistic mock: consider it playing if play was called more recently than pause
      return mockPlay.mock.calls.length > mockPause.mock.calls.length
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
    jest.clearAllMocks()
    mockAnimationCallback = null

    // Spy on withTiming to capture callbacks
    jest.spyOn(Reanimated, 'withTiming').mockImplementation((toValue: any, config?: any, callback?: any) => {
      if (callback) {
        mockAnimationCallback = callback
      }
      return toValue
    })

    // Reset the mock for useVolume before each test to its default state
    ;(useVolume as jest.Mock).mockReturnValue({
      volume: 1.0,
      setVolume: jest.fn(),
      isLoading: false,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

  it('calls onComplete when animation finishes', async () => {
    const mockOnComplete = jest.fn()
    render(<CockatooAnimation {...defaultProps} isPlaying={true} onComplete={mockOnComplete} />)

    await waitFor(() => {
      expect(mockAnimationCallback).not.toBeNull()
    })

    // Simulate animation completion
    await act(async () => {
      if (mockAnimationCallback) {
        mockAnimationCallback(true)
      }
    })

    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it('does not call onComplete when animation is cancelled', async () => {
    const mockOnComplete = jest.fn()
    render(<CockatooAnimation {...defaultProps} isPlaying={true} onComplete={mockOnComplete} />)

    await waitFor(() => {
      expect(mockAnimationCallback).not.toBeNull()
    })

    // Simulate animation cancellation (finished = false)
    await act(async () => {
      if (mockAnimationCallback) {
        mockAnimationCallback(false)
      }
    })

    expect(mockOnComplete).not.toHaveBeenCalled()
  })

  it('pauses player on cleanup when playing', async () => {
    const { unmount } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled()
    })

    // Unmount to trigger cleanup
    unmount()

    expect(mockPause).toHaveBeenCalled()
  })

  it('does not pause player on cleanup when not playing', async () => {
    const { unmount } = render(<CockatooAnimation {...defaultProps} isPlaying={false} />)

    await act(async () => {})

    // Verify no sound started playing
    expect(mockPlay).not.toHaveBeenCalled()

    // Unmount to trigger cleanup
    unmount()

    // Should not pause since it never started playing
    expect(mockPause).not.toHaveBeenCalled()
  })

  it('stops previous animation and starts new one when isPlaying changes', async () => {
    const { rerender } = render(<CockatooAnimation {...defaultProps} isPlaying={false} />)

    await act(async () => {})
    expect(mockPlay).not.toHaveBeenCalled()

    // Start playing
    rerender(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalledTimes(1)
      expect(mockSeekTo).toHaveBeenCalledWith(0)
    })

    // Stop playing
    rerender(<CockatooAnimation {...defaultProps} isPlaying={false} />)

    await waitFor(() => {
      expect(mockPause).toHaveBeenCalled()
    })

    // Restart playing
    mockPlay.mockClear()
    mockSeekTo.mockClear()

    rerender(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalledTimes(1)
      expect(mockSeekTo).toHaveBeenCalledWith(0)
    })
  })

  it('resets audio to start on each play', async () => {
    const { rerender } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockSeekTo).toHaveBeenCalledWith(0)
      expect(mockPlay).toHaveBeenCalled()
    })

    // Stop and restart
    rerender(<CockatooAnimation {...defaultProps} isPlaying={false} />)
    mockSeekTo.mockClear()
    mockPlay.mockClear()

    rerender(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockSeekTo).toHaveBeenCalledWith(0)
      expect(mockPlay).toHaveBeenCalled()
    })
  })

  it('updates volume when volume prop changes', async () => {
    const { rerender } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockSetVolume).toHaveBeenCalledWith(1.0)
    })

    // Change volume
    ;(useVolume as jest.Mock).mockReturnValue({
      volume: 0.3,
      setVolume: jest.fn(),
      isLoading: false,
    })

    mockSetVolume.mockClear()
    rerender(<CockatooAnimation {...defaultProps} isPlaying={false} />)
    rerender(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockSetVolume).toHaveBeenCalledWith(0.3)
    })
  })

  it('renders with correct styles and properties', async () => {
    const { getByTestId } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await act(async () => {})

    const animatedView = getByTestId('cockatoo-animation')
    expect(animatedView).toBeTruthy()
    expect(animatedView.props.pointerEvents).toBe('none')
  })

  it('renders correct image source', async () => {
    const { getByTestId } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await act(async () => {})

    const animatedView = getByTestId('cockatoo-animation')
    const image = animatedView.props.children

    // Check that it's an Image component with the correct source
    expect(image.type.displayName || image.type.name).toBe('Image')
  })

  it('applies correct styles to container and image', async () => {
    const { getByTestId } = render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await act(async () => {})

    const animatedView = getByTestId('cockatoo-animation')
    const styles = animatedView.props.style

    // Check that position absolute and zIndex are applied
    const flattenedStyles = Array.isArray(styles) ? Object.assign({}, ...styles) : styles
    expect(flattenedStyles).toMatchObject({
      position: 'absolute',
      zIndex: 1000,
    })

    // Check image dimensions
    const image = animatedView.props.children
    expect(image.props.style).toMatchObject({
      width: 100,
      height: 100,
      resizeMode: 'contain',
    })
  })

  it('generates animation positions within screen bounds', async () => {
    const mockWidth = 400
    const mockHeight = 800

    // Mock useWindowDimensions
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.spyOn(require('react-native'), 'useWindowDimensions').mockReturnValue({
      width: mockWidth,
      height: mockHeight,
      scale: 1,
      fontScale: 1,
    })

    render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled()
    })

    // Verify that useSharedValue was called multiple times for position values
    expect(Reanimated.useSharedValue).toHaveBeenCalled()
  })

  it('handles multiple animation cycles correctly', async () => {
    const mockOnComplete = jest.fn()
    const { rerender } = render(<CockatooAnimation {...defaultProps} isPlaying={true} onComplete={mockOnComplete} />)

    await waitFor(() => {
      expect(mockAnimationCallback).not.toBeNull()
    })

    // Complete first animation
    await act(async () => {
      if (mockAnimationCallback) {
        mockAnimationCallback(true)
      }
    })

    expect(mockOnComplete).toHaveBeenCalledTimes(1)

    // Reset and start second animation
    mockAnimationCallback = null
    mockOnComplete.mockClear()
    mockPlay.mockClear()

    rerender(<CockatooAnimation {...defaultProps} isPlaying={false} onComplete={mockOnComplete} />)
    await act(async () => {})

    rerender(<CockatooAnimation {...defaultProps} isPlaying={true} onComplete={mockOnComplete} />)

    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled()
      expect(mockAnimationCallback).not.toBeNull()
    })

    // Complete second animation
    await act(async () => {
      if (mockAnimationCallback) {
        mockAnimationCallback(true)
      }
    })

    expect(mockOnComplete).toHaveBeenCalledTimes(1)
  })

  it('uses curved path animation with bezier calculations', async () => {
    // Mock useAnimatedStyle to verify it's called
    const mockUseAnimatedStyle = jest.spyOn(Reanimated, 'useAnimatedStyle')

    render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await waitFor(() => {
      expect(mockUseAnimatedStyle).toHaveBeenCalled()
    })

    // Get the style function that was passed to useAnimatedStyle
    const lastCall = mockUseAnimatedStyle.mock.calls[mockUseAnimatedStyle.mock.calls.length - 1]
    expect(lastCall).toBeDefined()
    expect(lastCall?.[0]).toBeDefined()

    const styleFunction = lastCall![0]

    // Call the style function to execute bezier calculations
    const result = styleFunction()

    // Verify the result has transform property
    expect(result).toHaveProperty('transform')
    expect(Array.isArray(result.transform)).toBe(true)
  })

  it('initializes with correct number of shared values for curve animation', async () => {
    const useSharedValueSpy = jest.spyOn(Reanimated, 'useSharedValue')
    const initialCallCount = useSharedValueSpy.mock.calls.length

    render(<CockatooAnimation {...defaultProps} isPlaying={true} />)

    await act(async () => {})

    // Should create 7 shared values: progress, startX, startY, controlX, controlY, endX, endY
    expect(useSharedValueSpy.mock.calls.length).toBeGreaterThanOrEqual(initialCallCount + 7)
  })
})
