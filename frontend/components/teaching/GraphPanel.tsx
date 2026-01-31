'use client'

import { useState, useEffect, Suspense, useRef } from 'react';




import MathScene from '../math/scene/MathScene'

import FunctionPlot from '../math/graphFunctions/FunctionPlot'
import Point2D from '../math/graphFunctions/Point2D'
import Label2D from '../math/graphFunctions/Label2D'
import ShadeArea from '../math/graphFunctions/ShadeArea'


import { GraphObject } from '../math/types/graphObject'
import { useTimelineController } from '../math/timeline/TimelineController'
import { Step } from '../math/types/steps';
import { CameraTarget } from '../math/types/cameraTarget';
import SlidingTangent from '../math/graphFunctions/slidingTangent';

type Props = {
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    steps: Step[]
    totalSteps: number
}


export default function GraphPanel({setSubtitle, steps, totalSteps}: Props) {
    const [objects, setObjects] = useState<GraphObject[]>([])
    const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null)     
    const [stepIndex, setStepIndex] = useState(0)
    const executed = useRef<Set<number>>(new Set())
    const availableSteps = steps?.length ?? 0

    const canGoNext = stepIndex < availableSteps - 1

    const reset = () => {
        executed.current.clear()
        setObjects([])
        setCameraTarget(null)
        setStepIndex(-1)
        requestAnimationFrame(() => {
            setStepIndex(0)
        })
    }

    // Calculate percentages for the progress bar
    const currentPercent = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0
    const availablePercent = totalSteps > 0 ? (availableSteps / totalSteps) * 100 : 0

    useTimelineController({steps: steps, setObjects, setSubtitle, setCameraTarget, stepIndex, executed})

    return (
        <div className = "w-full h-full">
            {/* Controls container */}
            <div className="absolute top-16 left-4 z-50 flex flex-col gap-3 w-72">
                {/* Buttons */}
                <div className="flex gap-2">

                    <button
                        onClick={() => canGoNext && setStepIndex(stepIndex + 1)}
                        disabled={!canGoNext}
                        className={`rounded-lg px-4 py-2 text-sm font-medium shadow transition-all active:scale-[0.98]
                            ${canGoNext 
                                ? 'bg-amber-600 text-white hover:bg-amber-500' 
                                : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'}`}
                    >
                        Next
                    </button>
                    <button
                        onClick={reset}
                        className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-300 shadow hover:bg-neutral-800 active:scale-[0.98]"
                    >
                        Restart
                    </button>
                </div>

                {/* Progress bar */}
                <div className="bg-neutral-900/80 rounded-lg p-3 backdrop-blur-sm border border-neutral-800">
                    {/* Step counter */}
                    <div className="flex justify-between items-center mb-2 text-xs">
                        <span className="text-amber-400 font-medium">Step {stepIndex + 1}</span>
                        <span className="text-neutral-500">
                            {availableSteps < totalSteps && (
                                <span className="text-cyan-400">{availableSteps} ready</span>
                            )}
                            {availableSteps < totalSteps && ' / '}
                            <span>{totalSteps} total</span>
                        </span>
                    </div>

                    {/* Custom slider track */}
                    <div 
                        className="relative h-2 rounded-full bg-neutral-700 cursor-pointer"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const percent = (e.clientX - rect.left) / rect.width
                            const newStep = Math.round(percent * (totalSteps - 1))
                            // Only allow clicking to available steps
                            if (newStep < availableSteps) {
                                setStepIndex(newStep)
                            }
                        }}
                    >
                        
                        <div 
                            className="absolute top-0 left-0 h-full bg-cyan-600/60 rounded-full transition-all duration-300"
                            style={{ width: `${availablePercent}%` }}
                        />
                        
                        {/* Current position (amber) */}
                        <div 
                            className="absolute top-0 left-0 h-full bg-amber-500 rounded-full transition-all duration-150"
                            style={{ width: `${currentPercent}%` }}
                        />

                        {/* Thumb indicator */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full shadow-lg border-2 border-white transition-all duration-150"
                            style={{ left: `calc(${currentPercent}% - 8px)` }}
                        />
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mt-2 text-[10px] text-neutral-500">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                            <span>viewed</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-cyan-600" />
                            <span>ready</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-neutral-700" />
                            <span>loading</span>
                        </div>
                    </div>
                </div>
            </div>
            <MathScene cameraTarget={cameraTarget} >
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
                    case 'slidingTangent':
                        return <SlidingTangent key={obj.id} {...obj.props} />
                    default:
                        return null
                }
            })}
            </>
                
                

            </MathScene>
            
        </div>
    )
}