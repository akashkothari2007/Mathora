
type Props = {
    onNewChat: () => void
    toggleSidebar: () => void
    toggleGraph: () => void
    toggleWhiteboard: () => void
    toggleExplanation: () => void
}
//props is that the function takes in, and it calls them and 
//all these functions take no parameters and return void

export default function TopBar({onNewChat, toggleSidebar, toggleGraph, toggleWhiteboard, toggleExplanation}: Props) {
    return (
        <div className = "h-12 flex items-center gap-2 px-4 border-b border-neutral-800 bg-neutral-900">
            <button 
                onClick = {() => toggleSidebar()}
                className = "px-3 py-1.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 ease-in-out hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            >
            ☰
            </button>
            <button 
                onClick = {toggleGraph}
                className = "px-4 py-1.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 ease-in-out hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            >
                Graph
            </button>
            <button 
                onClick = {toggleWhiteboard}
                className = "px-4 py-1.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 ease-in-out hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            >
                Whiteboard
            </button>
            <button 
                onClick = {toggleExplanation}
                className = "px-4 py-1.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-neutral-800 transition-all duration-200 ease-in-out hover:shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            >
                Explanation
            </button>

            <div className = "ml-auto">
                <button 
                    onClick = {onNewChat} 
                    className = "px-4 py-1.5 rounded-full text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all duration-200 ease-in-out hover:shadow-[0_0_8px_rgba(239,68,68,0.2)]"
                >
                    New Chat
                </button>
            </div>
            
        </div>
    )
}

//functions with no parameter:
//toggleSidebar is same as () => toggleSidebar()
