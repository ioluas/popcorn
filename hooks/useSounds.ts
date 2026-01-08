import { useAudioPlayer } from 'expo-audio'
import { useCallback } from 'react'

export function useSounds() {
  const beepPlayer = useAudioPlayer(require('@/assets/sounds/beep.mp3'))

  const playBeep = useCallback(() => {
    beepPlayer.seekTo(0)
    beepPlayer.play()
  }, [beepPlayer])

  return { playBeep }
}
