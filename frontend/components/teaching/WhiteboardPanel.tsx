'use client'

import 'katex/dist/katex.min.css'
import katex from 'katex'
import { useMemo } from 'react'

type Props = {
  whiteboardLines: string[]
}

export default function WhiteboardPanel({ whiteboardLines }: Props) {


  const htmlLines = useMemo(() => {
    return whiteboardLines.map((latex) =>
      katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      })
    )
  }, [whiteboardLines])

  return (
    <div className="relative w-full h-full bg-neutral-950 p-6">
      <div className="mb-4 text-neutral-200 text-sm font-semibold tracking-wide">
        Whiteboard
      </div>

      <div className="space-y-3 text-white">
        {htmlLines.map((html, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: html }} />
        ))}
      </div>

      {/* Konva overlay goes here later (absolute, pointer-events-none) */}
    </div>
  )
}