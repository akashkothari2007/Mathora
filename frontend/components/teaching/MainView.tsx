import Panel from './Panel'
import GraphPanel from './GraphPanel'
import { Step } from '../math/types/steps'


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
    const panels = [
        showGraph && <GraphPanel key = "graph" setSubtitle={setSubtitle} steps={steps} totalSteps={totalSteps} />,
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
        </div>
    )
    
}

