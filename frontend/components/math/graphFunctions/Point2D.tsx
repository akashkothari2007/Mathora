'use client'

import * as THREE from 'three'
import {useFrame} from '@react-three/fiber'
import {useRef, useState, useEffect} from 'react'



export type Point2DProps = {
    position: {x: number, y: number}
    color?: string
    size?: number

    animateTo?: {x: number, y: number}
    animateDuration?: number


}

export default function Point2D({position, color = 'red', size = 0.04, animateTo, animateDuration = 1}: Point2DProps) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [opacity, setOpacity] = useState(0)

    //animations
    const [currentPosition, setCurrentPosition] = useState(position)
    const [animateProgress, setAnimateProgress] = useState(0) //from 0 to 1
    useEffect(() => {
      if(animateTo) {
        setAnimateProgress(0)
        
      }
    }, [animateTo, position])


    //fade in effect + pulse effect + animation
    useFrame((state, delta) => {
        if (!meshRef.current) return;
        //pulsing and fading
        const fadeSpeed = 1
        const pulseStrength = 0.1
        const pulseFrequency = 4
        setOpacity(prev => Math.min(prev+delta*fadeSpeed, 1))

        const pulse = 1 + pulseStrength * Math.sin(state.clock.elapsedTime * pulseFrequency)
        meshRef.current.scale.setScalar(pulse)

        //animation
        if (animateTo && animateProgress < 1) {
          setAnimateProgress(prev => {
            const speed = 1 / animateDuration  // If duration=2, speed=0.5 (takes 2 seconds)
            const next = prev + speed * delta
            return Math.min(next, 1)  // Cap at 1
          })
          const newPosition  = {
            x: position.x + (animateTo.x - position.x) * animateProgress,
            y: position.y + (animateTo.y - position.y) * animateProgress,
          }
          setCurrentPosition(newPosition)
        }

    })
    return (<mesh ref={meshRef} position={[currentPosition.x, currentPosition.y, 0]}>
    <sphereGeometry args={[size, 16, 16]} />
    <meshStandardMaterial
      color={color}
      transparent
      opacity={opacity}
    />
  </mesh>)
}