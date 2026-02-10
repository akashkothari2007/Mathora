'use client'

import { Line } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MORPH_DURATION = 1

export type SecantLineProps = {
  f: (x: number) => number
  startX: number
  endX: number
  color?: string
  lineWidth?: number
  pointSize?: number
}

export default function SecantLine({
  f,
  startX,
  endX,
  color = 'cyan',
  lineWidth = 2,
  pointSize = 0.06,
}: SecantLineProps) {
  const [currentStartX, setCurrentStartX] = useState(startX)
  const [currentEndX, setCurrentEndX] = useState(endX)
  const progressRef = useRef(1)
  const fromStartXRef = useRef(startX)
  const fromEndXRef = useRef(endX)

  useEffect(() => {
    const startChanged = startX !== currentStartX
    const endChanged = endX !== currentEndX
    if (startChanged || endChanged) {
      fromStartXRef.current = currentStartX
      fromEndXRef.current = currentEndX
      progressRef.current = 0
    }
  }, [startX, endX])

  useFrame((_, delta) => {
    if (progressRef.current >= 1) return
    const t = Math.min(progressRef.current + delta / MORPH_DURATION, 1)
    progressRef.current = t
    const fromStart = fromStartXRef.current
    const fromEnd = fromEndXRef.current
    setCurrentStartX(fromStart + (startX - fromStart) * t)
    setCurrentEndX(fromEnd + (endX - fromEnd) * t)
  })

  const x1 = currentStartX
  const x2 = currentEndX
  const y1 = f(x1)
  const y2 = f(x2)

  const points: [THREE.Vector3, THREE.Vector3] = [
    new THREE.Vector3(x1, y1, 0),
    new THREE.Vector3(x2, y2, 0),
  ]

  return (
    <group>
      <Line points={points} color={color} lineWidth={lineWidth} />
      <mesh position={[x1, y1, 0]}>
        <sphereGeometry args={[pointSize, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[x2, y2, 0]}>
        <sphereGeometry args={[pointSize, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}
