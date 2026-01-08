import { render, fireEvent } from '@testing-library/react-native'
import SavePresetModal from '../SavePresetModal'

describe('SavePresetModal', () => {
  const defaultProps = {
    visible: true,
    values: { sets: 3, workTime: 30, restTime: 10 },
    onSave: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders title', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)
      expect(getByText('Save Preset')).toBeTruthy()
    })

    it('displays preset values', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      expect(getByText('Sets')).toBeTruthy()
      expect(getByText('3')).toBeTruthy()
      expect(getByText('Work')).toBeTruthy()
      expect(getByText('00:30')).toBeTruthy()
      expect(getByText('Rest')).toBeTruthy()
      expect(getByText('00:10')).toBeTruthy()
    })

    it('renders input with placeholder', () => {
      const { getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)
      expect(getByPlaceholderText('Enter preset name')).toBeTruthy()
    })

    it('renders Cancel and Save buttons', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      expect(getByText('Cancel')).toBeTruthy()
      expect(getByText('Save')).toBeTruthy()
    })
  })

  describe('save button state', () => {
    it('save button is disabled when name is empty', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      const saveButton = getByText('Save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('save button is disabled when name is only whitespace', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('Enter preset name')
      fireEvent.changeText(input, '   ')

      const saveButton = getByText('Save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })
  })

  describe('save functionality', () => {
    it('calls onSave with trimmed name when save is pressed', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('Enter preset name')
      fireEvent.changeText(input, '  My Workout  ')

      const saveButton = getByText('Save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).toHaveBeenCalledWith('My Workout')
    })

    it('clears input after save', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('Enter preset name')
      fireEvent.changeText(input, 'Test Preset')
      fireEvent.press(getByText('Save'))

      expect(input).toHaveDisplayValue('')
    })
  })

  describe('cancel functionality', () => {
    it('calls onClose when cancel is pressed', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      fireEvent.press(getByText('Cancel'))

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('clears input when cancel is pressed', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('Enter preset name')
      fireEvent.changeText(input, 'Test Preset')
      fireEvent.press(getByText('Cancel'))

      expect(input).toHaveDisplayValue('')
    })
  })

  describe('different values', () => {
    it('displays formatted time for longer durations', () => {
      const props = {
        ...defaultProps,
        values: { sets: 5, workTime: 90, restTime: 45 },
      }
      const { getByText } = render(<SavePresetModal {...props} />)

      expect(getByText('5')).toBeTruthy()
      expect(getByText('01:30')).toBeTruthy()
      expect(getByText('00:45')).toBeTruthy()
    })
  })
})
