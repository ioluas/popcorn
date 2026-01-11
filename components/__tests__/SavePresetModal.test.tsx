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
      expect(getByText('savePresetModal.title')).toBeTruthy()
    })

    it('displays preset values', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      expect(getByText('savePresetModal.labels.sets')).toBeTruthy()
      expect(getByText('3')).toBeTruthy()
      expect(getByText('savePresetModal.labels.work')).toBeTruthy()
      expect(getByText('00:30')).toBeTruthy()
      expect(getByText('savePresetModal.labels.rest')).toBeTruthy()
      expect(getByText('00:10')).toBeTruthy()
    })

    it('renders input with placeholder', () => {
      const { getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)
      expect(getByPlaceholderText('savePresetModal.placeholder')).toBeTruthy()
    })

    it('renders Cancel and Save buttons', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      expect(getByText('savePresetModal.buttons.cancel')).toBeTruthy()
      expect(getByText('savePresetModal.buttons.save')).toBeTruthy()
    })
  })

  describe('save button state', () => {
    it('save button is disabled when name is empty', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      const saveButton = getByText('savePresetModal.buttons.save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })

    it('save button is disabled when name is only whitespace', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('savePresetModal.placeholder')
      fireEvent.changeText(input, '   ')

      const saveButton = getByText('savePresetModal.buttons.save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).not.toHaveBeenCalled()
    })
  })

  describe('save functionality', () => {
    it('calls onSave with trimmed name when save is pressed', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('savePresetModal.placeholder')
      fireEvent.changeText(input, '  My Workout  ')

      const saveButton = getByText('savePresetModal.buttons.save')
      fireEvent.press(saveButton)

      expect(defaultProps.onSave).toHaveBeenCalledWith('My Workout')
    })

    it('clears input after save', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('savePresetModal.placeholder')
      fireEvent.changeText(input, 'Test Preset')
      fireEvent.press(getByText('savePresetModal.buttons.save'))

      expect(input).toHaveDisplayValue('')
    })
  })

  describe('cancel functionality', () => {
    it('calls onClose when cancel is pressed', () => {
      const { getByText } = render(<SavePresetModal {...defaultProps} />)

      fireEvent.press(getByText('savePresetModal.buttons.cancel'))

      expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('clears input when cancel is pressed', () => {
      const { getByText, getByPlaceholderText } = render(<SavePresetModal {...defaultProps} />)

      const input = getByPlaceholderText('savePresetModal.placeholder')
      fireEvent.changeText(input, 'Test Preset')
      fireEvent.press(getByText('savePresetModal.buttons.cancel'))

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
