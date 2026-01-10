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
      expect(getByText('presets.noPresets')).toBeTruthy()
    })

    it('shows instruction to create preset', () => {
      const { getByText } = render(<Presets {...defaultProps} presets={[]} />)
      expect(getByText('presets.description')).toBeTruthy()
    })
  })

  describe('rendering presets', () => {
    it('shows Presets title when presets exist', () => {
      const { getByText } = render(<Presets {...defaultProps} />)
      expect(getByText('presets.title')).toBeTruthy()
    })

    it('displays preset names', () => {
      const { getByText } = render(<Presets {...defaultProps} />)
      expect(getByText('HIIT')).toBeTruthy()
      expect(getByText('Tabata')).toBeTruthy()
    })

    it('displays preset details with formatted times', () => {
      const { getAllByText } = render(<Presets {...defaultProps} />)
      // The mock returns the key for both presets
      expect(getAllByText('presets.itemDetails').length).toBe(2)
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
      const { getAllByLabelText } = render(<Presets {...defaultProps} />)

      // The mock returns the key for all presets since interpolation doesn't change the key
      fireEvent.press(getAllByLabelText('presets.accessibility.startPreset')[0])

      expect(defaultProps.onStart).toHaveBeenCalledWith({
        sets: 4,
        workTime: 30,
        restTime: 10,
      })
    })
  })

  describe('deleting preset', () => {
    it('shows confirmation modal when delete button is pressed', () => {
      const { getAllByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getAllByLabelText('presets.accessibility.deletePreset')[0])

      expect(getByText('confirmDeleteModal.title')).toBeTruthy()
    })

    it('calls onDelete when deletion is confirmed', () => {
      const { getAllByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getAllByLabelText('presets.accessibility.deletePreset')[0])
      fireEvent.press(getByText('confirmDeleteModal.buttons.delete'))

      expect(defaultProps.onDelete).toHaveBeenCalledWith('1')
    })

    it('does not call onDelete when deletion is cancelled', () => {
      const { getAllByLabelText, getByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getAllByLabelText('presets.accessibility.deletePreset')[0])
      fireEvent.press(getByText('confirmDeleteModal.buttons.cancel'))

      expect(defaultProps.onDelete).not.toHaveBeenCalled()
    })

    it('closes modal after confirming delete', () => {
      const { getAllByLabelText, getByText, queryByText } = render(<Presets {...defaultProps} />)

      fireEvent.press(getAllByLabelText('presets.accessibility.deletePreset')[0])
      fireEvent.press(getByText('confirmDeleteModal.buttons.delete'))

      expect(queryByText('confirmDeleteModal.title')).toBeNull()
    })
  })

  describe('accessibility', () => {
    it('has accessible play buttons for each preset', () => {
      const { getAllByLabelText } = render(<Presets {...defaultProps} />)
      expect(getAllByLabelText('presets.accessibility.startPreset').length).toBe(2)
    })

    it('has accessible delete buttons for each preset', () => {
      const { getAllByLabelText } = render(<Presets {...defaultProps} />)
      expect(getAllByLabelText('presets.accessibility.deletePreset').length).toBe(2)
    })
  })
})
