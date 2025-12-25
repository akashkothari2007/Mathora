'use client'

import { useState } from 'react'

import * as THREE from 'three'
import {Line} from '@react-three/drei'
import {useMemo} from 'react'
import {useFrame} from '@react-three/fiber'

export type FunctionPlotProps = {
    f: (x: number) => number
    xmin?: number
    xmax?: number
    steps?: number
    color?: string
    lineWidth?: number

}

export default function FunctionPlot({f, xmin = -5, xmax = 5, steps = 1000, color = '#white', lineWidth = 1}: FunctionPlotProps) {
    
    const points = useMemo(() => {
        const pts: THREE.Vector3[] = []

        for (let i = 0; i<= steps; i++) {
            const t = i/steps;
            const x = xmin+t*(xmax-xmin);
            const y = f(x);

            pts.push(new THREE.Vector3(x,y,0))
            
        }
        return pts;
    }, [f, xmin, xmax, steps])

    const [visibleCount, setVisibleCount] = useState(2) //need two points initilally visible
    useFrame((_, delta) => {

        setVisibleCount(prev => {
            const speed = steps;
            const next = prev + speed * delta;
            return Math.min(next, steps);
        })
    })
    const visiblePoints = useMemo(
        () => points.slice(0, Math.floor(visibleCount)),
        [points, visibleCount]
    )


    return (
    <Line
        points={visiblePoints}
        color={color}
        lineWidth={lineWidth}
    />
    )
    
}