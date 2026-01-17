import { useAudioPlayer } from 'expo-audio'
import { useCallback, useEffect } from 'react'

export function useSounds(volume: number = 1.0) {
  const beepPlayer = useAudioPlayer(require('@/assets/sounds/beep.mp3'))

  useEffect(() => {
    beepPlayer.volume = volume
  }, [beepPlayer, volume])

  const playBeep = useCallback(
    (overrideVolume?: number) => {
      const vol = overrideVolume ?? volume
      if (vol === 0) return
      beepPlayer.volume = vol
      void beepPlayer.seekTo(0)
      beepPlayer.play()
    },
    [beepPlayer, volume]
  )

  return { playBeep }
}
