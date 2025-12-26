"use client"
import { Grid as DreiGrid } from "@react-three/drei"

export type GridProps = {
  size?: number
}

export default function Grid({ size = 20 }: GridProps) {
  return (
    <DreiGrid
      args={[size * 2, size * 2]}
      cellSize={1}
      cellThickness={0.4}
      cellColor="#2a2a2a"
      sectionSize={5}
      sectionThickness={0.8}
      sectionColor="#3a3a3a"
      infiniteGrid
      fadeDistance={size * 2}
      fadeStrength={1.5}
    />
  )
}