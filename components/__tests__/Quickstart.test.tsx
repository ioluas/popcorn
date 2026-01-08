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
      expect(getByText('Quickstart')).toBeTruthy()
    })

    it('renders labels', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('Sets')).toBeTruthy()
      expect(getByText('Workout')).toBeTruthy()
      expect(getByText('Rest')).toBeTruthy()
    })

    it('displays current values', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('3')).toBeTruthy()
      expect(getByText('00:30')).toBeTruthy()
      expect(getByText('00:10')).toBeTruthy()
    })

    it('renders Start button', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)
      expect(getByText('Start')).toBeTruthy()
    })

    it('renders Save button', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)
      expect(getByText('Save')).toBeTruthy()
    })
  })

  describe('expand/collapse', () => {
    it('content is visible by default', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      expect(getByText('Sets')).toBeTruthy()
      expect(getByText('Workout')).toBeTruthy()
      expect(getByText('Rest')).toBeTruthy()
    })

    it('hides content when header is pressed', () => {
      const { getByText, queryByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('Quickstart'))

      expect(queryByText('Sets')).toBeNull()
      expect(queryByText('Workout')).toBeNull()
      expect(queryByText('Rest')).toBeNull()
    })

    it('shows content again when header is pressed twice', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('Quickstart'))
      fireEvent.press(getByText('Quickstart'))

      expect(getByText('Sets')).toBeTruthy()
      expect(getByText('Workout')).toBeTruthy()
      expect(getByText('Rest')).toBeTruthy()
    })

    it('Start button is always visible', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('Quickstart'))

      expect(getByText('Start')).toBeTruthy()
    })
  })

  describe('button actions', () => {
    it('calls onStart when Start button is pressed', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('Start'))

      expect(defaultProps.onStart).toHaveBeenCalledTimes(1)
    })

    it('calls onSave when Save button is pressed', () => {
      const { getByText } = render(<Quickstart {...defaultProps} />)

      fireEvent.press(getByText('Save'))

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
