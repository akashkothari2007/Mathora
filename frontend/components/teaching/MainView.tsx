import Panel from './Panel'
import GraphPanel from './GraphPanel'
import { Step } from '../math/types/steps'
import { GraphObject } from '../math/types/graphObject'
import { useRef, useState } from 'react'
import { CameraTarget } from '../math/types/cameraTarget'
import { useTimelineController } from '../math/timeline/TimelineController'
import ControlsContainer from './ControlsContainer'
import WhiteboardPanel from './WhiteboardPanel'

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

        //all animations states etc

        const [graphObjects, setGraphObjects] = useState<GraphObject[]>([]) //graph objects
        const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null)   //camera target  
        const [stepIndex, setStepIndex] = useState(0) //cur index
        const executed = useRef<Set<number>>(new Set()) //what has been executed so far

        // add whiteboard funcs here
        const [whiteboardLines, setWhiteboardLines] = useState<string[]>([]) //latex lines

        // reset all animations, set everything to initial state
        const reset = () => {
            executed.current.clear()
            setGraphObjects([])
            setCameraTarget(null)
            setWhiteboardLines([])
            setStepIndex(-1)
            requestAnimationFrame(() => {
                setStepIndex(0)
            })
        }

        
        // use timeline controller to handle the timeline
        useTimelineController({steps: steps, setGraphObjects, setSubtitle, setCameraTarget, stepIndex, executed, setWhiteboardLines})    //use timeline controller to handle the timeline

        const panels = [
        showGraph && <GraphPanel key = "graph" graphObjects={graphObjects} cameraTarget={cameraTarget} />,
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
            <ControlsContainer setStepIndex={setStepIndex} reset={reset} stepIndex={stepIndex} availableSteps={steps?.length ?? 0} totalSteps={totalSteps} />
        </div>
    )
    
}
    
