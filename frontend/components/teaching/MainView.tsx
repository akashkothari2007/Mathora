import Panel from './Panel'
import GraphPanel from './GraphPanel'
import { Step } from '../math/types/steps'
import { GraphObject } from '../math/types/graphObject'
import { useRef, useState } from 'react'
import { CameraTarget } from '../math/types/cameraTarget'
import { useTimelineController } from '../math/timeline/TimelineController'
import ControlsContainer from './ControlsContainer'


type Props = {
    showGraph: boolean
    showWhiteboard: boolean
    showExplanation: boolean
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    steps: Step[]
    totalSteps: number

}
export default function MainView({
    showGraph,
    showWhiteboard,
    showExplanation,
    setSubtitle,
    steps,
    totalSteps}: Props) {

        const [graphObjects, setGraphObjects] = useState<GraphObject[]>([]) //graph objects
        const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null)   //camera target  
        const [stepIndex, setStepIndex] = useState(0) //cur index
        const executed = useRef<Set<number>>(new Set()) //what has been executed so far


        const reset = () => {
            executed.current.clear()
            setGraphObjects([])
            setCameraTarget(null)
            setStepIndex(-1)
            requestAnimationFrame(() => {
                setStepIndex(0)
            })
        }

        // Calculate percentages for the progress bar

        useTimelineController({steps: steps, setGraphObjects, setSubtitle, setCameraTarget, stepIndex, executed})    //use timeline controller to handle the timeline

        const panels = [
        showGraph && <GraphPanel key = "graph" graphObjects={graphObjects} cameraTarget={cameraTarget} />,
        showWhiteboard && <Panel key = "whiteboard" title = "Whiteboard" />,
        showExplanation && <Panel key = "explanation" title = "Explanation" />,
    ].filter(Boolean)


    return (
        
        <div className = "flex flex-1">
            {panels.map(panel => (
                <div key = {(panel as any).key} className = "flex-1 border-r border-neutral-800/50 last:border-r-0">
                    {panel}
                </div>
            ))}
            <ControlsContainer setStepIndex={setStepIndex} reset={reset} stepIndex={stepIndex} availableSteps={steps?.length ?? 0} totalSteps={totalSteps} />
        </div>
    )
    
}

