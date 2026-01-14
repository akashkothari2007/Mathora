"use client"
import * as THREE from "three"
import { Text, Line } from "@react-three/drei"

export type AxesProps = {
  length?: number
}

export default function Axes({ length = 20 }: AxesProps) {
  const axisColor = "rgba(255,255,255,0.4)"
  const labelColor = "rgba(255,255,255,0.6)"
  const labelOffset = 0.5
  
  return (
    <group position={[0, 0, 0.01]}>
      {/* X axis */}
      <Line 
        points={[
          new THREE.Vector3(-length, 0, 0),
          new THREE.Vector3(length, 0, 0)
        ]} 
        color={axisColor}
        lineWidth={2}
        depthTest={false}
      />
      
      {/* Y axis */}
      <Line 
        points={[
          new THREE.Vector3(0, -length, 0),
          new THREE.Vector3(0, length, 0)
        ]} 
        color={axisColor}
        lineWidth={2}
        depthTest={false}
      />

      {/* X axis label */}
      <Text
        position={[length + labelOffset, -0.3, 0]}
        fontSize={0.4}
        color={labelColor}
        anchorX="center"
        anchorY="middle"
      >
        x
      </Text>

      {/* Y axis label */}
      <Text
        position={[-0.3, length + labelOffset, 0]}
        fontSize={0.4}
        color={labelColor}
        anchorX="center"
        anchorY="middle"
      >
        y
      </Text>

      {/* Tick marks and labels every 1 unit */}
      {Array.from({ length: length * 2 + 1 }, (_, i) => i - length).map((x) => {
        if (x === 0) return null // Skip origin
        return (
          <group key={`x-${x}`}>
            {/* X-axis tick mark */}
            <Line
              points={[
                new THREE.Vector3(x, -0.15, 0),
                new THREE.Vector3(x, 0.15, 0)
              ]}
              color={axisColor}
              lineWidth={1}
            />
            {/* X-axis label */}
            <Text
              position={[x, -0.4, 0]}
              fontSize={0.25}
              color={labelColor}
              anchorX="center"
              anchorY="middle"
            >
              {x}
            </Text>
          </group>
        )
      })}

      {Array.from({ length: length * 2 + 1 }, (_, i) => i - length).map((y) => {
        if (y === 0) return null // Skip origin
        return (
          <group key={`y-${y}`}>
            {/* Y-axis tick mark */}
            <Line
              points={[
                new THREE.Vector3(-0.15, y, 0),
                new THREE.Vector3(0.15, y, 0)
              ]}
              color={axisColor}
              lineWidth={1}
            />
            {/* Y-axis label */}
            <Text
              position={[-0.4, y, 0]}
              fontSize={0.25}
              color={labelColor}
              anchorX="center"
              anchorY="middle"
            >
              {y}
            </Text>
          </group>
        )
      })}
    </group>
  )
}