import { render, fireEvent } from '@testing-library/react-native'
import RestartConfirmModal from '../RestartConfirmModal'

describe('RestartConfirmModal', () => {
  const defaultProps = {
    visible: true,
    onConfirm: jest.fn(),
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders title', () => {
      const { getByText } = render(<RestartConfirmModal {...defaultProps} />)
      expect(getByText('common.restartRequired')).toBeTruthy()
    })

    it('renders message', () => {
      const { getByText } = render(<RestartConfirmModal {...defaultProps} />)
      expect(getByText('common.restartMessage')).toBeTruthy()
    })

    it('renders Cancel and Restart buttons', () => {
      const { getByText } = render(<RestartConfirmModal {...defaultProps} />)
      expect(getByText('common.cancel')).toBeTruthy()
      expect(getByText('common.restart')).toBeTruthy()
    })
  })

  describe('confirm functionality', () => {
    it('calls onConfirm when restart button is pressed', () => {
      const { getByText } = render(<RestartConfirmModal {...defaultProps} />)

      fireEvent.press(getByText('common.restart'))

      expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
    })
  })

  describe('cancel functionality', () => {
    it('calls onClose when cancel button is pressed', () => {
      const { getByText } = render(<RestartConfirmModal {...defaultProps} />)

      fireEvent.press(getByText('common.cancel'))

      expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('visibility', () => {
    it('does not render content when not visible', () => {
      const { queryByText } = render(<RestartConfirmModal {...defaultProps} visible={false} />)

      expect(queryByText('common.restartRequired')).toBeNull()
    })
  })
})
