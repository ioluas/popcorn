import { render, fireEvent, waitFor } from '@testing-library/react-native'
import SettingsPage from '../settings'

const mockBack = jest.fn()
const mockRouter = { back: mockBack }

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}))

const mockChangeLanguage = jest.fn().mockResolvedValue(undefined)
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}))

const mockSaveLanguage = jest.fn().mockResolvedValue(undefined)
const mockNeedsRTLRestart = jest.fn()
const mockApplyRTL = jest.fn()

jest.mock('@/i18n', () => ({
  SUPPORTED_LANGUAGES: ['en', 'sv', 'ar'],
  saveLanguage: (lang: string) => mockSaveLanguage(lang),
  needsRTLRestart: (lang: string) => mockNeedsRTLRestart(lang),
  applyRTL: (lang: string) => mockApplyRTL(lang),
}))

jest.mock('@/components/RestartConfirmModal', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const RN = require('react-native')
  return {
    __esModule: true,
    default: function MockRestartConfirmModal({
      visible,
      onConfirm,
      onClose,
    }: {
      visible: boolean
      onConfirm: () => void
      onClose: () => void
    }) {
      if (!visible) return null
      return React.createElement(RN.View, { testID: 'restart-modal' }, [
        React.createElement(
          RN.Pressable,
          { testID: 'restart-confirm', key: 'confirm', onPress: onConfirm },
          React.createElement(RN.Text, null, 'Confirm Restart')
        ),
        React.createElement(
          RN.Pressable,
          { testID: 'restart-cancel', key: 'cancel', onPress: onClose },
          React.createElement(RN.Text, null, 'Cancel')
        ),
      ])
    },
  }
})

describe('SettingsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockI18n.language = 'en'
    mockNeedsRTLRestart.mockReturnValue(false)
  })

  describe('rendering', () => {
    it('renders settings title', () => {
      const { getByText } = render(<SettingsPage />)
      expect(getByText('settings.title')).toBeTruthy()
    })

    it('renders language section', () => {
      const { getByText } = render(<SettingsPage />)
      expect(getByText('settings.language.label')).toBeTruthy()
    })

    it('renders all language options', () => {
      const { getByText } = render(<SettingsPage />)
      expect(getByText('English')).toBeTruthy()
      expect(getByText('Svenska')).toBeTruthy()
      expect(getByText('العربية')).toBeTruthy()
    })

    it('shows checkmark only on current language', () => {
      mockI18n.language = 'sv'
      const { getAllByText } = render(<SettingsPage />)

      // Ionicons mock renders icon name as text content
      // Only one checkmark should be rendered (for the selected language)
      const checkmarks = getAllByText('checkmark')

      expect(checkmarks).toHaveLength(1)
    })
  })

  describe('navigation', () => {
    it('navigates back when back button is pressed', () => {
      const { getByText } = render(<SettingsPage />)

      // Ionicons mock renders icon name as text content
      const backIcon = getByText('arrow-back')
      fireEvent.press(backIcon)

      expect(mockBack).toHaveBeenCalledTimes(1)
    })
  })

  describe('language selection', () => {
    it('does nothing when selecting already selected language', async () => {
      mockI18n.language = 'en'
      const { getByText } = render(<SettingsPage />)

      fireEvent.press(getByText('English'))

      expect(mockSaveLanguage).not.toHaveBeenCalled()
      expect(mockChangeLanguage).not.toHaveBeenCalled()
    })

    it('changes language when selecting a different non-RTL language', async () => {
      mockI18n.language = 'en'
      mockNeedsRTLRestart.mockReturnValue(false)

      const { getByText } = render(<SettingsPage />)

      fireEvent.press(getByText('Svenska'))

      await waitFor(() => {
        expect(mockSaveLanguage).toHaveBeenCalledWith('sv')
        expect(mockChangeLanguage).toHaveBeenCalledWith('sv')
      })
    })

    it('shows restart modal when switching to RTL language', async () => {
      mockI18n.language = 'en'
      mockNeedsRTLRestart.mockReturnValue(true)

      const { getByText, getByTestId } = render(<SettingsPage />)

      fireEvent.press(getByText('العربية'))

      await waitFor(() => {
        expect(getByTestId('restart-modal')).toBeTruthy()
      })

      // Should not change language yet
      expect(mockChangeLanguage).not.toHaveBeenCalled()
    })

    it('shows restart modal when switching from RTL to LTR language', async () => {
      mockI18n.language = 'ar'
      mockNeedsRTLRestart.mockReturnValue(true)

      const { getByText, getByTestId } = render(<SettingsPage />)

      fireEvent.press(getByText('English'))

      await waitFor(() => {
        expect(getByTestId('restart-modal')).toBeTruthy()
      })
    })
  })

  describe('restart modal interaction', () => {
    it('closes modal when cancel is pressed', async () => {
      mockI18n.language = 'en'
      mockNeedsRTLRestart.mockReturnValue(true)

      const { getByText, getByTestId, queryByTestId } = render(<SettingsPage />)

      fireEvent.press(getByText('العربية'))

      await waitFor(() => {
        expect(getByTestId('restart-modal')).toBeTruthy()
      })

      fireEvent.press(getByTestId('restart-cancel'))

      await waitFor(() => {
        expect(queryByTestId('restart-modal')).toBeNull()
      })

      // Language should not have changed
      expect(mockChangeLanguage).not.toHaveBeenCalled()
    })

    it('changes language and applies RTL when restart is confirmed', async () => {
      mockI18n.language = 'en'
      mockNeedsRTLRestart.mockReturnValue(true)

      const { getByText, getByTestId } = render(<SettingsPage />)

      fireEvent.press(getByText('العربية'))

      await waitFor(() => {
        expect(getByTestId('restart-modal')).toBeTruthy()
      })

      fireEvent.press(getByTestId('restart-confirm'))

      await waitFor(() => {
        expect(mockSaveLanguage).toHaveBeenCalledWith('ar')
        expect(mockChangeLanguage).toHaveBeenCalledWith('ar')
        expect(mockApplyRTL).toHaveBeenCalledWith('ar')
      })
    })
  })
})
