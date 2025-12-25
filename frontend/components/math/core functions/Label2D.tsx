'use client'

import { Text, Billboard, useFont} from '@react-three/drei'
import {useState} from 'react'
import {useFrame} from '@react-three/fiber'


export type Label2DProps = {
    text: string
    position: {x: number, y: number}
    color?: string
    fontSize?: number
}

export default function Label2D({text, position, color = 'white', fontSize = 0.3}: Label2DProps) {
    const labelOffset = 0.3
    const fadeSpeed = 1
    const [opacity, setOpacity] = useState(0)
    useFrame((_, delta) => {
        setOpacity(prev => Math.min(prev+delta*fadeSpeed, 1))
    })
    return (    
        <Billboard position={[position.x, position.y, 0]}>
        <Text
        font="/fonts/Handlee-Regular.ttf"
        position={[labelOffset,labelOffset,0]}
        fontSize={fontSize}
        color={color}
        fillOpacity={opacity}
        anchorX="left"
        anchorY="middle"
        >
        {text}
        </Text>
        </Billboard>
    )
}