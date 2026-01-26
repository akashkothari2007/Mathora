import { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import MainView from './MainView'
import { normalizeSteps } from '../math/timeline/NormalizeTimeline'

//random ass tests
import { demoTimeline } from '../math/timeline/randomTests/demoTimeline'
import { rawTimeline } from '../math/timeline/randomTests/stringFunctions'

//core tests
import {
    pointAndLabelTestTimeline,
    functionPlotTimeline,
    shadeAreaTimeline,
    slidingTangentTimeline,
    cameraTimeline,
} from '../math/timeline/coreFunctionTests/index'
import { Step } from '../math/types/steps'



type Props = {
    prompt: string
    onNewChat: () => void
}

export default function TeachingView({prompt, onNewChat}: Props) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [showGraph, setShowGraph] = useState(true)
    const [showWhiteboard, setShowWhiteboard] = useState(false)
    const [showExplanation, setShowExplanation] = useState(true)
    const [steps, setSteps] = useState<Step[] | null>(null)
    const [subtitle, setSubtitle] = useState(' ')
    const fetchingRef = useRef(false)
    const currentPromptRef = useRef<string>('')

    //sse steps
    const eventSourceRef = useRef<EventSource | null>(null)
    const rawStepsRef = useRef<any[]>([])

    useEffect(() => {
        // Handle test prompts
        if (prompt == 'normalize test') {
            setSteps(normalizeSteps(rawTimeline))
            return
        }
        if (prompt === 'area test') {
            setSteps(shadeAreaTimeline)
            return
        } else if (prompt === 'point test') {
            setSteps(pointAndLabelTestTimeline)
            return
        } else if (prompt === 'function test') {
            setSteps(functionPlotTimeline)
            return
        } else if (prompt === 'tangent test') {
            setSteps(slidingTangentTimeline)
            return
        } else if (prompt === 'camera test') {
            setSteps(cameraTimeline)
            return
        }

        // Prevent duplicate calls
        if (fetchingRef.current && currentPromptRef.current === prompt) {
            console.log('[Frontend] Already fetching for this prompt, skipping duplicate call')
            return
        }
        
        //clean up old connection if any
        eventSourceRef.current?.close()
        eventSourceRef.current = null
        rawStepsRef.current = []

        // Reset actions while loading
        setSteps(null)
        fetchingRef.current = true
        currentPromptRef.current = prompt

        // Make API call for real prompts
        const fetchTimeline = async () => {
            console.log('[Frontend] ========== NEW REQUEST ==========')
            console.log('[Frontend] Prompt submitted:', prompt)
            
            try {
                console.log('[Frontend] Making API call to http://localhost:3001/timeline/start')
                const response = await fetch('http://localhost:3001/timeline/start', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt }),
                })
                
                console.log('[Frontend] Response status:', response.status, response.statusText)
                
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
                    console.error('[Frontend] Error response from backend:', errorData)
                    throw new Error(errorData.error || `HTTP ${response.status}`)
                }
                
                const data = await response.json()
                console.log('[Frontend] Data received from backend:', data)
                
                // Debug: Check if data is defined and has timeline
                if (!data) {
                    console.error('[Frontend] ERROR: Data is undefined')
                    throw new Error('No data received from backend')
                }
                
                if (data.error) {
                    console.error('[Frontend] ERROR: Backend returned error:', data.error)
                    throw new Error(data.error)
                }
                
                if (!data.firstStep) {
                    console.error('[Frontend] ERROR: data.firstStep is undefined. Full data:', JSON.stringify(data, null, 2))
                    throw new Error('First step missing from response')
                }
                
                // Debug: Check if firstStep is an array
                console.log('[Frontend] First step:', data.firstStep)
                if (!Array.isArray(data.firstStep)) {
                    console.error('[Frontend] ERROR: data.firstStep is not an array:', typeof data.firstStep, data.firstStep)
                    throw new Error('First step is not an array')
                }
                
                console.log('[Frontend] Timeline received, step count:', data.firstStep.length)
                const normalizedTimeline = normalizeSteps(data.firstStep)
                console.log('[Frontend] Normalized timeline, final step count:', normalizedTimeline.length)
                console.log('[Frontend] ========== REQUEST SUCCESS ==========')

                //save first step
                rawStepsRef.current = data.firstStep
                fetchingRef.current = false
                setSteps(normalizedTimeline)


                

                
                //start sse connection
                // start SSE connection (named events)
                const es = new EventSource(`http://localhost:3001/timeline/stream/${data.sessionId}`)
                eventSourceRef.current = es

                es.addEventListener("connected", (event) => {
                    const d = JSON.parse((event as MessageEvent).data)
                    console.log("[Frontend] SSE connected:", d)
                    })

                es.addEventListener("step", (event) => {
                    const payload = JSON.parse((event as MessageEvent).data)
                    console.log("[Frontend] SSE step:", payload)

                    // payload.step is the next Step object
                    rawStepsRef.current = [...rawStepsRef.current, payload.step]

                    // normalize whole timeline (simple approach)
                    const normalized = normalizeSteps(rawStepsRef.current)
                    setSteps(normalized)
                })

                es.addEventListener("done", () => {
                    console.log("[Frontend] SSE done")
                    es.close()
                    eventSourceRef.current = null
                })

                es.addEventListener("error", (event) => {
                // NOTE: "error" can also fire on reconnect/network issues,
                // so check if backend actually sent JSON
                try {
                    const payload = JSON.parse((event as MessageEvent).data)
                    console.error("[Frontend] SSE backend error:", payload)
                    alert(payload.error || "Streaming error")
                } catch {
                    console.error("[Frontend] SSE connection error (network/reconnect)")
                }

                es.close()
                eventSourceRef.current = null
                })
                
                
            } catch (err: any) {
                console.error('[Frontend] ========== REQUEST FAILED ==========')
                console.error('[Frontend] Error details:', err)
                console.error('[Frontend] Error message:', err?.message)
                fetchingRef.current = false
                
                // Show error and go back to landing
                alert(`Failed to generate timeline: ${err?.message || 'Unknown error'}`)
                onNewChat()
            }
        }

        fetchTimeline()
        return () => {
            eventSourceRef.current?.close()
            eventSourceRef.current = null
        }
    }, [prompt, onNewChat])
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
                {steps ? (
                    <MainView
                        showGraph={showGraph}
                        showWhiteboard={showWhiteboard}
                        showExplanation={showExplanation}
                        setSubtitle={setSubtitle}
                        steps={steps}
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

