//GENERIC PANEL COMPONENT

type Props = {
    title: string
}
export default function Panel({title}: Props) {
    return (
        <div className="h-full flex flex-col bg-neutral-950/50">
      <div className="h-10 px-4 flex items-center border-b border-neutral-800/50 text-sm font-medium text-neutral-200 bg-neutral-900/30">
        {title}
      </div>
      <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
        {title} placeholder
      </div>
    </div>
    )
}