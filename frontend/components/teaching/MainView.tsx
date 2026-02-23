import Panel from './Panel'
import GraphPanel from './GraphPanel'
import { Step } from '../math/types/steps'
import { GraphObject } from '../math/types/graphObject'
import { useRef, useState } from 'react'
import { CameraTarget } from '../math/types/cameraTarget'
import { useTimelineController } from '../math/timeline/TimelineController'
import ControlsContainer from './ControlsContainer'
import WhiteboardPanel from './WhiteboardPanel'
import { DEFAULT_SCENE_CONFIG } from '../math/types/sceneConfig'
import type { SceneConfig } from '../math/types/sceneConfig'

type Props = {
    showGraph: boolean
    showWhiteboard: boolean
    showExplanation: boolean
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    steps: Step[]
    done?: boolean
}
export default function MainView({
    showGraph,
    showWhiteboard,
    showExplanation,
    setSubtitle,
    steps,
    done = true,
}: Props) {

        //all animations states etc

        const [graphObjects, setGraphObjects] = useState<GraphObject[]>([])
        const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null)
        const [stepIndex, setStepIndex] = useState(0)
        const executed = useRef<Set<number>>(new Set())
        const [whiteboardLines, setWhiteboardLines] = useState<string[]>([])
        const defaultSceneConfig: SceneConfig = DEFAULT_SCENE_CONFIG
        const [sceneConfig, setSceneConfig] = useState<SceneConfig | null>(defaultSceneConfig)

        const reset = () => {
            executed.current.clear()
            setGraphObjects([])
            setCameraTarget(null)
            setWhiteboardLines([])
            setSceneConfig(defaultSceneConfig)
            setStepIndex(-1)
            requestAnimationFrame(() => {
                setStepIndex(0)
            })
        }

        
        // use timeline controller to handle the timeline
        useTimelineController({ steps, setGraphObjects, setSubtitle, setCameraTarget, stepIndex, setStepIndex, executed, setWhiteboardLines, setSceneConfig })
        const panels = [
        showGraph && <GraphPanel key="graph" graphObjects={graphObjects} cameraTarget={cameraTarget} sceneConfig={sceneConfig} />,
        showWhiteboard && <WhiteboardPanel key = "whiteboard" whiteboardLines={whiteboardLines} />,
        showExplanation && <Panel key = "explanation" title = "Explanation" />,
    ].filter(Boolean)


    return (
        
        <div className = "flex flex-1">
            {panels.map(panel => (
                <div key = {(panel as any).key} className = "flex-1 border-r border-neutral-800/50 last:border-r-0">
                    {panel}
                </div>
            ))}
            <ControlsContainer setStepIndex={setStepIndex} reset={reset} stepIndex={stepIndex} stepsLength={steps?.length ?? 0} done={done} />
        </div>
    )
    
}
    
