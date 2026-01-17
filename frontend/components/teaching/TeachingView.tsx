import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MainView from './MainView'

//random ass tests
import { wavesArtTimeline } from '../math/timeline/randomTests/artDemoTimeline'
import { demoTimeline } from '../math/timeline/randomTests/demoTimeline'
import { integralDemoTimeline } from '../math/timeline/randomTests/integralDemoTimeline'


//core tests
import {
    pointAndLabelTestTimeline,
    functionPlotTimeline,
    shadeAreaTimeline,
    slidingTangentTimeline,
    cameraTimeline,
} from '../math/timeline/coreFunctionTests/index'
import { Action } from '../math/types/actions'



type Props = {
    prompt: string
    onNewChat: () => void
}

export default function TeachingView({prompt, onNewChat}: Props) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [showGraph, setShowGraph] = useState(true)
    const [showWhiteboard, setShowWhiteboard] = useState(false)
    const [showExplanation, setShowExplanation] = useState(true)
    const [actions, setActions] = useState<Action[] | null>(null)
    const [subtitle, setSubtitle] = useState(' ')

    useEffect(() => {
        // Handle test prompts
        if (prompt === 'area test') {
            setActions(shadeAreaTimeline)
            return
        } else if (prompt === 'point test') {
            setActions(pointAndLabelTestTimeline)
            return
        } else if (prompt === 'function test') {
            setActions(functionPlotTimeline)
            return
        } else if (prompt === 'tangent test') {
            setActions(slidingTangentTimeline)
            return
        } else if (prompt === 'camera test') {
            setActions(cameraTimeline)
            return
        }

        // Reset actions while loading
        setActions(null)

        // Make API call for real prompts
        const fetchTimeline = async () => {
            try {
                console.log('[Frontend] Fetching timeline for prompt:', prompt)
                const response = await fetch('http://localhost:3001/timeline', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                })
                const data = await response.json()
                console.log('[Frontend] Received response data:', data)
                
                // Debug: Check if data is defined and has timeline
                if (!data) {
                    console.error('[Frontend] Data is undefined')
                    setActions(wavesArtTimeline) // Fallback
                    return
                }
                
                if (!data.timeline) {
                    console.error('[Frontend] data.timeline is undefined. Full data:', JSON.stringify(data, null, 2))
                    setActions(wavesArtTimeline) // Fallback
                    return
                }
                
                // Debug: Check if timeline is an array
                if (!Array.isArray(data.timeline)) {
                    console.error('[Frontend] data.timeline is not an array:', typeof data.timeline, data.timeline)
                    setActions(wavesArtTimeline) // Fallback
                    return
                }
                
                console.log('[Frontend] Setting actions, count:', data.timeline.length)
                setActions(data.timeline)
            } catch (err) {
                console.error('[Frontend] Failed to fetch timeline:', err)
                setActions(wavesArtTimeline) // Fallback
            }
        }

        fetchTimeline()
    }, [prompt])
    return (
        <div className = "h-full flex flex-col">
            <TopBar
                onNewChat = {onNewChat}
                toggleSidebar = {() => setShowSidebar(v => !v)}
                toggleGraph = {() => setShowGraph(v => !v)}
                toggleWhiteboard = {() => setShowWhiteboard(v => !v)}
                toggleExplanation = {() => setShowExplanation(v => !v)}
                />
            

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar container */}
                <div
                    className={`
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${showSidebar ? 'w-72' : 'w-0'}
                    `}
                >
                    <div
                    className={`
                        h-full
                        transition-transform duration-300 ease-in-out
                        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
                    `}
                    >
                    <Sidebar />
                    </div>
                </div>

                {/* Main content */}
                {actions ? (
                    <MainView
                        showGraph={showGraph}
                        showWhiteboard={showWhiteboard}
                        showExplanation={showExplanation}
                        setSubtitle={setSubtitle}
                        actions={actions}
                    />
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-neutral-950">
                        <div className="text-center">
                            <div className="text-neutral-400 text-lg mb-2">Generating animation timeline...</div>
                            <div className="text-neutral-500 text-sm">Please wait while the AI creates your visualization</div>
                        </div>
                    </div>
                )}
                </div>
            
            <div className="h-10 text-center text-sm text-neutral-500 border-t border-neutral-800/50">
                {subtitle}
            </div>
        </div>

    )
}

