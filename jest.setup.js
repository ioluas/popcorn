/* globals jest */
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native')
  return {
    Ionicons: ({ name, ...props }) => <Text {...props}>{name}</Text>,
    MaterialIcons: ({ name, ...props }) => <Text {...props}>{name}</Text>,
  }
})

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      if (params) {
        // Simple interpolation for testing
        let result = key
        Object.entries(params).forEach(([k, v]) => {
          result = result.replace(`{{${k}}}`, String(v))
        })
        return result
      }
      return key
    },
    i18n: {
      language: 'en',
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    },
  }),
  I18nextProvider: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}))

jest.mock('expo-localization', () => ({
  getLocales: () => [{ languageCode: 'en', textDirection: 'ltr' }],
}))

jest.mock('expo-updates', () => ({
  reloadAsync: jest.fn().mockResolvedValue(undefined),
}))

// Mock the i18n module to avoid initialization issues in tests
jest.mock('@/i18n', () => ({
  initI18n: jest.fn().mockResolvedValue({
    language: 'en',
    changeLanguage: jest.fn(),
  }),
  isRTL: jest.fn().mockReturnValue(false),
  applyRTL: jest.fn().mockReturnValue(false),
  needsRTLRestart: jest.fn().mockReturnValue(false),
  saveLanguage: jest.fn().mockResolvedValue(undefined),
  getSavedLanguage: jest.fn().mockResolvedValue(null),
  clearLanguage: jest.fn().mockResolvedValue(undefined),
  SUPPORTED_LANGUAGES: ['en', 'sv', 'ar'],
  default: {
    language: 'en',
    changeLanguage: jest.fn(),
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockResolvedValue(undefined),
  },
}))

jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native')
  return {
    default: {
      View,
      call: () => {},
    },
    View,
    useSharedValue: jest.fn((init) => ({ value: init })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue) => toValue),
    withSequence: jest.fn((...args) => args[args.length - 1]),
    withDelay: jest.fn((_, animation) => animation),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      inOut: jest.fn(() => jest.fn()),
    },
  }
})

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((fn) => fn()),
}))

jest.mock('expo-audio', () => ({
  useAudioPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    seekTo: jest.fn(),
  })),
}))
