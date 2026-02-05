'use client'

import { useEffect, useRef, useState } from 'react'
import { Step } from '../types/steps'
import { GraphObject } from '../types/graphObject'
import { CameraTarget } from '../types/cameraTarget'
import { handleSubtitle } from './handleSubtitle'

type UseTimelineControllerProps = {
  steps: Step[]
  stepIndex: number
  setGraphObjects: React.Dispatch<React.SetStateAction<GraphObject[]>>
  setSubtitle: React.Dispatch<React.SetStateAction<string>>
  setCameraTarget: React.Dispatch<React.SetStateAction<CameraTarget | null>>
  executed: React.RefObject<Set<number>>
  setWhiteboardLines: React.Dispatch<React.SetStateAction<string[]>>
}

export function useTimelineController({
  steps,
  setGraphObjects,
  setSubtitle,
  setCameraTarget,
  stepIndex,
  executed,
  setWhiteboardLines,
}: UseTimelineControllerProps) {
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // execute the current step exactly once
  useEffect(() => {

    
    if (stepIndex < 0 || stepIndex >= steps.length) return
    if (executed.current.has(stepIndex)) return

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    executed.current.add(stepIndex)

    const step = steps[stepIndex]
    console.log('Executing step', stepIndex, step)

    // subtitle + camera are step-level now
    handleSubtitle({ subtitle: step.subtitle ?? '', setSubtitle , audioRef})
    setWhiteboardLines(prev => [...prev, ...(step.whiteboardLines ?? [])])

    if (step.cameraTarget) setCameraTarget(step.cameraTarget)
    else setCameraTarget(null)

    // apply every action in this step immediately (same "tick")
    for (const action of step.actions ?? []) {
      switch (action.type) {
        case 'add':
          setGraphObjects(prev => [...prev, action.object])
          break

        case 'remove':
          setGraphObjects(prev => prev.filter(obj => obj.id !== action.id))
          break
        case 'update':
          setGraphObjects(prev =>
            prev.map(obj =>
              obj.id === action.id
                ? { ...obj, props: { ...obj.props, ...action.props } }
                : obj
            )
          )
          break
      }
    }
  }, [stepIndex, steps, setGraphObjects, setSubtitle, setCameraTarget])
  // cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [])


}