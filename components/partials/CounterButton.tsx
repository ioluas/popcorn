import { JSX, useRef, useCallback, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTranslation } from 'react-i18next'

type CounterButtonProps = {
  type: 'increment' | 'decrement'
  amount: number
  setter: (updater: (prev: number) => number) => void
  testID?: string
}

export const INITIAL_DELAY = 300
export const RAPID_INTERVAL = 100

export default function CounterButton({ type, amount, setter, testID }: CounterButtonProps): JSX.Element {
  const { t } = useTranslation()
  const content = `${type === 'increment' ? '+' : '-'}${amount > 1 ? amount : ''}`
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const updateValue = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
    if (type === 'increment') {
      setter((prev) => prev + amount)
    } else {
      setter((prev) => Math.max(1, prev - amount))
    }
  }, [type, amount, setter])

  const handlePressIn = useCallback(() => {
    updateValue()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(updateValue, RAPID_INTERVAL)
    }, INITIAL_DELAY)
  }, [updateValue])

  const handlePressOut = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const accessibilityLabel =
    type === 'increment' ? t('common.increaseBy', { amount }) : t('common.decreaseBy', { amount })

  return (
    <TouchableOpacity
      style={styles.container}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      testID={testID}
    >
      <Text style={styles.counterButton}>{content}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    backgroundColor: '#5d6d7a',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButton: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
})
