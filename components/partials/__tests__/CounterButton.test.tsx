import { render, fireEvent, act } from '@testing-library/react-native'
import CounterButton from '../CounterButton'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Soft: 'soft',
  },
}))

describe('CounterButton', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('rendering', () => {
    it('renders increment button with amount 1', () => {
      const setter = jest.fn()
      const { getByText } = render(<CounterButton type="increment" amount={1} setter={setter} />)

      expect(getByText('+')).toBeTruthy()
    })

    it('renders increment button with amount > 1', () => {
      const setter = jest.fn()
      const { getByText } = render(<CounterButton type="increment" amount={5} setter={setter} />)

      expect(getByText('+5')).toBeTruthy()
    })

    it('renders decrement button with amount 1', () => {
      const setter = jest.fn()
      const { getByText } = render(<CounterButton type="decrement" amount={1} setter={setter} />)

      expect(getByText('-')).toBeTruthy()
    })

    it('renders decrement button with amount > 1', () => {
      const setter = jest.fn()
      const { getByText } = render(<CounterButton type="decrement" amount={5} setter={setter} />)

      expect(getByText('-5')).toBeTruthy()
    })
  })

  describe('increment', () => {
    it('increments value on press', () => {
      let value = 10
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="increment" amount={1} setter={setter} />)

      fireEvent(getByText('+'), 'pressIn')
      fireEvent(getByText('+'), 'pressOut')

      expect(setter).toHaveBeenCalled()
      expect(value).toBe(11)
    })

    it('increments by specified amount', () => {
      let value = 10
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="increment" amount={5} setter={setter} />)

      fireEvent(getByText('+5'), 'pressIn')
      fireEvent(getByText('+5'), 'pressOut')

      expect(value).toBe(15)
    })
  })

  describe('decrement', () => {
    it('decrements value on press', () => {
      let value = 10
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="decrement" amount={1} setter={setter} />)

      fireEvent(getByText('-'), 'pressIn')
      fireEvent(getByText('-'), 'pressOut')

      expect(setter).toHaveBeenCalled()
      expect(value).toBe(9)
    })

    it('decrements by specified amount', () => {
      let value = 20
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="decrement" amount={5} setter={setter} />)

      fireEvent(getByText('-5'), 'pressIn')
      fireEvent(getByText('-5'), 'pressOut')

      expect(value).toBe(15)
    })

    it('does not decrement below 1', () => {
      let value = 3
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="decrement" amount={5} setter={setter} />)

      fireEvent(getByText('-5'), 'pressIn')
      fireEvent(getByText('-5'), 'pressOut')

      expect(value).toBe(1)
    })
  })

  describe('long press', () => {
    it('rapidly increments on long press', () => {
      let value = 10
      const setter = jest.fn((updater) => {
        value = updater(value)
      })

      const { getByText } = render(<CounterButton type="increment" amount={1} setter={setter} />)

      fireEvent(getByText('+'), 'pressIn')

      // Initial press
      expect(value).toBe(11)

      // Wait for initial delay (300ms) + some rapid intervals (100ms each)
      act(() => {
        jest.advanceTimersByTime(300)
      })

      act(() => {
        jest.advanceTimersByTime(100)
      })
      expect(value).toBe(12)

      act(() => {
        jest.advanceTimersByTime(100)
      })
      expect(value).toBe(13)

      fireEvent(getByText('+'), 'pressOut')

      // No more updates after release
      const valueAfterRelease = value
      act(() => {
        jest.advanceTimersByTime(500)
      })
      expect(value).toBe(valueAfterRelease)
    })

    it('stops rapid updates on press out', () => {
      let callCount = 0
      const setter = jest.fn(() => {
        callCount++
      })

      const { getByText } = render(<CounterButton type="increment" amount={1} setter={setter} />)

      fireEvent(getByText('+'), 'pressIn')
      expect(callCount).toBe(1)

      // Release before rapid mode kicks in
      fireEvent(getByText('+'), 'pressOut')

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Should still be 1 (no rapid updates)
      expect(callCount).toBe(1)
    })
  })
})
