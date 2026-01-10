import { I18nManager } from 'react-native'
import { isRTL, applyRTL, needsRTLRestart } from '../rtl'

describe('rtl', () => {
  describe('isRTL', () => {
    it('should return true for RTL languages', () => {
      expect(isRTL('ar')).toBe(true)
    })

    it('should return false for non-RTL languages', () => {
      expect(isRTL('en')).toBe(false)
      expect(isRTL('sv')).toBe(false)
    })
  })

  describe('applyRTL', () => {
    const allowRTLSpy = jest.spyOn(I18nManager, 'allowRTL')
    const forceRTLSpy = jest.spyOn(I18nManager, 'forceRTL')

    beforeEach(() => {
      allowRTLSpy.mockClear()
      forceRTLSpy.mockClear()
    })

    it('should force RTL if language is RTL and currently not', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: false, configurable: true })
      const restartNeeded = applyRTL('ar')
      expect(allowRTLSpy).toHaveBeenCalledWith(true)
      expect(forceRTLSpy).toHaveBeenCalledWith(true)
      expect(restartNeeded).toBe(true)
    })

    it('should force LTR if language is not RTL and currently is', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: true, configurable: true })
      const restartNeeded = applyRTL('en')
      expect(allowRTLSpy).toHaveBeenCalledWith(false)
      expect(forceRTLSpy).toHaveBeenCalledWith(false)
      expect(restartNeeded).toBe(true)
    })

    it('should do nothing if RTL state matches', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: true, configurable: true })
      const restartNeeded = applyRTL('ar')
      expect(allowRTLSpy).not.toHaveBeenCalled()
      expect(forceRTLSpy).not.toHaveBeenCalled()
      expect(restartNeeded).toBe(false)
    })
  })

  describe('needsRTLRestart', () => {
    it('should return true if RTL needs to be enabled', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: false, configurable: true })
      expect(needsRTLRestart('ar')).toBe(true)
    })

    it('should return true if RTL needs to be disabled', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: true, configurable: true })
      expect(needsRTLRestart('en')).toBe(true)
    })

    it('should return false if RTL state is correct', () => {
      Object.defineProperty(I18nManager, 'isRTL', { value: true, configurable: true })
      expect(needsRTLRestart('ar')).toBe(false)

      Object.defineProperty(I18nManager, 'isRTL', { value: false, configurable: true })
      expect(needsRTLRestart('en')).toBe(false)
    })
  })
})
