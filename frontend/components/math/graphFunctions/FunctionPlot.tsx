'use client'

import { useState, useMemo, useEffect } from 'react'
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

  animateTo?: (x: number) => number
  animateDuration?: number
}

export default function FunctionPlot({
  f,
  xmin = -5,
  xmax = 5,
  steps = 1000,
  color = '#ffffff',
  lineWidth = 1,
  animateTo,
  animateDuration = 1,
}: FunctionPlotProps) {

  // static points base
  const basePoints = useMemo(() => {
    const arr: THREE.Vector3[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = xmin + t * (xmax - xmin)
      const y = f(x)
      arr.push(new THREE.Vector3(x, y, 0))
    }
    return arr
  }, [f, xmin, xmax, steps])

  // recompute base points when bounds change
  useEffect(() => {
    setCurrentPoints(basePoints.map(p => p.clone()))    
    setVisibleCount(steps)
  }, [xmin, xmax, steps])

  // current drawn (for drawing animation)
  const [currentPoints, setCurrentPoints] = useState(
    () => basePoints.map(p => p.clone())
  )

  // morphing
  const [targetPoints, setTargetPoints] = useState<THREE.Vector3[] | null>(null)
  const [progress, setProgress] = useState(0)


  const [visibleCount, setVisibleCount] = useState(2)
  const [drawFinished, setDrawFinished] = useState(false)

  // Reset drawing when component is FIRST mounted
  useEffect(() => {
    setVisibleCount(2)
    setDrawFinished(false)
  }, []) //  run only on initial creation then it draws the base points

  //compute new target points when animateTo changes
  useEffect(() => {
    if (!animateTo) return

    const arr: THREE.Vector3[] = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = xmin + t * (xmax - xmin)
      const y = animateTo(x)
      arr.push(new THREE.Vector3(x, y, 0))
    }
    setTargetPoints(arr)
    setProgress(0)
  }, [animateTo, xmin, xmax, steps])
  

  // now we animate the drawing, animate the morphing
  useFrame((_, delta) => {
    // draw animation
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
    if (!targetPoints) return

    setProgress(prev => {
      const next = Math.min(prev + (1 / animateDuration) * delta, 1)

      setCurrentPoints(prevArr =>
        prevArr.map((p, i) => {
          const t = targetPoints[i]
          return new THREE.Vector3(
            p.x,
            p.y + (t.y - p.y) * next,
            0
          )
        })
      )

      return next
    })
  })

  // use visible points
  const visiblePoints = useMemo(
    () => currentPoints.slice(0, Math.floor(visibleCount)),
    [currentPoints, visibleCount]
  )

  return <Line points={visiblePoints} color={color} lineWidth={lineWidth} />
}