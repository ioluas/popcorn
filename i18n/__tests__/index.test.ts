jest.unmock('@/i18n')

describe('initI18n', () => {
  let i18n: any
  let initI18n: any
  let Localization: any
  let getSavedLanguage: any

  beforeEach(() => {
    jest.resetModules()

    // Mock dependencies after resetModules
    jest.doMock('expo-localization', () => ({
      getLocales: jest.fn(),
    }))
    jest.doMock('../utils/languageStorage', () => ({
      getSavedLanguage: jest.fn(),
    }))

    // Require modules after mocks are set
    const i18nModule = require('../index') // eslint-disable-line @typescript-eslint/no-require-imports
    i18n = i18nModule.default
    initI18n = i18nModule.initI18n

    Localization = require('expo-localization') // eslint-disable-line @typescript-eslint/no-require-imports
    getSavedLanguage = require('../utils/languageStorage').getSavedLanguage // eslint-disable-line @typescript-eslint/no-require-imports
  })

  it('should use saved language if available', async () => {
    getSavedLanguage.mockResolvedValue('sv')
    Localization.getLocales.mockReturnValue([{ languageCode: 'en' }])

    await initI18n()

    expect(i18n.language).toBe('sv')
  })

  it('should use device locale if supported and no language is saved', async () => {
    getSavedLanguage.mockResolvedValue(null)
    Localization.getLocales.mockReturnValue([{ languageCode: 'ar' }])

    await initI18n()

    expect(i18n.language).toBe('ar')
  })

  it('should use fallback "en" if device locale is not supported', async () => {
    getSavedLanguage.mockResolvedValue(null)
    Localization.getLocales.mockReturnValue([{ languageCode: 'fr' }])

    await initI18n()

    expect(i18n.language).toBe('en')
  })

  it('should use fallback "en" if device locale is not available', async () => {
    getSavedLanguage.mockResolvedValue(null)
    Localization.getLocales.mockReturnValue([])

    await initI18n()

    expect(i18n.language).toBe('en')
  })

  it('should initialize with english resources and t function', async () => {
    getSavedLanguage.mockResolvedValue(null)
    Localization.getLocales.mockReturnValue([{ languageCode: 'en' }])

    await initI18n()
    const translated = i18n.t('quickstart.title')
    expect(translated).toBe('Quickstart')
  })
})
