'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { AttentionState } from '../types/attentionStates'

type Params = {
  state: AttentionState
}

export function useAttention({ state = 'normal' }: Params) {
  const scale = useRef(1)
  const emphasis = useRef(0) // 0..1 (0 normal, 1 highlighted)
  const dim = useRef(0)      // 0..1 (0 normal, 1 dimmed)

  const target = useMemo(() => {
    return {
      scale: state === 'highlighted' ? 1.0 : 1.0, // don't scale functions; looks like curve changes
      emphasis: state === 'highlighted' ? 1 : 0,
      dim: state === 'dimmed' ? 1 : 0,
    }
  }, [state])

  useFrame((_, delta) => {
    const k = 1 - Math.exp(-12 * delta)

    scale.current += (target.scale - scale.current) * k
    emphasis.current += (target.emphasis - emphasis.current) * k
    dim.current += (target.dim - dim.current) * k
  })

  return { scale, emphasis, dim }
}