import Panel from './Panel'
import GraphPanel from './GraphPanel'
import SubtitleChatPanel from './SubtitleChatPanel'
import { Step } from '../math/types/steps'
import { GraphObject } from '../math/types/graphObject'
import { useRef, useState } from 'react'
import { CameraTarget } from '../math/types/cameraTarget'
import { useTimelineController, type ChatBlock } from '../math/timeline/TimelineController'
import ControlsContainer from './ControlsContainer'
import { DEFAULT_SCENE_CONFIG } from '../math/types/sceneConfig'
import type { SceneConfig } from '../math/types/sceneConfig'

type Props = {
    prompt: string
    showGraph: boolean
    showWhiteboard: boolean
    showExplanation: boolean
    setSubtitle: React.Dispatch<React.SetStateAction<string>>
    subtitle: string
    steps: Step[]
    done?: boolean
}
export default function MainView({
    prompt,
    showGraph,
    showWhiteboard,
    showExplanation,
    setSubtitle,
    subtitle,
    steps,
    done = true,
}: Props) {

        const [graphObjects, setGraphObjects] = useState<GraphObject[]>([])
        const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null)
        const [stepIndex, setStepIndex] = useState(0)
        const executed = useRef<Set<number>>(new Set())
        const [whiteboardLines, setWhiteboardLines] = useState<string[]>([])
        const defaultSceneConfig: SceneConfig = DEFAULT_SCENE_CONFIG
        const [sceneConfig, setSceneConfig] = useState<SceneConfig | null>(defaultSceneConfig)
        const [subtitleProgress, setSubtitleProgress] = useState(0)
        const [chatBlocks, setChatBlocks] = useState<ChatBlock[]>([])
        const subtitleRef = useRef(subtitle)
        subtitleRef.current = subtitle

        const reset = () => {
            executed.current.clear()
            setGraphObjects([])
            setCameraTarget(null)
            setWhiteboardLines([])
            setChatBlocks([])
            setSceneConfig(defaultSceneConfig)
            setStepIndex(-1)
            requestAnimationFrame(() => {
                setStepIndex(0)
            })
        }

        useTimelineController({ steps, setGraphObjects, setSubtitle, setSubtitleProgress, setChatBlocks, subtitleRef, setCameraTarget, stepIndex, setStepIndex, executed, setWhiteboardLines, setSceneConfig })

    const hasGraph = showGraph
    const hasNarration = showWhiteboard
    const bothVisible = hasGraph && hasNarration

    return (
        <div className="flex flex-1 min-w-0">
            {showGraph && (
                <div
                    className={`min-w-0 ${bothVisible ? "flex-[1.6]" : "flex-1"} ${bothVisible ? "" : "border-r border-neutral-800/50"}`}
                >
                    <GraphPanel graphObjects={graphObjects} cameraTarget={cameraTarget} sceneConfig={sceneConfig} />
                </div>
            )}
            {showWhiteboard && (
                <div
                    className="flex-1 min-w-0 relative before:content-[''] before:absolute before:inset-y-0 before:left-0 before:w-16 before:pointer-events-none before:bg-gradient-to-r before:from-black/25 before:to-transparent before:z-0"
                    style={{ boxShadow: "inset 20px 0 48px -16px rgba(0,0,0,0.4)" }}
                >
                    <SubtitleChatPanel
                        prompt={prompt}
                        chatBlocks={chatBlocks}
                        currentStepWhiteboardLines={steps[stepIndex]?.whiteboardLines ?? []}
                        currentStepWhiteboardAtIndices={steps[stepIndex]?.whiteboardAtIndices}
                        subtitle={subtitle}
                        subtitleProgress={subtitleProgress}
                    />
                </div>
            )}
            {showExplanation && (
                <div className="flex-1 min-w-0 border-r border-neutral-800/50 last:border-r-0">
                    <Panel key="explanation" title="Explanation" />
                </div>
            )}
            <ControlsContainer setStepIndex={setStepIndex} reset={reset} stepIndex={stepIndex} stepsLength={steps?.length ?? 0} done={done} />
        </div>
    )
}
    
