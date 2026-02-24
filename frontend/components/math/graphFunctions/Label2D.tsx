
// 'use client'

// import { Text, Billboard, useFont} from '@react-three/drei'
// import {useState} from 'react'
// import {useFrame} from '@react-three/fiber'


// export type Label2DProps = {
//     text: string
//     position: {x: number, y: number}
//     color?: string
//     fontSize?: number
// }

// export default function Label2D({text, position, color = 'white', fontSize = 0.3}: Label2DProps) {
//     const labelOffset = 0.3
//     const fadeSpeed = 1
//     const [opacity, setOpacity] = useState(0)
//     useFrame((_, delta) => {
//         setOpacity(prev => Math.min(prev+delta*fadeSpeed, 1))
//     })
//     return (    
//         <Billboard position={[position.x, position.y, 0]}>
//         <Text
//         font="/fonts/Handlee-Regular.ttf"
//         position={[labelOffset,labelOffset,0]}
//         fontSize={fontSize}
//         color={color}
//         fillOpacity={opacity}
//         anchorX="left"
//         anchorY="middle"
//         >
//         {text}
//         </Text>
//         </Billboard>
//     )
// }




'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Billboard } from '@react-three/drei'
import opentype, { Font } from 'opentype.js'
import { AttentionState } from '../types/attentionStates'

export type Label2DProps = {
    text: string
    position: { x: number, y: number }
    color?: string
    fontSize?: number
    attentionState?: AttentionState
}

const LAG_RATIO = 0.055
const CHAR_DURATION = 1.4
const JITTER = 0.06
const CANVAS_HEIGHT = 128
const FONT_PX = 90



function smooth(t: number, inflection = 10.0): number {
    const error = 1 / (1 + Math.exp(inflection / 2))
    const val = (1 / (1 + Math.exp(-inflection * (t - 0.5))) - error) / (1 - 2 * error)
    return Math.max(0, Math.min(1, val))
}

function doubleSmoothStroke(t: number): number {
    if (t < 0.5) return smooth(2 * t)
    return 1
}

function doubleSmoothFill(t: number): number {
    if (t < 0.5) return 0
    return smooth(2 * t - 1)
}

function pseudoRandom(seed: number): number {
    const x = Math.sin(seed + 1) * 43758.5453123
    return x - Math.floor(x)
}

function opentypePathToSVGString(path: opentype.Path): string {
    return path.commands.map(cmd => {
        switch (cmd.type) {
            case 'M': return `M ${cmd.x} ${cmd.y}`
            case 'L': return `L ${cmd.x} ${cmd.y}`
            case 'C': return `C ${cmd.x1} ${cmd.y1} ${cmd.x2} ${cmd.y2} ${cmd.x} ${cmd.y}`
            case 'Q': return `Q ${cmd.x1} ${cmd.y1} ${cmd.x} ${cmd.y}`
            case 'Z': return 'Z'
            default: return ''
        }
    }).join(' ')
}

function getPathLength(svgPathString: string): number {
    const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathEl.setAttribute('d', svgPathString)
    svgEl.appendChild(pathEl)
    document.body.appendChild(svgEl)
    const length = pathEl.getTotalLength()
    document.body.removeChild(svgEl)
    return length
}

function opentypePathToPath2D(path: opentype.Path): Path2D {
    const p = new Path2D()
    for (const cmd of path.commands) {
        switch (cmd.type) {
            case 'M': p.moveTo(cmd.x, cmd.y); break
            case 'L': p.lineTo(cmd.x, cmd.y); break
            case 'C': p.bezierCurveTo(cmd.x1!, cmd.y1!, cmd.x2!, cmd.y2!, cmd.x, cmd.y); break
            case 'Q': p.quadraticCurveTo(cmd.x1!, cmd.y1!, cmd.x, cmd.y); break
            case 'Z': p.closePath(); break
        }
    }
    return p
}

let fontCache: Font | null = null
let fallbackFontCache: Font | null = null
let fontLoading = false
const fontCallbacks: Array<(primary: Font, fallback: Font) => void> = []

const FALLBACK_FONT_URL = 'https://cdn.jsdelivr.net/npm/dejavu-fonts-ttf@2.37.3/ttf/DejaVuSans.ttf'

function isMissingGlyph(font: Font, char: string): boolean {
    try {
        const glyph = font.charToGlyph(char)
        const code = char.charCodeAt(0)
        if (glyph.name === '.notdef') return true
        if (glyph.unicode != null && glyph.unicode !== code) return true
        return false
    } catch {
        return true
    }
}

function loadFont(cb: (primary: Font, fallback: Font) => void) {
    if (fontCache && fallbackFontCache) {
        cb(fontCache, fallbackFontCache)
        return
    }
    fontCallbacks.push(cb)
    if (fontLoading) return
    fontLoading = true

    const onBothLoaded = () => {
        if (fontCache && fallbackFontCache) {
            fontCallbacks.forEach(fn => fn(fontCache!, fallbackFontCache!))
            fontCallbacks.length = 0
        }
    }

    opentype.load('/fonts/cmunrm.ttf', (err, font) => {
        if (err || !font) {
            console.warn('Primary font (cmunrm) load failed, using fallback only', err)
        } else {
            fontCache = font
        }
        if (fontCache && fallbackFontCache) onBothLoaded()
    })

    opentype.load(FALLBACK_FONT_URL, (err, font) => {
        if (err || !font) {
            console.error('Fallback font (DejaVu Sans) load failed', err)
            fontLoading = false
            return
        }
        fallbackFontCache = font
        if (!fontCache) fontCache = font
        if (fontCache && fallbackFontCache) onBothLoaded()
    })
}

interface CharData {
    path2D: Path2D
    pathLength: number
    jitter: number
}

export function estimateLabelSize(text: string, fontSize?: number) {
    const fs = fontSize ?? 0.38
    const height = fs
    const approxPerChar = 0.38 * fs
    const width = Math.max(fs * 0.6, text.length * approxPerChar)
    return { width, height }
}

export default function Label2D({ text, position, color = 'white', fontSize = 0.38 }: Label2DProps) {
    const startTime = useRef<number | null>(null)
    const prevText = useRef('')
    const [charData, setCharData] = useState<CharData[] | null>(null)
    const [totalWidth, setTotalWidth] = useState(1)
    const canvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))

    useEffect(() => {
        loadFont((primary, fallback) => {
            const chars = text.split('')
            const data: CharData[] = []
            let cursorX = 0
            const baseline = CANVAS_HEIGHT * 0.75

            chars.forEach((char, i) => {
                const font = isMissingGlyph(primary, char) ? fallback : primary
                const scale = FONT_PX / font.unitsPerEm

                if (char === ' ') {
                    const spaceGlyph = font.charToGlyph(' ')
                    cursorX += (spaceGlyph.advanceWidth || 500) * scale
                    return
                }

                const path = font.getPath(char, cursorX, baseline, FONT_PX)
                const svgString = opentypePathToSVGString(path)
                const pathLength = svgString.length > 10 ? getPathLength(svgString) : 0
                const path2D = opentypePathToPath2D(path)
                const glyph = font.charToGlyph(char)
                const advance = (glyph.advanceWidth || 500) * scale

                data.push({
                    path2D,
                    pathLength,
                    jitter: (pseudoRandom(i * 11 + text.length * 7) - 0.5) * JITTER,
                })

                cursorX += advance
            })

            canvasRef.current.width = Math.ceil(cursorX) + 16
            canvasRef.current.height = CANVAS_HEIGHT
            setTotalWidth(cursorX)
            setCharData(data)
            startTime.current = null
        })
    }, [text])

    const texture = useMemo(() => new THREE.CanvasTexture(canvasRef.current), [])
    useEffect(() => () => texture.dispose(), [texture])

    // Match sizing to old drei Text behavior:
    // fontSize is world units for the cap height, so we scale the plane accordingly
    const scale = fontSize
    const planeWidth = (totalWidth / CANVAS_HEIGHT) * scale  
    const planeHeight = scale

    useFrame((state) => {
        if (!charData) return
        const now = state.clock.getElapsedTime()

        if (prevText.current !== text) {
            prevText.current = text
            startTime.current = now
        }
        if (startTime.current === null) startTime.current = now

        const elapsed = now - startTime.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')!

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        charData.forEach((cd, i) => {
            const charStart = i * LAG_RATIO * CHAR_DURATION + cd.jitter
            const localT = Math.max(0, Math.min(1, (elapsed - charStart) / CHAR_DURATION))

            const strokeProgress = doubleSmoothStroke(localT)
            const fillProgress = doubleSmoothFill(localT)

            if (strokeProgress > 0.001 && cd.pathLength > 0) {
                ctx.save()
                ctx.strokeStyle = color
                ctx.lineWidth = 2.5
                ctx.lineJoin = 'round'
                ctx.lineCap = 'round'
                const offset = cd.pathLength * (1 - strokeProgress)
                ctx.setLineDash([cd.pathLength])
                ctx.lineDashOffset = offset
                ctx.stroke(cd.path2D)
                ctx.restore()
            }

            if (fillProgress > 0.001) {
                ctx.save()
                ctx.globalAlpha = fillProgress
                ctx.fillStyle = color
                ctx.fill(cd.path2D)
                ctx.restore()
            }
        })

        texture.needsUpdate = true
    })

    if (!charData) return null

    return (
        <Billboard position={[position.x + planeWidth / 2, position.y, 0]}>
            <mesh>
                <planeGeometry args={[planeWidth, planeHeight]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </Billboard>
    )
}