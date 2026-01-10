import { render, fireEvent } from '@testing-library/react-native'
import ConfirmDeleteModal from '../ConfirmDeleteModal'

describe('ConfirmDeleteModal', () => {
  const defaultProps = {
    visible: true,
    presetName: 'My Workout',
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders title', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByText('Delete Preset')).toBeTruthy()
    })

    it('displays confirmation message with preset name', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByText('Are you sure you want to delete "My Workout"?')).toBeTruthy()
    })

    it('renders Cancel and Delete buttons', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByText('Cancel')).toBeTruthy()
      expect(getByText('Delete')).toBeTruthy()
    })

    it('displays different preset names correctly', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} presetName="HIIT Session" />)
      expect(getByText('Are you sure you want to delete "HIIT Session"?')).toBeTruthy()
    })
  })

  describe('confirm functionality', () => {
    it('calls onConfirm when delete button is pressed', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)

      fireEvent.press(getByText('Delete'))

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('cancel functionality', () => {
    it('calls onClose when cancel button is pressed', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)

      fireEvent.press(getByText('Cancel'))

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('has accessible cancel button', () => {
      const { getByLabelText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByLabelText('Cancel delete preset')).toBeTruthy()
    })

    it('has accessible delete button', () => {
      const { getByLabelText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByLabelText('Confirm delete preset')).toBeTruthy()
    })
  })
})
