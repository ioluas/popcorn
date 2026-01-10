import { render, fireEvent } from '@testing-library/react-native'
import Presets from '../Presets'
import { Preset } from '@/utils/General'

describe('Presets', () => {
  const mockPresets: Preset[] = [
    { id: '1', name: 'HIIT', sets: 4, workTime: 30, restTime: 10, createdAt: 1000 },
    { id: '2', name: 'Tabata', sets: 8, workTime: 20, restTime: 10, createdAt: 2000 },
  ]

  const defaultProps = {
    presets: mockPresets,
    onSelect: jest.fn(),
    onStart: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('empty state', () => {
    it('shows empty message when no presets', () => {
      const { getByText } = render(<Presets {...defaultProps} presets={[]} />)
      expect(getByText('No presets yet')).toBeTruthy()
    })

    it('shows instruction to create preset', () => {
      const { getByText } = render(<Presets {...defaultProps} presets={[]} />)
      expect(getByText('To create your first preset, use the Save button in Quickstart.')).toBeTruthy()
    })
  })

  describe('rendering presets', () => {
    it('shows Presets title when presets exist', () => {
      const { getByText } = render(<Presets {...defaultProps} />)
      expect(getByText('Presets')).toBeTruthy()
    })

    it('displays preset names', () => {
      const { getByText } = render(<Presets {...defaultProps} />)
      expect(getByText('HIIT')).toBeTruthy()
      expect(getByText('Tabata')).toBeTruthy()
    })

    it('displays preset details with formatted times', () => {
      const { getByText } = render(<Presets {...defaultProps} />)
      expect(getByText('4 sets · 00:30 work · 00:10 rest')).toBeTruthy()
      expect(getByText('8 sets · 00:20 work · 00:10 rest')).toBeTruthy()
    })
  })

  describe('selecting preset', () => {
    it('calls onSelect with preset values when preset info is pressed', () => {
      const { getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByText('HIIT'))

      expect(defaultProps.onSelect).toHaveBeenCalledWith({
        sets: 4,
        workTime: 30,
        restTime: 10,
      })
    })
  })

  describe('starting preset', () => {
    it('calls onStart with preset values when play button is pressed', () => {
      const { getByLabelText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByLabelText('Start HIIT preset'))

      expect(defaultProps.onStart).toHaveBeenCalledWith({
        sets: 4,
        workTime: 30,
        restTime: 10,
      })
    })
  })

  describe('deleting preset', () => {
    it('shows confirmation modal when delete button is pressed', () => {
      const { getByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByLabelText('Delete HIIT preset'))

      expect(getByText('Delete Preset')).toBeTruthy()
      expect(getByText('Are you sure you want to delete "HIIT"?')).toBeTruthy()
    })

    it('calls onDelete when deletion is confirmed', () => {
      const { getByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByLabelText('Delete HIIT preset'))
      fireEvent.press(getByText('Delete'))

      expect(defaultProps.onDelete).toHaveBeenCalledWith('1')
    })

    it('does not call onDelete when deletion is cancelled', () => {
      const { getByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByLabelText('Delete HIIT preset'))
      fireEvent.press(getByText('Cancel'))

      expect(defaultProps.onDelete).not.toHaveBeenCalled()
    })

    it('closes modal after confirming delete', () => {
      const { getByLabelText, getByText, queryByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getByLabelText('Delete HIIT preset'))
      fireEvent.press(getByText('Delete'))

      expect(queryByText('Delete Preset')).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('has accessible play buttons for each preset', () => {
      const { getByLabelText } = render(<Presets {...defaultProps} />)
      expect(getByLabelText('Start HIIT preset')).toBeTruthy()
      expect(getByLabelText('Start Tabata preset')).toBeTruthy()
    })

    it('has accessible delete buttons for each preset', () => {
      const { getByLabelText } = render(<Presets {...defaultProps} />)
      expect(getByLabelText('Delete HIIT preset')).toBeTruthy()
      expect(getByLabelText('Delete Tabata preset')).toBeTruthy()
    })
  })
})
