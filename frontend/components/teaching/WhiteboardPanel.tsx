'use client'

import 'katex/dist/katex.min.css'
import katex from 'katex'
import { useMemo, useEffect, useState } from 'react'

type Props = {
  whiteboardLines: string[]
}

function FadeInLine({ html }: { html: string }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(t)
  }, [])
  return (
    <div
      className="text-white transition-opacity duration-500 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
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

      <div className="space-y-3">
        {htmlLines.map((html, i) => {
          const isNewLine = i === htmlLines.length - 1
          return (
            <div
              key={i}
              className={
                isNewLine
                  ? undefined
                  : 'text-neutral-500 transition-colors duration-300'
              }
            >
              {isNewLine ? (
                <FadeInLine html={html} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Konva overlay goes here later (absolute, pointer-events-none) */}
    </div>
  )
}