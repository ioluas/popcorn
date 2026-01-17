import { useEffect, useCallback } from 'react'
import { StyleSheet, useWindowDimensions, Image } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import { useAudioPlayer } from 'expo-audio'
import { scheduleOnRN } from 'react-native-worklets'
import { useVolume } from '@/hooks/useVolume'

/**
 * The duration of an animation in milliseconds.
 * This variable defines the time span for which an animation will run.
 * It is used to control the speed and timing of animations.
 */
const ANIMATION_DURATION = 2000

/**
 * The dimension size for an image, typically representing the width and height
 * in pixels when the image is assumed to be square.
 *
 * This constant is used to standardize image dimensions across various
 * operations, ensuring consistency in rendering, processing, or resizing tasks.
 *
 * @constant {number}
 */
const IMAGE_SIZE = 100

interface CockatooAnimationProps {
  isPlaying: boolean
  onComplete: () => void
}

/**
 * Displays an animation of a cockatoo image that flies across the screen
 * while playing a sound. The animation moves the image from the bottom-left
 * corner to the top-right corner of the screen over a fixed duration.
 *
 * @param {Object} props - The props object for the CockatooAnimation component.
 * @param {boolean} props.isPlaying - Indicates whether the animation and sound should start playing.
 * @param {Function} props.onComplete - Callback function to be executed when the animation completes.
 * @return {React.ReactElement|null} Returns the animated component when `isPlaying` is true, otherwise null.
 */
export default function CockatooAnimation({ isPlaying, onComplete }: CockatooAnimationProps) {
  const { width, height } = useWindowDimensions()
  const cockatooPlayer = useAudioPlayer(require('@/assets/sounds/cockatoo.mp3'))
  const { volume } = useVolume()

  const translateX = useSharedValue(-IMAGE_SIZE)
  const translateY = useSharedValue(height)

  const stopPlayer = useCallback(() => {
    if (cockatooPlayer.playing) {
      cockatooPlayer.pause()
    }
  }, [cockatooPlayer])

  useEffect(() => {
    if (isPlaying) {
      translateX.value = -IMAGE_SIZE
      translateY.value = height

      void cockatooPlayer.seekTo(0)
      cockatooPlayer.volume = volume
      cockatooPlayer.play()

      translateX.value = withTiming(width, {
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
      })

      translateY.value = withTiming(
        -IMAGE_SIZE,
        {
          duration: ANIMATION_DURATION,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            scheduleOnRN(onComplete)
          }
        }
      )
    }

    return () => {
      stopPlayer()
    }
  }, [isPlaying, width, height, translateX, translateY, cockatooPlayer, onComplete, stopPlayer, volume])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }))

  if (!isPlaying) return null

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none" testID="cockatoo-animation">
      <Image source={require('@/assets/poptimer.gif')} style={styles.image} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 1000,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    resizeMode: 'contain',
  },
})
