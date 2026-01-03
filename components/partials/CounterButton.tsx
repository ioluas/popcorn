import { JSX, useRef, useCallback } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import * as Haptics from 'expo-haptics'

type CounterButtonProps = {
  type: 'increment' | 'decrement'
  amount: number
  setter: (updater: (prev: number) => number) => void
}

const INITIAL_DELAY = 300
const RAPID_INTERVAL = 100

export default function CounterButton({ type, amount, setter }: CounterButtonProps): JSX.Element {
  const content = `${type === 'increment' ? '+' : '-'}${amount > 1 ? amount : ''}`
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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

  return (
    <TouchableOpacity style={styles.container} onPressIn={handlePressIn} onPressOut={handlePressOut}>
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
