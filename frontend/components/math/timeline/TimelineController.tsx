'use client'

import { useEffect, useRef, useState } from 'react'
import { Step } from '../types/steps'
import { GraphObject } from '../types/graphObject'
import { CameraTarget } from '../types/cameraTarget'
import { handleSubtitle } from './handleSubtitle'
import { applyAttention } from './ActionManager'

type UseTimelineControllerProps = {
  steps: Step[]
  stepIndex: number
  setStepIndex: React.Dispatch<React.SetStateAction<number>>
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
  setStepIndex,
  executed,
  setWhiteboardLines,
}: UseTimelineControllerProps) {
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance after timeToAdvance ms when there is a next step
  useEffect(() => {
    const step = steps[stepIndex];
    const ms = step?.timeToAdvance;
    const hasNext = stepIndex + 1 < steps.length;
    if (ms == null || !hasNext) return;

    advanceTimerRef.current = setTimeout(() => {
      setStepIndex((prev) => prev + 1);
    }, ms);
    return () => {
      if (advanceTimerRef.current) {
        clearTimeout(advanceTimerRef.current);
        advanceTimerRef.current = null;
      }
    };
  }, [stepIndex, steps, setStepIndex]);

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
    const addedIds: string[] = [];
    const updatedIds: string[] = [];
    for (const action of step.actions ?? []) {
      switch (action.type) {
        case 'add':
          setGraphObjects(prev => [...prev, action.object])
          addedIds.push(action.object.id)
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
          updatedIds.push(action.id)
          break
      }
    }
    setGraphObjects((prev) =>
      applyAttention({
        objects: prev,
        addedIds,
        updatedIds,
      })
    );
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