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
const ANIMATION_DURATION = 3_500

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
 * Generates a random position within the screen boundaries.
 *
 * @param max - The maximum boundary value (width or height).
 * @param imageSize - The size of the image to account for in positioning.
 * @return A random position value within the valid range.
 */
const getRandomPosition = (max: number, imageSize: number): number => {
  const usable = Math.max(0, max - imageSize)
  return Math.random() * usable
}

// noinspection BadExpressionStatementJS
/**
 * Calculates a point on a quadratic bezier curve.
 *
 * @param t - Progress along the curve (0 to 1).
 * @param p0 - Starting point.
 * @param p1 - Control point.
 * @param p2 - Ending point.
 * @return The calculated position at progress t.
 */
const quadraticBezier = (t: number, p0: number, p1: number, p2: number): number => {
  'worklet'
  const oneMinusT = 1 - t
  return oneMinusT * oneMinusT * p0 + 2 * oneMinusT * t * p1 + t * t * p2
}

/**
 * Displays an animation of a cockatoo image that flies across the screen
 * while playing a sound. The animation moves the image along a curved path
 * from a random starting position to a random ending position within the screen boundaries.
 *
 * @param props - The props object for the CockatooAnimation component.
 * @param props.isPlaying - Indicates whether the animation and sound should start playing.
 * @param props.onComplete - Callback function to be executed when the animation completes.
 * @return Returns the animated component when `isPlaying` is true, otherwise null.
 */
export default function CockatooAnimation({ isPlaying, onComplete }: CockatooAnimationProps) {
  const { width, height } = useWindowDimensions()
  const cockatooPlayer = useAudioPlayer(require('@/assets/sounds/cockatoo.mp3'))
  const { volume } = useVolume()

  const progress = useSharedValue(0)

  // Store curve control points as shared values
  const startX = useSharedValue(0)
  const startY = useSharedValue(0)
  const controlX = useSharedValue(0)
  const controlY = useSharedValue(0)
  const endX = useSharedValue(0)
  const endY = useSharedValue(0)

  const stopPlayer = useCallback(() => {
    if (cockatooPlayer.playing) {
      cockatooPlayer.pause()
    }
  }, [cockatooPlayer])

  useEffect(() => {
    if (isPlaying) {
      // Generate random starting position
      const randomStartX = getRandomPosition(width, IMAGE_SIZE)
      const randomStartY = getRandomPosition(height, IMAGE_SIZE)

      // Generate random ending position
      const randomEndX = getRandomPosition(width, IMAGE_SIZE)
      const randomEndY = getRandomPosition(height, IMAGE_SIZE)

      // Generate control point for the curve (between start and end, with random offset)
      const midX = (randomStartX + randomEndX) / 2
      const midY = (randomStartY + randomEndY) / 2

      // Add random perpendicular offset to create a curve
      const dx = randomEndX - randomStartX
      const dy = randomEndY - randomStartY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Guard against division by zero when start and end positions are the same
      let perpX = 0
      let perpY = 0
      let curveIntensity = 0

      if (distance > 0) {
        curveIntensity = distance * (0.3 + Math.random() * 0.4) // 30-70% of distance

        // Perpendicular vector
        perpX = -dy / distance
        perpY = dx / distance
      }

      // Randomly curve left or right
      const direction = Math.random() > 0.5 ? 1 : -1

      const randomControlX = midX + perpX * curveIntensity * direction
      const randomControlY = midY + perpY * curveIntensity * direction

      // Store curve points in shared values
      startX.value = randomStartX
      startY.value = randomStartY
      controlX.value = randomControlX
      controlY.value = randomControlY
      endX.value = randomEndX
      endY.value = randomEndY

      progress.value = 0

      void cockatooPlayer.seekTo(0)
      cockatooPlayer.volume = volume
      cockatooPlayer.play()

      progress.value = withTiming(
        1,
        {
          duration: ANIMATION_DURATION,
          easing: Easing.inOut(Easing.ease),
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
  }, [
    isPlaying,
    width,
    height,
    progress,
    startX,
    startY,
    controlX,
    controlY,
    endX,
    endY,
    cockatooPlayer,
    onComplete,
    stopPlayer,
    volume,
  ])

  const animatedStyle = useAnimatedStyle(() => {
    const t = progress.value

    const x = quadraticBezier(t, startX.value, controlX.value, endX.value)
    const y = quadraticBezier(t, startY.value, controlY.value, endY.value)

    return {
      transform: [{ translateX: x }, { translateY: y }],
    }
  })

  if (!isPlaying) return null

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none" testID="cockatoo-animation">
      <Image source={require('@/assets/popcorn-flying.gif')} style={styles.image} />
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
