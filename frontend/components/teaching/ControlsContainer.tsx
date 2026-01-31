import { useState } from 'react'

type Props = {
    setStepIndex: React.Dispatch<React.SetStateAction<number>>
    reset: () => void
    stepIndex: number
    availableSteps: number
    totalSteps: number
}

export default function ControlsContainer({setStepIndex, reset, stepIndex, availableSteps, totalSteps}: Props) {
    const [showInfo, setShowInfo] = useState(false)

    const canGoNext = stepIndex < availableSteps - 1
    const canGoPrev = stepIndex > 0
    const isStreaming = availableSteps < totalSteps

    const currentPercent = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0
    const availablePercent = totalSteps > 0 ? (availableSteps / totalSteps) * 100 : 0

    // Shared disabled style
    const disabledClass = "opacity-40 cursor-not-allowed pointer-events-none"

    return (
        <div className="absolute top-16 left-3 z-50 w-[calc(100%-1.5rem)] max-w-xs sm:max-w-sm">
            {/* Main glass card */}
            <div className="bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/[0.08] shadow-2xl shadow-black/40 overflow-hidden">
                
                {/* Top row: step indicator + streaming badge */}
                <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <span className="text-white/90 text-xs sm:text-sm font-medium tabular-nums">
                            {stepIndex + 1}
                            <span className="text-white/30 mx-1">/</span>
                            {totalSteps}
                        </span>
                    </div>
                    
                    {isStreaming && (
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                            <span className="text-emerald-400/80 text-[10px] sm:text-xs font-medium">
                                {availableSteps} loaded
                            </span>
                        </div>
                    )}
                </div>

                {/* Progress track */}
                <div className="px-3 py-2.5 sm:px-4 sm:py-3">
                    <div 
                        className="relative h-1.5 sm:h-2 rounded-full bg-white/[0.08] cursor-pointer group"
                        onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const percent = (e.clientX - rect.left) / rect.width
                            const newStep = Math.round(percent * (totalSteps - 1))
                            if (newStep < availableSteps) {
                                setStepIndex(newStep)
                            }
                        }}
                    >
                        {/* Buffered (available) */}
                        <div 
                            className="absolute inset-y-0 left-0 bg-white/10 rounded-full transition-all duration-500"
                            style={{ width: `${availablePercent}%` }}
                        />
                        
                        {/* Current progress */}
                        <div 
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-200"
                            style={{ width: `${currentPercent}%` }}
                        />

                        {/* Thumb */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-lg shadow-black/50 transition-all duration-200 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
                            style={{ left: `${currentPercent}%` }}
                        />
                    </div>
                </div>

                {/* Controls row */}
                <div className="flex items-center gap-1.5 px-2 pb-2 sm:px-3 sm:pb-3 sm:gap-2">
                    {/* Prev */}
                    <button
                        onClick={() => canGoPrev && setStepIndex((s) => s - 1)}
                        disabled={!canGoPrev}
                        className={`flex-1 flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all
                            ${canGoPrev 
                                ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white/70 hover:text-white active:scale-[0.97]' 
                                : disabledClass + ' bg-white/[0.03] text-white/30'}`}
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="hidden sm:inline">Prev</span>
                    </button>

                    {/* Next */}
                    <button
                        onClick={() => canGoNext && setStepIndex((s) => s + 1)}
                        disabled={!canGoNext}
                        className={`flex-[2] flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all
                            ${canGoNext 
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 active:scale-[0.97]' 
                                : disabledClass + ' bg-white/[0.05] text-white/30'}`}
                    >
                        <span>Next</span>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Restart (icon only) */}
                    <button
                        onClick={reset}
                        className="p-2 sm:p-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white/50 hover:text-white transition-all active:scale-[0.95]"
                        title="Restart"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>

                    {/* Info toggle */}
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className={`p-2 sm:p-2.5 rounded-xl transition-all active:scale-[0.95]
                            ${showInfo 
                                ? 'bg-white/[0.1] text-white/80' 
                                : 'bg-white/[0.06] hover:bg-white/[0.1] text-white/30 hover:text-white/60'}`}
                        title="Info"
                    >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>

                {/* Collapsible legend */}
                <div className={`grid transition-all duration-200 ease-out ${showInfo ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="flex items-center justify-center gap-4 px-3 py-2 border-t border-white/[0.06] text-[10px] text-white/40">
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                                progress
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-white/10" />
                                buffered
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-white/[0.06]" />
                                pending
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}