'use client'

import { useState, useEffect, Suspense, useRef } from 'react';




import MathScene from '../math/scene/MathScene'

import FunctionPlot from "../math/graphFunctions/FunctionPlot";
import Point2D from "../math/graphFunctions/Point2D";
import Label2D, { estimateLabelSize } from "../math/graphFunctions/Label2D";
import ShadeArea from "../math/graphFunctions/ShadeArea";
import Line2D from "../math/graphFunctions/Line2D";
import SlidingTangent from "../math/graphFunctions/slidingTangent";
import SecantLine from "../math/graphFunctions/SecantLine";
import { GraphObject } from "../math/types/graphObject";
import { CameraTarget } from "../math/types/cameraTarget";
import type { SceneConfig } from "../math/types/sceneConfig";
import { Bounds, rectsIntersect, makePointBounds, makeLabelBounds } from "../math/graphFunctions/layoutUtils";

type Props = {
    graphObjects: GraphObject[]
    cameraTarget: CameraTarget | null
    sceneConfig: SceneConfig | null
}


function layoutLabels(graphObjects: GraphObject[]): GraphObject[] {
    const occupied: Bounds[] = []
    const result: GraphObject[] = []

    const labels: GraphObject[] = []

    // Reserve thin bands around the x- and y-axes so labels don't sit
    // directly on top of the axes or their numeric labels.
    const AXIS_SAFE_EXTENT = 30
    const AXIS_MARGIN = 0.25
    occupied.push({
        minX: -AXIS_SAFE_EXTENT,
        maxX: AXIS_SAFE_EXTENT,
        minY: -AXIS_MARGIN,
        maxY: AXIS_MARGIN,
    })
    occupied.push({
        minX: -AXIS_MARGIN,
        maxX: AXIS_MARGIN,
        minY: -AXIS_SAFE_EXTENT,
        maxY: AXIS_SAFE_EXTENT,
    })

    // First pass: add non-labels and collect point bounds
    for (const obj of graphObjects) {
        if (obj.type === "point") {
            const { position, size = 0.1 } = obj.props
            const radius = size * 1.4
            occupied.push(makePointBounds(position, radius))
            result.push(obj)
        } else if (obj.type === "label") {
            labels.push(obj)
        } else {
            result.push(obj)
        }
    }

    // Second pass: place labels, nudging upward if they intersect anything
    for (const obj of labels) {
        if (obj.type !== "label") continue
        const { text, position, fontSize } = obj.props

        const { width, height } = estimateLabelSize(text, fontSize)
        const fs = fontSize ?? 0.38
        const stepY = fs * 0.6
        const maxIterations = 20

        let currentPos = { ...position }
        let bounds = makeLabelBounds(currentPos, width, height)

        for (let i = 0; i < maxIterations; i++) {
            const collides = occupied.some(b => rectsIntersect(b, bounds))
            if (!collides) break
            currentPos = { x: currentPos.x, y: currentPos.y + stepY }
            bounds = makeLabelBounds(currentPos, width, height)
        }

        occupied.push(bounds)
        result.push({
            ...obj,
            props: {
                ...obj.props,
                position: currentPos,
            },
        })
    }

    return result
}

export default function GraphPanel({ graphObjects, cameraTarget, sceneConfig }: Props) {
 


    return (
        <div className="w-full h-full bg-[#0a0a0a] min-h-0">
            <MathScene cameraTarget={cameraTarget} sceneConfig={sceneConfig}>
            <>
            {layoutLabels(graphObjects).map(obj => {
                switch (obj.type) {
                    case 'function':
                        return <FunctionPlot key={obj.id} {...obj.props} />
                    case 'point':
                        return <Point2D key={obj.id} {...obj.props} />
                    case 'label':
                        return (
                            <Label2D key={obj.id} {...obj.props} />
                        )
                    case 'area':
                        return <ShadeArea key={obj.id} {...obj.props} />
                    case "slidingTangent":
                        return <SlidingTangent key={obj.id} {...obj.props} />;
                    case "line":
                        return <Line2D key={obj.id} {...obj.props} />;
                    case "secantLine":
                        return <SecantLine key={obj.id} {...obj.props} />;
                    default:
                        return null
                }
            })}
            </>
                
                

            </MathScene>
            
        </div>
    )
}