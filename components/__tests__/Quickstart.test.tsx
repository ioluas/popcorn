import { render, fireEvent } from '@testing-library/react-native'
import Quickstart from '../Quickstart'

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Soft: 'soft' },
}))

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons')
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons')

describe('Quickstart', () => {
  const defaultProps = {
    values: { sets: 3, workTime: 30, restTime: 10 },
    onChange: jest.fn(),
    onStart: jest.fn(),
    onSave: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders title', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)
      expect(getByText('quickstart.title')).toBeTruthy()
    })

    it('renders labels', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('quickstart.labels.sets')).toBeTruthy()
      expect(getByText('quickstart.labels.workout')).toBeTruthy()
      expect(getByText('quickstart.labels.rest')).toBeTruthy()
    })

    it('displays current values', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('3')).toBeTruthy()
      expect(getByText('00:30')).toBeTruthy()
      expect(getByText('00:10')).toBeTruthy()
    })

    it('renders Start button', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)
      expect(getByText('quickstart.buttons.start')).toBeTruthy()
    })

    it('renders Save button', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)
      expect(getByText('quickstart.buttons.save')).toBeTruthy()
    })
  })

  describe('expand/collapse', () => {
    it('content is visible by default', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('quickstart.labels.sets')).toBeTruthy()
      expect(getByText('quickstart.labels.workout')).toBeTruthy()
      expect(getByText('quickstart.labels.rest')).toBeTruthy()
    })

    it('hides content when header is pressed', () => {
      const { getByText, queryByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.title'))

      expect(queryByText('quickstart.labels.sets')).toBeNull()
      expect(queryByText('quickstart.labels.workout')).toBeNull()
      expect(queryByText('quickstart.labels.rest')).toBeNull()
    })

    it('shows content again when header is pressed twice', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.title'))
      fireEvent.press(getByText('quickstart.title'))

      expect(getByText('quickstart.labels.sets')).toBeTruthy()
      expect(getByText('quickstart.labels.workout')).toBeTruthy()
      expect(getByText('quickstart.labels.rest')).toBeTruthy()
    })

    it('Start button is always visible', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.title'))

      expect(getByText('quickstart.buttons.start')).toBeTruthy()
    })
  })

  describe('button actions', () => {
    it('calls onStart when Start button is pressed', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.buttons.start'))

      expect(defaultProps.onStart).toHaveBeenCalledTimes(1)
    })

    it('calls onStart with no arguments (not the touch event)', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.buttons.start'))

      // Ensure onStart is called with no arguments, not the touch event
      expect(defaultProps.onStart).toHaveBeenCalledWith()
    })

    it('calls onSave when Save button is pressed', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('quickstart.buttons.save'))

      expect(defaultProps.onSave).toHaveBeenCalledTimes(1)
    })
  })

  describe('counter buttons', () => {
    it('renders increment and decrement buttons for sets', () => {
      const { getAllByText } = render(<Quickstart {...defaultProps} />)

      // Sets has +1 and -1 buttons (shown as + and -)
      const plusButtons = getAllByText('+')
      const minusButtons = getAllByText('-')

      expect(plusButtons.length).toBeGreaterThan(0)
      expect(minusButtons.length).toBeGreaterThan(0)
    })

    it('renders +5 and -5 buttons for workout and rest', () => {
      const { getAllByText } = render(<Quickstart {...defaultProps} />)

      // Workout and Rest each have +5 and -5 buttons
      const plus5Buttons = getAllByText('+5')
      const minus5Buttons = getAllByText('-5')

      expect(plus5Buttons.length).toBe(2) // One for workout, one for rest
      expect(minus5Buttons.length).toBe(2)
    })
  })

  describe('counter button actions', () => {
    it('calls onChange with updated sets when + is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('sets-increment'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, sets: 4 })
    })

    it('calls onChange with updated sets when - is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('sets-decrement'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, sets: 2 })
    })

    it('calls onChange with updated workTime when +1 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('work-increment-1'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, workTime: 31 })
    })

    it('calls onChange with updated workTime when -1 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('work-decrement-1'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, workTime: 29 })
    })

    it('calls onChange with updated workTime when +5 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('work-increment-5'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, workTime: 35 })
    })

    it('calls onChange with updated workTime when -5 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('work-decrement-5'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, workTime: 25 })
    })

    it('calls onChange with updated restTime when +1 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('rest-increment-1'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, restTime: 11 })
    })

    it('calls onChange with updated restTime when -1 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('rest-decrement-1'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, restTime: 9 })
    })

    it('calls onChange with updated restTime when +5 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('rest-increment-5'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, restTime: 15 })
    })

    it('calls onChange with updated restTime when -5 is pressed', () => {
      const { getByTestId } = render(<Quickstart {...defaultProps} />)
      fireEvent(getByTestId('rest-decrement-5'), 'pressIn')
      expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
      const updater = defaultProps.onChange.mock.calls[0][0]
      expect(updater(defaultProps.values)).toEqual({ ...defaultProps.values, restTime: 5 })
    })
  })

  describe('different values', () => {
    it('displays formatted time for longer durations', () => {
      const props = {
        ...defaultProps,
        values: { sets: 10, workTime: 90, restTime: 45 },
      }
      const { getByText } = render(<Quickstart {...props} />)

      expect(getByText('10')).toBeTruthy()
      expect(getByText('01:30')).toBeTruthy()
      expect(getByText('00:45')).toBeTruthy()
    })
  })
})
