'use client'

import { useState, useEffect, Suspense } from 'react';




import MathScene from './math/MathScene'

import FunctionPlot from './math/core functions/FunctionPlot'
import Point2D from './math/core functions/Point2D'
import Label2D from './math/core functions/Label2D'
import ShadeArea from './math/core functions/ShadeArea'


import { SceneObject } from './math/types/scene'
import { useTimelineController } from './math/timeline/TimelineController'
import { Action } from './math/types/actions';

type Props = {
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    actions: Action[]
}


export default function GraphPanel({setSubtitle, actions}: Props) {
    const [objects, setObjects] = useState<SceneObject[]>([])
    useTimelineController({actions: actions, setObjects, setSubtitle})
    return (
        <div className = "w-full h-full">
            <MathScene >
            <>
            {objects.map(obj => {
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
                    default:
                        return null
                }
            })}
            </>
                
                

            </MathScene>
        </div>
    )
}