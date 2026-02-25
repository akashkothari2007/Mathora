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
      cellThickness={0.5}
      cellColor="#333333"
      sectionSize={5}
      sectionThickness={1}
      sectionColor="#404040"
      infiniteGrid
      fadeDistance={size * 2}
      fadeStrength={1.2}
    />
  )
}