import { useState } from 'react'
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

    //GET ACTIONS FROM PROMPT HERE MAKE API CALL TO BACKEND
    let actions = wavesArtTimeline 
    if (prompt === 'area test') {
        actions = shadeAreaTimeline
    } else if (prompt === 'point test') {
        actions = pointAndLabelTestTimeline
    } else if (prompt === 'function test') {
        actions = functionPlotTimeline
    } else if (prompt === 'tangent test') {
        actions = slidingTangentTimeline
    } else if (prompt === 'camera test') {
        actions = cameraTimeline
    }
    const [subtitle, setSubtitle] = useState(' ')
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
                <MainView
                    showGraph={showGraph}
                    showWhiteboard={showWhiteboard}
                    showExplanation={showExplanation}
                    setSubtitle={setSubtitle}
                    actions={actions}
                />
                </div>
            
            <div className="h-10 text-center text-sm text-neutral-500 border-t border-neutral-800/50">
                {subtitle}
            </div>
        </div>

    )
}

