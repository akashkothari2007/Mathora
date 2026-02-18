'use client'

import { Line } from '@react-three/drei'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AttentionState } from '../types/attentionStates'

const MORPH_DURATION = 0.3
const DRAW_STEPS = 500
const DRAW_DURATION = 1

export type Line2DProps = {
  start: { x: number; y: number }
  end: { x: number; y: number }
  color?: string
  lineWidth?: number
  attentionState?: AttentionState
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
  const [visibleCount, setVisibleCount] = useState(2)
  const [drawFinished, setDrawFinished] = useState(false)
  const hasDrawnInRef = useRef(false)

  useEffect(() => {
    setVisibleCount(2)
    setDrawFinished(false)
    hasDrawnInRef.current = false
  }, [])

  useEffect(() => {
    const startChanged = start.x !== currentStart.x || start.y !== currentStart.y
    const endChanged = end.x !== currentEnd.x || end.y !== currentEnd.y
    if (startChanged || endChanged) {
      fromStartRef.current = { ...currentStart }
      fromEndRef.current = { ...currentEnd }
      progressRef.current = 0
    }
  }, [start.x, start.y, end.x, end.y])

  // Sample points along the line for smooth draw-in
  const linePoints = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= DRAW_STEPS; i++) {
      const t = i / DRAW_STEPS
      const x = currentStart.x + t * (currentEnd.x - currentStart.x)
      const y = currentStart.y + t * (currentEnd.y - currentStart.y)
      pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }, [currentStart, currentEnd])

  const visiblePoints = useMemo(
    () => linePoints.slice(0, Math.floor(visibleCount)),
    [linePoints, visibleCount]
  )

  useFrame((_, delta) => {
    // draw-in: left to right on first appearance (same as FunctionPlot and SecantLine)
    if (!drawFinished && hasDrawnInRef.current) {
      setVisibleCount(prev => {
        const speed = (DRAW_STEPS + 1) / DRAW_DURATION
        const next = prev + speed * delta
        if (next >= DRAW_STEPS + 1) setDrawFinished(true)
        return Math.min(next, DRAW_STEPS + 1)
      })
    }

    // morph when start/end change (sliding)
    if (progressRef.current < 1) {
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
      return
    }

    // morph done + not yet drawn in -> start draw-in
    if (!hasDrawnInRef.current) {
      hasDrawnInRef.current = true
    }
  })

  return <Line points={visiblePoints} color={color} lineWidth={lineWidth} />
}
