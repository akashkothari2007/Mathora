'use client'

import { Line } from '@react-three/drei'
import { useState, useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { AttentionState } from '../types/attentionStates'

const MORPH_DURATION = 1
const DRAW_STEPS = 500
const DRAW_DURATION = 1

export type SecantLineProps = {
  f: (x: number) => number
  startX: number
  endX: number
  /** How many units to extend the line past the segment on each side (default 2.5). Makes secant look like a long line for tangent transition. */
  extension?: number
  color?: string
  lineWidth?: number
  pointSize?: number
  attentionState?: AttentionState
}

export default function SecantLine({
  f,
  startX,
  endX,
  color = 'cyan',
  lineWidth = 2,
  pointSize = 0.06,
  extension = 2.5,
  attentionState = "normal",
}: SecantLineProps) {
  const [currentStartX, setCurrentStartX] = useState(startX)
  const [currentEndX, setCurrentEndX] = useState(endX)
  const progressRef = useRef(1)
  const fromStartXRef = useRef(startX)
  const fromEndXRef = useRef(endX)
  const [visibleCount, setVisibleCount] = useState(2)
  const [drawFinished, setDrawFinished] = useState(false)
  const hasDrawnInRef = useRef(false)

  useEffect(() => {
    const startChanged = startX !== currentStartX
    const endChanged = endX !== currentEndX
    if (startChanged || endChanged) {
      fromStartXRef.current = currentStartX
      fromEndXRef.current = currentEndX
      progressRef.current = 0
    }
  }, [startX, endX])

  const x1 = currentStartX
  const x2 = currentEndX
  const y1 = f(x1)
  const y2 = f(x2)

  // Line through (x1,y1) and (x2,y2), extended outward by `extension` units. When x1≈x2 use numerical derivative for tangent.
  const dx = x2 - x1
  const dy = y2 - y1
  const eps = 1e-6
  const slope =
    Math.abs(dx) < eps
      ? (f(x1 + eps) - f(x1 - eps)) / (2 * eps)
      : dy / dx
  const xMin = Math.min(x1, x2)
  const xMax = Math.max(x1, x2)
  const leftX = xMin - extension
  const rightX = xMax + extension
  const leftY = y1 + slope * (leftX - x1)
  const rightY = y1 + slope * (rightX - x1)

  const linePoints = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= DRAW_STEPS; i++) {
      const t = i / DRAW_STEPS
      const x = leftX + t * (rightX - leftX)
      const y = leftY + t * (rightY - leftY)
      pts.push(new THREE.Vector3(x, y, 0))
    }
    return pts
  }, [leftX, rightX, leftY, rightY])

  const visiblePoints = useMemo(
    () => linePoints.slice(0, Math.floor(visibleCount)),
    [linePoints, visibleCount]
  )

  useFrame((_, delta) => {
    // draw-in: left to right on first appearance (same as FunctionPlot)
    if (!drawFinished && hasDrawnInRef.current) {
      setVisibleCount(prev => {
        const speed = (DRAW_STEPS + 1) / DRAW_DURATION
        const next = prev + speed * delta
        if (next >= DRAW_STEPS + 1) setDrawFinished(true)
        return Math.min(next, DRAW_STEPS + 1)
      })
    }

    // morph when startX/endX change (sliding)
    if (progressRef.current < 1) {
      const t = Math.min(progressRef.current + delta / MORPH_DURATION, 1)
      progressRef.current = t
      const fromStart = fromStartXRef.current
      const fromEnd = fromEndXRef.current
      setCurrentStartX(fromStart + (startX - fromStart) * t)
      setCurrentEndX(fromEnd + (endX - fromEnd) * t)
      return
    }

    // morph done + not yet drawn in -> start draw-in
    if (!hasDrawnInRef.current) {
      hasDrawnInRef.current = true
    }
  })

  return (
    <group>
      <Line points={visiblePoints} color={color} lineWidth={lineWidth} />
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
