'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'

export default function CameraLogger() {
  const { camera } = useThree()
  const elapsedRef = useRef(0)

  useFrame((_, delta) => {
    elapsedRef.current += delta

    // log once per second
    if (elapsedRef.current >= 1) {
      elapsedRef.current = 0

      console.log('📷 Camera')
      console.log('Position:', camera.position.toArray())
      console.log('Rotation:', camera.rotation.toArray())
      console.log('FOV:', (camera as any).getEffectiveFOV()) //@ts-ignore       
      console.log('Zoom:', camera.zoom)
      console.log('Near/Far:', camera.near, camera.far)
      console.log('---------------------')
    }
  })

  return null
}