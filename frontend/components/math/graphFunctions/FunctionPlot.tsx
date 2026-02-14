'use client'

import { useMemo, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AttentionState } from '../types/attentionStates'
import { useAttention } from '../hooks/useAttention'

export type FunctionPlotProps = {
  f: (x: number) => number
  xmin?: number
  xmax?: number
  steps?: number
  color?: string
  lineWidth?: number
  attentionState?: AttentionState
}

const MORPH_DURATION = 0.4

function samplePoints(f: (x: number) => number, xmin: number, xmax: number, steps: number) {
  const arr: THREE.Vector3[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const x = xmin + t * (xmax - xmin)
    const y = f(x)
    arr.push(new THREE.Vector3(x, y, 0))
  }
  return arr
}

function darken(hex: string, factor: number) {
  // factor 0..1 (0 = black, 1 = same color)
  const c = new THREE.Color(hex)
  c.multiplyScalar(factor)
  return `#${c.getHexString()}`
}

export default function FunctionPlot({
  f,
  xmin = -100,
  xmax = 100,
  steps = 10000,
  color = '#ffffff',
  lineWidth = 1,
  attentionState = 'normal',
}: FunctionPlotProps) {
  const desiredPoints = useMemo(() => samplePoints(f, xmin, xmax, steps), [f, xmin, xmax, steps])

  const [currentPoints, setCurrentPoints] = useState<THREE.Vector3[]>(() =>
    desiredPoints.map(p => p.clone())
  )

  // draw-in animation
  const [visibleCount, setVisibleCount] = useState(2)
  const [drawFinished, setDrawFinished] = useState(false)

  // morph state
  const startPointsRef = useRef<THREE.Vector3[] | null>(null)
  const targetPointsRef = useRef<THREE.Vector3[] | null>(null)
  const progressRef = useRef(0)
  const firstMountRef = useRef(true)

  // attention
  const attn = useAttention({ state: attentionState })

  // refs so we can imperatively update without re-rendering
  const groupRef = useRef<THREE.Group>(null!)
  const lineRef = useRef<any>(null)

  useEffect(() => {
    setVisibleCount(2)
    setDrawFinished(false)
  }, [])

  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false
      setCurrentPoints(desiredPoints.map(p => p.clone()))
      return
    }
    startPointsRef.current = currentPoints.map(p => p.clone())
    targetPointsRef.current = desiredPoints
    progressRef.current = 0
  }, [desiredPoints])

  useFrame((_, delta) => {
    // 1) draw in
    if (!drawFinished) {
      setVisibleCount(prev => {
        const speed = steps
        const next = prev + speed * delta
        if (next >= steps) setDrawFinished(true)
        return Math.min(next, steps)
      })
    } else {
      // 2) morph
      const start = startPointsRef.current
      const target = targetPointsRef.current
      if (start && target) {
        progressRef.current = Math.min(progressRef.current + delta / MORPH_DURATION, 1)
        const t = progressRef.current

        setCurrentPoints(() =>
          start.map((p, i) => {
            const q = target[i]
            return new THREE.Vector3(p.x, p.y + (q.y - p.y) * t, 0)
          })
        )

        if (t >= 1) {
          startPointsRef.current = null
          targetPointsRef.current = null
          progressRef.current = 0
        }
      }
    }

    // 3) apply attention visually (THIS is what you were missing)
    // DIM: darken color + thinner
    // HIGHLIGHT: brighten to white-ish + thicker
    if (lineRef.current) {
      const dimT = attn.dim.current     // 0..1
      const hiT = attn.emphasis.current // 0..1
    
      // color: dim = darker version of original color, highlight = SAME hue (optionally slightly brighter)
      const base = new THREE.Color(color)
    
      // dim: scale brightness down
      const dimFactor = 1 - 0.75 * dimT // to 0.25
      base.multiplyScalar(dimFactor)
    
      // optional: a small brighten on highlight, but keep hue (NO lerp to white)
      const brightenFactor = 1 + 0.25 * hiT // up to +25%
      base.multiplyScalar(brightenFactor)
      base.r = Math.min(1, Math.max(0, base.r))
      base.g = Math.min(1, Math.max(0, base.g))
      base.b = Math.min(1, Math.max(0, base.b))
    
      const finalColor = `#${base.getHexString()}`
    
      // width: dim -> slightly thinner, highlight -> thicker
      const finalWidth =
        lineWidth * (1 - 0.25 * dimT) * (1 + 1.2 * hiT)
    
      // apply color
      lineRef.current.material.color.set(finalColor)
      lineRef.current.material.needsUpdate = true
    
      // apply width if supported
      if ('linewidth' in lineRef.current.material) {
        ;(lineRef.current.material as any).linewidth = finalWidth
      }
    }

    // Don’t scale the curve. It looks like changing the math.
    if (groupRef.current) groupRef.current.scale.setScalar(1)
  })

  const visiblePoints = useMemo(
    () => currentPoints.slice(0, Math.floor(visibleCount)),
    [currentPoints, visibleCount]
  )

  return (
    <group ref={groupRef}>
      <Line
        ref={lineRef}
        points={visiblePoints}
        color={color}
        lineWidth={lineWidth}
      />
    </group>
  )
}