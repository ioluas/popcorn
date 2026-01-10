import { render, fireEvent, act } from '@testing-library/react-native'
import TimerPage from '../timer'

const mockBack = jest.fn()
const mockRouter = { back: mockBack }
let mockParams: Record<string, string> = {}

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}))

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success' },
}))

const mockToggle = jest.fn()
const mockReset = jest.fn()
const mockUseTimer = jest.fn()

jest.mock('@/hooks/useTimer', () => ({
  useTimer: (options: unknown) => mockUseTimer(options),
}))

jest.mock('@/hooks/useSounds', () => ({
  useSounds: () => ({ playBeep: jest.fn() }),
}))

describe('TimerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockParams = {}
    mockUseTimer.mockReturnValue({
      state: {
        currentSet: 1,
        totalSets: 3,
        phase: 'work',
        timeRemaining: 30,
        isPlaying: true,
      },
      toggle: mockToggle,
      reset: mockReset,
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('param validation', () => {
    it('renders timer when params are valid', () => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.phases.work')).toBeTruthy()
      expect(getByText('00:30')).toBeTruthy()
    })

    it('renders nothing when sets is missing (waits for params)', () => {
      mockParams = { workTime: '30', restTime: '10' }

      const { queryByText } = render(<TimerPage />)

      act(() => {
        jest.runAllTimers()
      })

      // Should not navigate back, just wait for params to be available
      expect(mockBack).not.toHaveBeenCalled()
      // Should render nothing while waiting
      expect(queryByText('timer.phases.work')).toBeNull()
    })

    it('navigates back when sets is zero', () => {
      mockParams = { sets: '0', workTime: '30', restTime: '10' }

      render(<TimerPage />)

      act(() => {
        jest.runAllTimers()
      })

      expect(mockBack).toHaveBeenCalled()
    })

    it('navigates back when workTime is zero', () => {
      mockParams = { sets: '3', workTime: '0', restTime: '10' }

      render(<TimerPage />)

      act(() => {
        jest.runAllTimers()
      })

      expect(mockBack).toHaveBeenCalled()
    })

    it('allows restTime to be zero', () => {
      mockParams = { sets: '3', workTime: '30', restTime: '0' }

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.phases.work')).toBeTruthy()
    })
  })

  describe('phase display', () => {
    beforeEach(() => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }
    })

    it('displays WORK label during work phase', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 1, totalSets: 3, timeRemaining: 30, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.phases.work')).toBeTruthy()
    })

    it('displays REST label during rest phase', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'rest', currentSet: 1, totalSets: 3, timeRemaining: 10, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.phases.rest')).toBeTruthy()
    })

    it('displays Complete! when timer is complete', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'complete', currentSet: 3, totalSets: 3, timeRemaining: 0, isPlaying: false },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.phases.complete')).toBeTruthy()
    })
  })

  describe('timer display', () => {
    beforeEach(() => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }
    })

    it('displays formatted time remaining', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 1, totalSets: 3, timeRemaining: 90, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('01:30')).toBeTruthy()
    })

    it('displays set progress', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 2, totalSets: 5, timeRemaining: 30, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.setProgress')).toBeTruthy()
    })

    it('does not display negative time', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 1, totalSets: 3, timeRemaining: -5, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('00:00')).toBeTruthy()
    })
  })

  describe('controls', () => {
    beforeEach(() => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }
    })

    it('calls toggle when play/pause button is pressed', () => {
      const { getByText } = render(<TimerPage />)

      fireEvent.press(getByText('pause'))

      expect(mockToggle).toHaveBeenCalled()
    })

    it('calls reset when reset button is pressed', () => {
      const { getByText } = render(<TimerPage />)

      fireEvent.press(getByText('refresh'))

      expect(mockReset).toHaveBeenCalled()
    })

    it('shows play icon when paused', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 1, totalSets: 3, timeRemaining: 30, isPlaying: false },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('play')).toBeTruthy()
    })

    it('shows pause icon when playing', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'work', currentSet: 1, totalSets: 3, timeRemaining: 30, isPlaying: true },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { getByText } = render(<TimerPage />)

      expect(getByText('pause')).toBeTruthy()
    })

    it('hides controls when complete', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'complete', currentSet: 3, totalSets: 3, timeRemaining: 0, isPlaying: false },
        toggle: mockToggle,
        reset: mockReset,
      })

      const { queryByText } = render(<TimerPage />)

      expect(queryByText('pause')).toBeNull()
      expect(queryByText('play')).toBeNull()
      expect(queryByText('refresh')).toBeNull()
    })
  })

  describe('auto-navigation on complete', () => {
    beforeEach(() => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }
    })

    it('navigates back after 3 seconds when complete', () => {
      mockUseTimer.mockReturnValue({
        state: { phase: 'complete', currentSet: 3, totalSets: 3, timeRemaining: 0, isPlaying: false },
        toggle: mockToggle,
        reset: mockReset,
      })

      render(<TimerPage />)

      expect(mockBack).not.toHaveBeenCalled()

      act(() => {
        jest.advanceTimersByTime(3000)
      })

      expect(mockBack).toHaveBeenCalled()
    })
  })

  describe('exit button', () => {
    beforeEach(() => {
      mockParams = { sets: '3', workTime: '30', restTime: '10' }
    })

    it('renders hold to exit button', () => {
      const { getByText } = render(<TimerPage />)

      expect(getByText('timer.holdToExit')).toBeTruthy()
    })

    it('navigates back after holding for 1 second', () => {
      const { getByText } = render(<TimerPage />)

      const exitButton = getByText('timer.holdToExit')
      fireEvent(exitButton, 'pressIn')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      act(() => {
        jest.advanceTimersByTime(100)
      })

      expect(mockBack).toHaveBeenCalled()
    })

    it('does not navigate if released early', () => {
      const { getByText } = render(<TimerPage />)

      const exitButton = getByText('timer.holdToExit')
      fireEvent(exitButton, 'pressIn')

      act(() => {
        jest.advanceTimersByTime(500)
      })

      fireEvent(exitButton, 'pressOut')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(mockBack).not.toHaveBeenCalled()
    })
  })
})
