"use client"

import * as THREE from "three"
import { Line, Text } from "@react-three/drei"

export type UnitCircleProps = {
  labels?: boolean
  units?: "degrees" | "radians"
}

const RADIUS = 1
const CIRCLE_OPACITY = 0.28
const CIRCLE_COLOR = "#ffffff"
const LABEL_COLOR = "rgba(255,255,255,0.75)"
const TICK_LENGTH = 0.18

const BASE_ANGLES = [30, 45, 60]

const ALL_ANGLES: number[] = Array.from(
  new Set(
    BASE_ANGLES.flatMap((base) => [
      base,
      180 - base,
      180 + base,
      360 - base,
    ])
  )
).sort((a, b) => a - b)

function degreeToRadianLabel(deg: number): string {
  switch (deg) {
    case 30:
      return "π/6"
    case 45:
      return "π/4"
    case 60:
      return "π/3"
    case 120:
      return "2π/3"
    case 135:
      return "3π/4"
    case 150:
      return "5π/6"
    case 210:
      return "7π/6"
    case 225:
      return "5π/4"
    case 240:
      return "4π/3"
    case 300:
      return "5π/3"
    case 315:
      return "7π/4"
    case 330:
      return "11π/6"
    default:
      return `${deg}°`
  }
}

export default function UnitCircle({ labels = false, units = "degrees" }: UnitCircleProps) {
  const curve = new THREE.EllipseCurve(0, 0, RADIUS, RADIUS, 0, 2 * Math.PI, false, 0)
  const circlePoints = curve.getPoints(128).map((p) => new THREE.Vector3(p.x, p.y, 0.005))

  const lineProps = {
    color: CIRCLE_COLOR,
    transparent: true,
    opacity: CIRCLE_OPACITY,
    depthTest: false,
  }

  return (
    <group position={[0, 0, 0.01]}>
      {/* Faded unit circle */}
      <Line points={circlePoints} lineWidth={1.5} {...lineProps} />

      {/* Radial rays at canonical angles (30, 45, 60 and mirrors) */}
      {ALL_ANGLES.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const inner = RADIUS
        const outer = RADIUS + TICK_LENGTH
        const ix = inner * Math.cos(rad)
        const iy = inner * Math.sin(rad)
        const ox = outer * Math.cos(rad)
        const oy = outer * Math.sin(rad)

        return (
          <Line
            key={`ray-${deg}`}
            points={[
              new THREE.Vector3(ix, iy, 0.005),
              new THREE.Vector3(ox, oy, 0.005),
            ]}
            lineWidth={1}
            {...lineProps}
          />
        )
      })}

      {/* Angle labels slightly outside the circle, only at non-axis angles */}
      {labels &&
        ALL_ANGLES.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const labelRadius = RADIUS + TICK_LENGTH + 0.1
          const x = labelRadius * Math.cos(rad)
          const y = labelRadius * Math.sin(rad)

          const text =
            units === "radians" ? degreeToRadianLabel(deg) : `${deg}°`

          return (
            <Text
              key={`label-${deg}`}
              position={[x, y, 0.02]}
              fontSize={0.16}
              color={LABEL_COLOR}
              anchorX="center"
              anchorY="middle"
            >
              {text}
            </Text>
          )
        })}
    </group>
  )
}
