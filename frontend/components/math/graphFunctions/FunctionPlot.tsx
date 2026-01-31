'use client'

import { useMemo, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export type FunctionPlotProps = {
  f: (x: number) => number
  xmin?: number
  xmax?: number
  steps?: number
  color?: string
  lineWidth?: number
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

export default function FunctionPlot({
  f,
  xmin = -100,
  xmax = 100,
  steps = 10000,
  color = '#ffffff',
  lineWidth = 1,
}: FunctionPlotProps) {
  const desiredPoints = useMemo(
    () => samplePoints(f, xmin, xmax, steps),
    [f, xmin, xmax, steps]
  )

  // what we render
  const [currentPoints, setCurrentPoints] = useState<THREE.Vector3[]>(
    () => desiredPoints.map(p => p.clone())
  )

  // draw-in animation
  const [visibleCount, setVisibleCount] = useState(2)
  const [drawFinished, setDrawFinished] = useState(false)

  // morph state
  const startPointsRef = useRef<THREE.Vector3[] | null>(null)
  const targetPointsRef = useRef<THREE.Vector3[] | null>(null)
  const progressRef = useRef(0)

  const firstMountRef = useRef(true)

  // On mount: reset drawing
  useEffect(() => {
    setVisibleCount(2)
    setDrawFinished(false)
  }, [])

  // When desiredPoints changes:
  // - first mount: just set them (draw anim will reveal)
  // - later: morph from current -> desired
  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false
      setCurrentPoints(desiredPoints.map(p => p.clone()))
      return
    }

    // start morph
    startPointsRef.current = currentPoints.map(p => p.clone())
    targetPointsRef.current = desiredPoints
    progressRef.current = 0
  }, [desiredPoints])

  useFrame((_, delta) => {
    // draw animation first
    if (!drawFinished) {
      setVisibleCount(prev => {
        const speed = steps
        const next = prev + speed * delta
        if (next >= steps) setDrawFinished(true)
        return Math.min(next, steps)
      })
      return
    }

    // morph animation
    const start = startPointsRef.current
    const target = targetPointsRef.current
    if (!start || !target) return

    progressRef.current = Math.min(progressRef.current + delta / MORPH_DURATION, 1)
    const t = progressRef.current

    setCurrentPoints(() =>
      start.map((p, i) => {
        const q = target[i]
        return new THREE.Vector3(
          p.x,               // x stays the sampled x
          p.y + (q.y - p.y) * t,
          0
        )
      })
    )

    if (t >= 1) {
      // done
      startPointsRef.current = null
      targetPointsRef.current = null
      progressRef.current = 0
    }
  })

  const visiblePoints = useMemo(
    () => currentPoints.slice(0, Math.floor(visibleCount)),
    [currentPoints, visibleCount]
  )

  return <Line points={visiblePoints} color={color} lineWidth={lineWidth} />
}