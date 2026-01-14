'use client'

import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'

export type Point2DProps = {
  position: { x: number; y: number }
  color?: string
  size?: number

  animateTo?: { x: number; y: number }
  animateDuration?: number

  followFunction?: {
    f: (x: number) => number
    startX: number
    endX: number
    duration?: number
  }
}

export default function Point2D({
  position,
  color = 'red',
  size = 0.04,
  animateTo,
  animateDuration = 1,
  followFunction,
}: Point2DProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [opacity, setOpacity] = useState(0)

  // position we actually render
  const [currentPosition, setCurrentPosition] = useState(position)

  // 0–1 progress for plain animateTo
  const [animateProgress, setAnimateProgress] = useState(0)

  // 0–1 progress for followFunction
  const [followProgress, setFollowProgress] = useState(0)

  // whenever base position changes, reset to that (if not animating)
  useEffect(() => {
    setCurrentPosition(position)
  }, [position])

  // reset on new animations
  useEffect(() => {
    if (animateTo) {
      setAnimateProgress(0)
    }
    if (followFunction) {
      setFollowProgress(0)
    }
  }, [animateTo, followFunction])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // fade in + pulse (same as before)
    const fadeSpeed = 1
    const pulseStrength = 0.1
    const pulseFrequency = 4

    setOpacity(prev => Math.min(prev + delta * fadeSpeed, 1))

    const pulse = 1 + pulseStrength * Math.sin(state.clock.elapsedTime * pulseFrequency)
    meshRef.current.scale.setScalar(pulse)

    // 1) FOLLOW FUNCTION MODE (takes priority)
    if (followFunction && followProgress < 1) {
      const dur = followFunction.duration ?? 3
      setFollowProgress(prev => {
        const speed = 1 / dur
        const next = Math.min(prev + speed * delta, 1)

        const x =
          followFunction.startX +
          (followFunction.endX - followFunction.startX) * next
        const y = followFunction.f(x)

        setCurrentPosition({ x, y })
        return next
      })

      return // don’t also run animateTo
    }

    // 2) PLAIN animateTo MODE (only if no followFunction)
    if (animateTo && animateProgress < 1 && !followFunction) {
      setAnimateProgress(prev => {
        const speed = 1 / animateDuration
        const next = Math.min(prev + speed * delta, 1)

        const newPosition = {
          x: position.x + (animateTo.x - position.x) * next,
          y: position.y + (animateTo.y - position.y) * next,
        }

        setCurrentPosition(newPosition)
        return next
      })
    }
  })

  return (
    <mesh ref={meshRef} position={[currentPosition.x, currentPosition.y, 0]}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} />
    </mesh>
  )
}