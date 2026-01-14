import Panel from './Panel'
import GraphPanel from './GraphPanel'
import type { Action } from '../math/types/actions'


type Props = {
    showGraph: boolean
    showWhiteboard: boolean
    showExplanation: boolean
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    actions: Action[]

}
export default function MainView({
    showGraph,
    showWhiteboard,
    showExplanation,
    setSubtitle,
    actions}: Props) {
    const panels = [
        showGraph && <GraphPanel key = "graph" setSubtitle={setSubtitle} actions={actions} />,
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

