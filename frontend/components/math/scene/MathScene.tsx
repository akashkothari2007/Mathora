'use client'

import { Canvas } from '@react-three/fiber'
import Axes from './Axes'
import Grid from './Grid'
import UnitCircle from './UnitCircle'
import { ReactNode } from 'react'
import { Text } from '@react-three/drei'
import { CameraTarget } from '../types/cameraTarget'
import CameraRig from '../cameraFunctions/CameraRig'
import type { SceneConfig } from '../types/sceneConfig'
import { DEFAULT_SCENE_CONFIG } from '../types/sceneConfig'

type MathSceneProps = {
    children?: ReactNode
    cameraTarget: CameraTarget | null
    sceneConfig: SceneConfig | null
}

const AXIS_BASE_EXTENT = 10
const AXIS_MAX_EXTENT = 15

function computeAxesExtents(cameraTarget: CameraTarget | null) {
    const center = cameraTarget?.center ?? [0, 0, 0]
    const width = cameraTarget?.width ?? AXIS_BASE_EXTENT * 2
    const height = cameraTarget?.height ?? AXIS_BASE_EXTENT * 2

    const needX = Math.abs(center[0]) + width / 2
    const needY = Math.abs(center[1]) + height / 2

    const extentX = Math.min(AXIS_MAX_EXTENT, Math.max(AXIS_BASE_EXTENT, needX))
    const extentY = Math.min(AXIS_MAX_EXTENT, Math.max(AXIS_BASE_EXTENT, needY))

    return {
        xMin: -extentX,
        xMax: extentX,
        yMin: -extentY,
        yMax: extentY,
    }
}

export default function MathScene({ children, cameraTarget, sceneConfig }: MathSceneProps) {
    const config: SceneConfig = sceneConfig ?? DEFAULT_SCENE_CONFIG
    const extents = computeAxesExtents(cameraTarget)

    const isAxesMode = config.mode === 'axes'
    const isUnitCircleMode = config.mode === 'unitCircle'

    const axesLabels = isAxesMode ? (config.axes?.labels ?? true) : false
    const axesTickSpacing = isAxesMode ? (config.axes?.tickSpacing ?? 1) : 1

    return (
        <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        className="bg-neutral-950"
        >
            <CameraRig cameraTarget={cameraTarget} />

            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={0.6} />

            {/* Axes: in axes mode they are labeled; in unitCircle mode they are unlabeled background */}
            {(isAxesMode || isUnitCircleMode) && (
                <Axes
                    xMin={extents.xMin}
                    xMax={extents.xMax}
                    yMin={extents.yMin}
                    yMax={extents.yMax}
                    labels={axesLabels}
                    tickMarks={isAxesMode}
                    tickSpacing={axesTickSpacing}
                    color={isUnitCircleMode ? "rgba(255,255,255,0.35)" : undefined}
                />
            )}
            {isUnitCircleMode && (
                <UnitCircle
                    labels={config.unitCircle?.labels ?? false}
                    units={config.unitCircle?.units ?? 'degrees'}
                />
            )}
            <Grid />


            <Text
            font="/fonts/Handlee-Regular.ttf"
            fontSize={0.001}
            visible={false}
            >
            warmup
            </Text>


            {children}
            
            

        </Canvas>
    )
}
