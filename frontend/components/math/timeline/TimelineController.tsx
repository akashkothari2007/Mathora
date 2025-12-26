'use client'

import { useEffect, useRef, useState } from 'react'
import { Action } from '../types/actions'
import { SceneObject } from '../types/scene'

type UseTimelineControllerProps = {
  actions: Action[]
  setObjects: React.Dispatch<React.SetStateAction<SceneObject[]>>
  setSubtitle: React.Dispatch<React.SetStateAction<string>>
}

export function useTimelineController({
  actions,
  setObjects,
  setSubtitle,
}: UseTimelineControllerProps) {
  const [step, setStep] = useState(0)
  const executedSteps = useRef<Set<number>>(new Set())


  useEffect(() => {
    if (step >= actions.length) return
    if (executedSteps.current.has(step)) return

    executedSteps.current.add(step)
    const action = actions[step]

    console.log('Executing step', step, action)
    // set the subtitle
    const subtitle = action.subtitle;
    setSubtitle(subtitle)

    //execute the graph action
    switch (action.type) {
        case 'add':
            setObjects(prev => [...prev, action.object])
            break
        case 'remove':
            setObjects(prev => prev.filter(obj => obj.id !== action.id))
            break
        case 'update':
            setObjects(prev =>
                prev.map(obj =>
                  obj.id === action.id
                    ? { ...obj, props: { ...obj.props, ...action.props } }
                    : obj
                )
              )
            break
        case 'wait':
            break
    }
  
  }, [step, actions, setObjects])

  useEffect(() => {
    if (step >= actions.length) return

    const timeout = setTimeout(() => {
      console.log('Advancing to step', step + 1)
      setStep(prev => prev + 1)
    }, actions[step].time * 1000)

    return () => clearTimeout(timeout)
  }, [step, actions])
}