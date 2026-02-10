'use client'

import { Line } from '@react-three/drei'
import { useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MORPH_DURATION = 0.3

export type Line2DProps = {
  start: { x: number; y: number }
  end: { x: number; y: number }
  color?: string
  lineWidth?: number
}

export default function Line2D({
  start,
  end,
  color = 'white',
  lineWidth = 2,
}: Line2DProps) {
  const [currentStart, setCurrentStart] = useState(start)
  const [currentEnd, setCurrentEnd] = useState(end)
  const progressRef = useRef(1)
  const fromStartRef = useRef(start)
  const fromEndRef = useRef(end)

  useEffect(() => {
    const startChanged = start.x !== currentStart.x || start.y !== currentStart.y
    const endChanged = end.x !== currentEnd.x || end.y !== currentEnd.y
    if (startChanged || endChanged) {
      fromStartRef.current = { ...currentStart }
      fromEndRef.current = { ...currentEnd }
      progressRef.current = 0
    }
  }, [start.x, start.y, end.x, end.y])

  useFrame((_, delta) => {
    if (progressRef.current >= 1) return
    const t = Math.min(progressRef.current + delta / MORPH_DURATION, 1)
    progressRef.current = t
    const fromStart = fromStartRef.current
    const fromEnd = fromEndRef.current
    setCurrentStart({
      x: fromStart.x + (start.x - fromStart.x) * t,
      y: fromStart.y + (start.y - fromStart.y) * t,
    })
    setCurrentEnd({
      x: fromEnd.x + (end.x - fromEnd.x) * t,
      y: fromEnd.y + (end.y - fromEnd.y) * t,
    })
  })

  const points: [THREE.Vector3, THREE.Vector3] = [
    new THREE.Vector3(currentStart.x, currentStart.y, 0),
    new THREE.Vector3(currentEnd.x, currentEnd.y, 0),
  ]
  return <Line points={points} color={color} lineWidth={lineWidth} />
}
