import { ReactNode } from 'react'
import { render, act, waitFor } from '@testing-library/react-native'
import { I18nManager, Alert } from 'react-native'
import RootLayout from '../_layout'
import { initI18n, isRTL } from '@/i18n'

jest.mock('expo-router', () => {
  const { View } = jest.requireActual('react-native')
  return {
    Stack: ({ screenOptions, children }: { screenOptions: object; children?: ReactNode }) => (
      <View testID="stack" screenOptions={screenOptions}>
        {children}
      </View>
    ),
  }
})

jest.mock('@/i18n', () => ({
  initI18n: jest.fn().mockResolvedValue(undefined),
  isRTL: jest.fn().mockReturnValue(false),
  default: { language: 'en' },
}))

jest.spyOn(I18nManager, 'allowRTL').mockImplementation(jest.fn())
jest.spyOn(I18nManager, 'forceRTL').mockImplementation(jest.fn())
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn())

describe('RootLayout', () => {
  const mockInitI18n = initI18n as jest.Mock
  const mockIsRTL = isRTL as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    Object.defineProperty(I18nManager, 'isRTL', {
      value: false,
      configurable: true,
      writable: true,
    })
    global.__DEV__ = false
  })

  it('renders ActivityIndicator while i18n is initializing', async () => {
    // Prevent initI18n from resolving immediately
    mockInitI18n.mockImplementation(() => new Promise(() => {}))
    const { getByTestId, queryByTestId } = render(<RootLayout />)
    expect(getByTestId('activity-indicator')).toBeTruthy()
    expect(queryByTestId('stack')).toBeNull()
  })

  it('renders Stack component after i18n initialization', async () => {
    mockInitI18n.mockResolvedValue(undefined)
    const { findByTestId } = render(<RootLayout />)
    const stack = await findByTestId('stack')
    expect(stack).toBeTruthy()
  })

  it('hides header', async () => {
    mockInitI18n.mockResolvedValue(undefined)
    const { findByTestId } = render(<RootLayout />)
    const stack = await findByTestId('stack')
    expect(stack.props.screenOptions.headerShown).toBe(false)
  })

  it('sets background color to dark theme', async () => {
    mockInitI18n.mockResolvedValue(undefined)
    const { findByTestId } = render(<RootLayout />)
    const stack = await findByTestId('stack')
    expect(stack.props.screenOptions.contentStyle.backgroundColor).toBe('#242424')
  })

  describe('RTL Handling', () => {
    it('forces RTL when language is RTL and layout is LTR', async () => {
      mockIsRTL.mockReturnValue(true)
      Object.defineProperty(I18nManager, 'isRTL', { value: false })

      render(<RootLayout />)
      await waitFor(() => {
        expect(I18nManager.forceRTL).toHaveBeenCalledWith(true)
      })
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(true)
    })

    it('forces LTR when language is LTR and layout is RTL', async () => {
      mockIsRTL.mockReturnValue(false)
      Object.defineProperty(I18nManager, 'isRTL', { value: true })

      render(<RootLayout />)
      await waitFor(() => {
        expect(I18nManager.forceRTL).toHaveBeenCalledWith(false)
      })
      expect(I18nManager.allowRTL).toHaveBeenCalledWith(false)
    })

    it('does not force RTL when layout already matches', async () => {
      mockIsRTL.mockReturnValue(true)
      Object.defineProperty(I18nManager, 'isRTL', { value: true })

      render(<RootLayout />)
      // Wait for a tick to ensure useEffect has a chance to run
      await act(() => new Promise(process.nextTick))

      expect(I18nManager.forceRTL).not.toHaveBeenCalled()
    })

    it('shows an alert in dev mode when layout direction changes', async () => {
      global.__DEV__ = true
      mockIsRTL.mockReturnValue(true)
      Object.defineProperty(I18nManager, 'isRTL', { value: false })

      render(<RootLayout />)

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Restart Required',
          'Please close and reopen the app to apply layout direction changes.'
        )
      })
    })

    it('does not show an alert in prod mode', async () => {
      global.__DEV__ = false
      mockIsRTL.mockReturnValue(true)
      Object.defineProperty(I18nManager, 'isRTL', { value: false })

      render(<RootLayout />)
      // Wait for a tick to ensure useEffect has a chance to run
      await act(() => new Promise(process.nextTick))

      expect(Alert.alert).not.toHaveBeenCalled()
    })
  })
})
