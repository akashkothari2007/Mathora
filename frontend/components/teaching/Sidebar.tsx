export default function Sidebar() {
    return (
      <div className="w-72 bg-neutral-900 border-r border-neutral-800/50 flex flex-col">
        {/* Header */}
        <div className="h-12 px-4 flex items-center border-b border-neutral-800/50">
          <span className="text-sm font-medium text-neutral-200 tracking-wide">History</span>
        </div>
  
        {/* Previous chats */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-2 mb-1">Previous</div>
  
          {/* Placeholder items */}
          <button className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all duration-150 ease-in-out border border-transparent hover:border-neutral-700/50">
            y = x² — basics
          </button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all duration-150 ease-in-out border border-transparent hover:border-neutral-700/50">
            Integrals — area under curve
          </button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all duration-150 ease-in-out border border-transparent hover:border-neutral-700/50">
            Gradients — descent intuition
          </button>
        </div>
  
        {/* Settings */}
        <div className="border-t border-neutral-800/50 p-4">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider px-2 mb-2">Settings</div>
  
          <button className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all duration-150 ease-in-out border border-transparent hover:border-neutral-700/50">
            Voice: Off (placeholder)
          </button>
          <button className="w-full text-left px-3 py-2.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 text-sm text-neutral-300 hover:text-white transition-all duration-150 ease-in-out border border-transparent hover:border-neutral-700/50 mt-2">
            Theme: Dark (placeholder)
          </button>
        </div>
      </div>
    )
  }