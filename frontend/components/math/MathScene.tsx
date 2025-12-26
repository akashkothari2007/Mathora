'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Axes from './Axes'
import Grid from './Grid'
import {ReactNode, Suspense} from 'react'
import { Text } from '@react-three/drei'
import CameraLogger from './CameraLogger'

type MathSceneProps = {
    children?: ReactNode
}

export default function MathScene({children}: MathSceneProps) {
    return (
        <Canvas
        camera={{position: [0, 0, 10], fov:50}}
        className = "bg-neutral-950"
        >
       {/* <CameraLogger /> */}
            <ambientLight
            intensity={0.6}
            />
            <directionalLight
            position={[10,10,10]}
            intensity={0.6}
            />
            <Axes length = {15}/>
            <Grid />


            <Text
            font="/fonts/Handlee-Regular.ttf"
            fontSize={0.001}
            visible={false}
            >
            warmup
            </Text>


            {children}
            
            
            <OrbitControls
            enableDamping
            dampingFactor={0.1}
            />
        </Canvas>
    )
}
