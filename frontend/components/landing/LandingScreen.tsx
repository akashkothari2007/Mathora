import { useState } from 'react' //persistent memory for a component
//react re renders the component when state changes and passes the new state to the component
//so it remembers the value of the input

type Props = {
    onSubmit: (prompt: string) => void //shape of function
    //takes a string returns void
}

export default function LandingScreen({onSubmit}: Props) {
    const [input, setInput] = useState('') //useState just returns ["", function setInput]
    return (
        <div className = "h-full flex flex-col items-center justify-center gap-8 px-4">
            <div className="flex flex-col items-center gap-3">
                <h1 className = "text-7xl font-semibold tracking-tight bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">Mathora</h1>
                <p className = "text-neutral-400 text-lg">Explain math visually.</p>
            </div>
            
            <div className="flex flex-col items-center gap-4 w-full max-w-[500px]">
                <input
                    value = {input}
                    onChange = {(e) => setInput(e.target.value)} //event handler for inputs built into react 
                    //E IS EVENT REACT CALLS onChange(e) with the event object 
                    placeholder = "What do you want to learn today..."
                    className = "w-full px-5 py-3.5 text-base rounded-xl bg-neutral-900/50 border border-neutral-800/50 focus:outline-none focus:border-neutral-700 focus:bg-neutral-900 focus:ring-2 focus:ring-neutral-800/50 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-all duration-200 text-neutral-200 placeholder:text-neutral-600"
                />
                <button
                    onClick = {() => onSubmit(input)} //anotha one event handler
                    className = "px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all duration-200 ease-in-out hover:shadow-[0_4px_12px_rgba(37,99,235,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                    Start
                </button>
            </div>
        </div>

    )
}

//each div or button or input has 
//type="div", props={className: "whatever"}, children = idk h1 or input or button