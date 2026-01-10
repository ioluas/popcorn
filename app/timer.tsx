import { JSX, useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { useTranslation } from 'react-i18next'
import { useTimer, TransitionType } from '@/hooks/useTimer'
import { useSounds } from '@/hooks/useSounds'
import { formatTime } from '@/utils/General'

type TimerProps = {
  sets: number
  workTime: number
  restTime: number
}

function TimerScreen({ sets, workTime, restTime }: TimerProps): JSX.Element {
  const { t } = useTranslation()
  const router = useRouter()
  const { playBeep } = useSounds()

  const handleTransition = useCallback(
    (_type: TransitionType) => {
      playBeep()
    },
    [playBeep]
  )

  const { state, toggle, reset } = useTimer({
    sets,
    workTime,
    restTime,
    onTransition: handleTransition,
  })

  // Auto-navigate home after completion
  useEffect(() => {
    if (state.phase !== 'complete') return
    const timeout = setTimeout(() => {
      router.back()
    }, 3000)
    return () => clearTimeout(timeout)
  }, [state.phase, router])

  const phaseLabel =
    state.phase === 'work'
      ? t('timer.phases.work')
      : state.phase === 'rest'
        ? t('timer.phases.rest')
        : t('timer.phases.complete')
  const phaseColor = state.phase === 'work' ? '#e8d44d' : state.phase === 'rest' ? '#5d9cec' : '#2ecc71'

  return (
    <View style={styles.container}>
      <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseLabel}</Text>

      <Text style={styles.countdown}>{formatTime(Math.max(0, state.timeRemaining))}</Text>

      <Text style={styles.progress}>
        {t('timer.setProgress', { current: state.currentSet, total: state.totalSets })}
      </Text>

      {state.phase !== 'complete' && (
        <View style={styles.controls}>
          <TouchableOpacity onPress={toggle} style={styles.controlButton}>
            <Ionicons name={state.isPlaying ? 'pause' : 'play'} size={32} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={styles.controlButton}>
            <Ionicons name="refresh" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      <ExitButton onExit={() => router.back()} />
    </View>
  )
}

export default function TimerPage(): JSX.Element | null {
  const router = useRouter()
  const params = useLocalSearchParams<{
    sets?: string
    workTime?: string
    restTime?: string
  }>()

  const [validatedParams, setValidatedParams] = useState<TimerProps | null>(null)

  useEffect(() => {
    // Wait for params to be available - don't validate empty/undefined params
    if (!params.sets || !params.workTime) {
      return
    }

    const sets = parseInt(params.sets, 10)
    const workTime = parseInt(params.workTime, 10)
    const restTime = parseInt(params.restTime ?? '0', 10)

    if (sets > 0 && workTime > 0 && restTime >= 0) {
      setValidatedParams({ sets, workTime, restTime })
    } else {
      // Invalid params, navigate back
      requestAnimationFrame(() => {
        router.back()
      })
    }
  }, [params.sets, params.workTime, params.restTime, router])

  if (!validatedParams) {
    return null // Or a loading spinner
  }

  return <TimerScreen {...validatedParams} />
}

type ExitButtonProps = {
  onExit: () => void
}

const HOLD_DURATION = 1000
const TICK_INTERVAL = 50

function ExitButton({ onExit }: ExitButtonProps): JSX.Element {
  const { t } = useTranslation()
  const [progressMs, setProgressMs] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit

  useEffect(() => {
    if (progressMs < HOLD_DURATION) return

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    // Small delay to let UI render 100% before exiting
    const timeout = setTimeout(() => onExitRef.current(), 50)
    return () => clearTimeout(timeout)
  }, [progressMs])

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handlePressIn = () => {
    // Clear any existing interval to prevent duplicates
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setProgressMs(0)

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

    intervalRef.current = setInterval(() => {
      setProgressMs((prev) => {
        const next = prev + TICK_INTERVAL
        if (next >= HOLD_DURATION) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return HOLD_DURATION
        }
        return next
      })
    }, TICK_INTERVAL)
  }

  const handlePressOut = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setProgressMs(0)
  }

  const progress = progressMs / HOLD_DURATION

  return (
    <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.exitButton} activeOpacity={1}>
      <View style={[styles.exitProgress, { width: `${progress * 100}%` }]} />
      <Text style={styles.exitButtonText}>{t('timer.holdToExit')}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242424',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  phaseLabel: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 4,
    marginBottom: 16,
  },
  countdown: {
    fontSize: 96,
    fontWeight: '200',
    color: '#fff',
  },
  progress: {
    fontSize: 18,
    color: '#b0bec5',
    marginTop: 16,
  },
  controls: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 48,
  },
  controlButton: {
    width: 64,
    height: 64,
    backgroundColor: '#4a5c6a',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exitButton: {
    position: 'absolute',
    bottom: 48,
    backgroundColor: '#4a5c6a',
    borderRadius: 8,
    overflow: 'hidden',
  },
  exitProgress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#c0392b',
  },
  exitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
})
