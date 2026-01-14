'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CameraTarget } from '../types/cameraTarget'

export type CameraAnimatorProps = {
  cameraTarget: CameraTarget | null
}

export default function CameraAnimator({ cameraTarget }: CameraAnimatorProps) {
  const { camera } = useThree()

  const startPos = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())
  const elapsedTime = useRef(0)
  const duration = useRef(1)
  const animating = useRef(false)

  useEffect(() => {
    if (!cameraTarget) {
      // If you *ever* call setCameraTarget(null), this stops animating
      animating.current = false
      return
    }

    // Start from current camera position
    startPos.current.copy(camera.position)

    // For now always look at origin (totally fine for 2D-style graph)

    // End position — if CameraTarget.position is required,
    // you don't need the "?."
    targetPos.current.set(
      cameraTarget.position?.[0] ?? camera.position.x,
      cameraTarget.position?.[1] ?? camera.position.y,
      cameraTarget.position?.[2] ?? camera.position.z
    )

    duration.current = cameraTarget.duration ?? 1
    elapsedTime.current = 0
    animating.current = true
  }, [cameraTarget, camera])

  useFrame((_, delta) => {
    if (!animating.current) return

    elapsedTime.current += delta
    const t = Math.min(elapsedTime.current / duration.current, 1)

    const easedT =
      t < 0.5
        ? 2 * t * t
        : 1 - Math.pow(-2 * t + 2, 2) / 2

    const newPos = new THREE.Vector3().lerpVectors(
      startPos.current,
      targetPos.current,
      easedT
    )
    camera.position.copy(newPos)

    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    if (t >= 1) {
      camera.position.copy(targetPos.current)
      camera.updateProjectionMatrix()
      animating.current = false
    }
  })

  return null
}