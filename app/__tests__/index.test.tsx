import { render, fireEvent, waitFor } from '@testing-library/react-native'
import Page from '../index'

const mockPush = jest.fn()
const mockRouter = { push: mockPush }

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}))

const mockSavePreset = jest.fn()
const mockDeletePreset = jest.fn()
const mockPresets = [
  { id: '1', name: 'Quick HIIT', sets: 5, workTime: 20, restTime: 10, createdAt: 1000 },
  { id: '2', name: 'Long Sets', sets: 3, workTime: 120, restTime: 60, createdAt: 2000 },
]

jest.mock('@/hooks/usePresets', () => ({
  usePresets: () => ({
    presets: mockPresets,
    savePreset: mockSavePreset,
    deletePreset: mockDeletePreset,
  }),
}))

jest.mock('@/components/Quickstart', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text, Pressable } = require('react-native')
  return {
    __esModule: true,
    default: ({
      values,
      onChange,
      onStart,
      onSave,
    }: {
      values: { sets: number; workTime: number; restTime: number }
      onChange: (values: { sets: number; workTime: number; restTime: number }) => void
      onStart: () => void
      onSave: () => void
    }) => (
      <View testID="quickstart">
        <Text testID="quickstart-sets">{values.sets}</Text>
        <Text testID="quickstart-workTime">{values.workTime}</Text>
        <Text testID="quickstart-restTime">{values.restTime}</Text>
        <Pressable testID="quickstart-start" onPress={onStart}>
          <Text>Start</Text>
        </Pressable>
        <Pressable testID="quickstart-save" onPress={onSave}>
          <Text>Save</Text>
        </Pressable>
        <Pressable testID="quickstart-change" onPress={() => onChange({ sets: 5, workTime: 45, restTime: 15 })}>
          <Text>Change</Text>
        </Pressable>
      </View>
    ),
  }
})

interface MockPreset {
  id: string
  name: string
  sets: number
  workTime: number
  restTime: number
}

jest.mock('@/components/Presets', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text, Pressable } = require('react-native')
  return {
    __esModule: true,
    default: ({
      presets,
      onSelect,
      onStart,
      onDelete,
    }: {
      presets: MockPreset[]
      onSelect: (values: { sets: number; workTime: number; restTime: number }) => void
      onStart: (values: { sets: number; workTime: number; restTime: number }) => void
      onDelete: (id: string) => void
    }) => (
      <View testID="presets">
        {presets.map((preset: MockPreset) => (
          <View key={preset.id} testID={`preset-${preset.id}`}>
            <Text>{preset.name}</Text>
            <Pressable
              testID={`preset-select-${preset.id}`}
              onPress={() => onSelect({ sets: preset.sets, workTime: preset.workTime, restTime: preset.restTime })}
            >
              <Text>Select</Text>
            </Pressable>
            <Pressable
              testID={`preset-start-${preset.id}`}
              onPress={() => onStart({ sets: preset.sets, workTime: preset.workTime, restTime: preset.restTime })}
            >
              <Text>Start Preset</Text>
            </Pressable>
            <Pressable testID={`preset-delete-${preset.id}`} onPress={() => onDelete(preset.id)}>
              <Text>Delete</Text>
            </Pressable>
          </View>
        ))}
      </View>
    ),
  }
})

jest.mock('@/components/SavePresetModal', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { View, Text, Pressable } = require('react-native')
  return {
    __esModule: true,
    default: ({
      visible,
      values,
      onSave,
      onClose,
    }: {
      visible: boolean
      values: { sets: number; workTime: number; restTime: number }
      onSave: (name: string) => void
      onClose: () => void
    }) => {
      if (!visible) return null
      return (
        <View testID="save-modal">
          <Text testID="modal-sets">{values.sets}</Text>
          <Text testID="modal-workTime">{values.workTime}</Text>
          <Text testID="modal-restTime">{values.restTime}</Text>
          <Pressable testID="modal-save" onPress={() => onSave('New Preset')}>
            <Text>Save Preset</Text>
          </Pressable>
          <Pressable testID="modal-close" onPress={onClose}>
            <Text>Close</Text>
          </Pressable>
        </View>
      )
    },
  }
})

describe('Page (index)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders Quickstart component', () => {
      const { getByTestId } = render(<Page />)
      expect(getByTestId('quickstart')).toBeTruthy()
    })

    it('renders Presets component', () => {
      const { getByTestId } = render(<Page />)
      expect(getByTestId('presets')).toBeTruthy()
    })

    it('does not show SavePresetModal by default', () => {
      const { queryByTestId } = render(<Page />)
      expect(queryByTestId('save-modal')).toBeNull()
    })

    it('renders presets from usePresets hook', () => {
      const { getByText } = render(<Page />)
      expect(getByText('Quick HIIT')).toBeTruthy()
      expect(getByText('Long Sets')).toBeTruthy()
    })
  })

  describe('default preset values', () => {
    it('has default sets of 3', () => {
      const { getByTestId } = render(<Page />)
      expect(getByTestId('quickstart-sets').props.children).toBe(3)
    })

    it('has default workTime of 60', () => {
      const { getByTestId } = render(<Page />)
      expect(getByTestId('quickstart-workTime').props.children).toBe(60)
    })

    it('has default restTime of 30', () => {
      const { getByTestId } = render(<Page />)
      expect(getByTestId('quickstart-restTime').props.children).toBe(30)
    })
  })

  describe('handleStart', () => {
    it('navigates to timer with current values when Start is pressed', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-start'))

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/timer',
        params: {
          sets: '3',
          workTime: '60',
          restTime: '30',
        },
      })
    })

    it('navigates to timer with updated values after onChange', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-change'))
      fireEvent.press(getByTestId('quickstart-start'))

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/timer',
        params: {
          sets: '5',
          workTime: '45',
          restTime: '15',
        },
      })
    })

    it('navigates to timer with preset values when preset Start is pressed', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('preset-start-1'))

      expect(mockPush).toHaveBeenCalledWith({
        pathname: '/timer',
        params: {
          sets: '5',
          workTime: '20',
          restTime: '10',
        },
      })
    })
  })

  describe('preset selection', () => {
    it('updates preset values when a preset is selected', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('preset-select-1'))

      expect(getByTestId('quickstart-sets').props.children).toBe(5)
      expect(getByTestId('quickstart-workTime').props.children).toBe(20)
      expect(getByTestId('quickstart-restTime').props.children).toBe(10)
    })
  })

  describe('preset deletion', () => {
    it('calls deletePreset when delete is pressed', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('preset-delete-1'))

      expect(mockDeletePreset).toHaveBeenCalledWith('1')
    })
  })

  describe('save modal', () => {
    it('shows SavePresetModal when Save is pressed', () => {
      const { getByTestId, queryByTestId } = render(<Page />)

      expect(queryByTestId('save-modal')).toBeNull()

      fireEvent.press(getByTestId('quickstart-save'))

      expect(getByTestId('save-modal')).toBeTruthy()
    })

    it('passes current values to SavePresetModal', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-save'))

      expect(getByTestId('modal-sets').props.children).toBe(3)
      expect(getByTestId('modal-workTime').props.children).toBe(60)
      expect(getByTestId('modal-restTime').props.children).toBe(30)
    })

    it('passes updated values to SavePresetModal after onChange', () => {
      const { getByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-change'))
      fireEvent.press(getByTestId('quickstart-save'))

      expect(getByTestId('modal-sets').props.children).toBe(5)
      expect(getByTestId('modal-workTime').props.children).toBe(45)
      expect(getByTestId('modal-restTime').props.children).toBe(15)
    })

    it('closes modal when close is pressed', () => {
      const { getByTestId, queryByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-save'))
      expect(getByTestId('save-modal')).toBeTruthy()

      fireEvent.press(getByTestId('modal-close'))
      expect(queryByTestId('save-modal')).toBeNull()
    })

    it('calls savePreset and closes modal when save is confirmed', async () => {
      mockSavePreset.mockResolvedValue(undefined)
      const { getByTestId, queryByTestId } = render(<Page />)

      fireEvent.press(getByTestId('quickstart-save'))
      fireEvent.press(getByTestId('modal-save'))

      await waitFor(() => {
        expect(mockSavePreset).toHaveBeenCalledWith('New Preset', {
          sets: 3,
          workTime: 60,
          restTime: 30,
        })
      })

      await waitFor(() => {
        expect(queryByTestId('save-modal')).toBeNull()
      })
    })
  })

  describe('onChange callback', () => {
    it('updates quickstart values when onChange is called', () => {
      const { getByTestId } = render(<Page />)

      expect(getByTestId('quickstart-sets').props.children).toBe(3)

      fireEvent.press(getByTestId('quickstart-change'))

      expect(getByTestId('quickstart-sets').props.children).toBe(5)
      expect(getByTestId('quickstart-workTime').props.children).toBe(45)
      expect(getByTestId('quickstart-restTime').props.children).toBe(15)
    })
  })
})
