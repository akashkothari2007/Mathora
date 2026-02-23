"use client"
import * as THREE from "three"
import { Text, Line } from "@react-three/drei"

export type AxesProps = {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  labels: boolean
  tickMarks: boolean
  tickSpacing: number
  color?: string
}

export default function Axes({ xMin, xMax, yMin, yMax, labels, tickMarks, tickSpacing, color }: AxesProps) {
  const axisColor = color ?? "rgba(255,255,255,0.4)"
  const labelColor = color ?? "rgba(255,255,255,0.6)"
  const labelOffset = 0.5

  return (
    <group position={[0, 0, 0.01]}>
      {/* X axis */}
      <Line
        points={[
          new THREE.Vector3(xMin, 0, 0),
          new THREE.Vector3(xMax, 0, 0),
        ]}
        color={axisColor}
        lineWidth={2}
        depthTest={false}
      />

      {/* Y axis */}
      <Line
        points={[
          new THREE.Vector3(0, yMin, 0),
          new THREE.Vector3(0, yMax, 0),
        ]}
        color={axisColor}
        lineWidth={2}
        depthTest={false}
      />

      {labels && (
        <>
          <Text
            position={[xMax + labelOffset, -0.3, 0]}
            fontSize={0.4}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
          >
            x
          </Text>
          <Text
            position={[-0.3, yMax + labelOffset, 0]}
            fontSize={0.4}
            color={labelColor}
            anchorX="center"
            anchorY="middle"
          >
            y
          </Text>
        </>
      )}

      {/* X-axis tick marks and numeric labels at tickSpacing */}
      {tickMarks &&
        (() => {
          const ticks: number[] = []
          for (let x = Math.ceil(xMin / tickSpacing) * tickSpacing; x <= xMax; x += tickSpacing) {
            if (Math.abs(x) < 1e-9) continue
            ticks.push(x)
          }
          return ticks.map((x) => (
            <group key={`x-${x}`}>
              <Line
                points={[
                  new THREE.Vector3(x, -0.15, 0),
                  new THREE.Vector3(x, 0.15, 0),
                ]}
                color={axisColor}
                lineWidth={1}
              />
              {labels && (
                <Text
                  position={[x, -0.4, 0]}
                  fontSize={0.25}
                  color={labelColor}
                  anchorX="center"
                  anchorY="middle"
                >
                  {Number.isInteger(x) ? x : x.toFixed(1)}
                </Text>
              )}
            </group>
          ))
        })()}

      {/* Y-axis tick marks and numeric labels at tickSpacing */}
      {tickMarks &&
        (() => {
          const ticks: number[] = []
          for (let y = Math.ceil(yMin / tickSpacing) * tickSpacing; y <= yMax; y += tickSpacing) {
            if (Math.abs(y) < 1e-9) continue
            ticks.push(y)
          }
          return ticks.map((y) => (
            <group key={`y-${y}`}>
              <Line
                points={[
                  new THREE.Vector3(-0.15, y, 0),
                  new THREE.Vector3(0.15, y, 0),
                ]}
                color={axisColor}
                lineWidth={1}
              />
              {labels && (
                <Text
                  position={[-0.4, y, 0]}
                  fontSize={0.25}
                  color={labelColor}
                  anchorX="center"
                  anchorY="middle"
                >
                  {Number.isInteger(y) ? y : y.toFixed(1)}
                </Text>
              )}
            </group>
          ))
        })()}
    </group>
  )
}
