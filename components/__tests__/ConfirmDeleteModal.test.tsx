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
      expect(getByText('confirmDeleteModal.title')).toBeTruthy()
    })

    it('displays confirmation message with preset name', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)
      // The mock returns key with interpolated values
      expect(getByText('confirmDeleteModal.message')).toBeTruthy()
    })

    it('renders Cancel and Delete buttons', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByText('confirmDeleteModal.buttons.cancel')).toBeTruthy()
      expect(getByText('confirmDeleteModal.buttons.delete')).toBeTruthy()
    })
  })

  describe('confirm functionality', () => {
    it('calls onConfirm when delete button is pressed', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)

      fireEvent.press(getByText('confirmDeleteModal.buttons.delete'))

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('cancel functionality', () => {
    it('calls onClose when cancel button is pressed', () => {
      const { getByText } = render(<ConfirmDeleteModal {...defaultProps} />)

      fireEvent.press(getByText('confirmDeleteModal.buttons.cancel'))

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('accessibility', () => {
    it('has accessible cancel button', () => {
      const { getByLabelText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByLabelText('confirmDeleteModal.accessibility.cancelDelete')).toBeTruthy()
    })

    it('has accessible delete button', () => {
      const { getByLabelText } = render(<ConfirmDeleteModal {...defaultProps} />)
      expect(getByLabelText('confirmDeleteModal.accessibility.confirmDelete')).toBeTruthy()
    })
  })
})
