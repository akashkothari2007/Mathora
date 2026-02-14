'use client'

import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import type { CameraTarget } from '../types/cameraTarget'

export type CameraRigProps = {
  cameraTarget: CameraTarget | null
}

// helpers
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

type DragMode = 'rotate' | 'pan' | null

export default function CameraRig({ cameraTarget }: CameraRigProps) {
  const { camera, gl } = useThree()

  const s = useRef({
    // orbit state (current)
    target: new THREE.Vector3(0, 0, 0),
    yaw:  0,
    pitch: 0,
    radius: 10,

    // orbit state (desired)
    dTarget: new THREE.Vector3(0, 0, 0),
    dYaw: 0,
    dPitch: 0,
    dRadius: 10,

    // input
    dragging: false,
    dragMode: null as DragMode,
    lastX: 0,
    lastY: 0,

    // cinematic
    cinematic: false,
  })

  // --- small helper: derive camera basis vectors from orbit yaw/pitch ---
  const getBasis = () => {
    const st = s.current

    const cp = Math.cos(st.dPitch)
    const sp = Math.sin(st.dPitch)
    const cy = Math.cos(st.dYaw)
    const sy = Math.sin(st.dYaw)

    // Direction from camera -> target (forward)
    // camera position offset is (sy*cp, sp, cy*cp) * radius, so forward is negative of that
    const forward = new THREE.Vector3(-sy * cp, -sp, -cy * cp).normalize()

    const worldUp = new THREE.Vector3(0, 1, 0)
    const right = new THREE.Vector3().crossVectors(worldUp, forward).normalize()
    const up = new THREE.Vector3().crossVectors(forward, right).normalize()

    return { forward, right, up }
  }

  // 1) Hook user input (rotate + zoom + pan)
  useEffect(() => {
    const el = gl.domElement

    const onContextMenu = (e: MouseEvent) => {
      // stop the browser right-click menu so panning feels normal
      e.preventDefault()
    }

    const onPointerDown = (e: PointerEvent) => {
      if (s.current.cinematic) return

      s.current.dragging = true
      s.current.lastX = e.clientX
      s.current.lastY = e.clientY

      // Right click OR Shift+Left = pan, otherwise rotate
      const isRight = e.button === 2
      const isShiftPan = e.button === 0 && e.shiftKey
      s.current.dragMode = (isRight || isShiftPan) ? 'pan' : 'rotate'

      el.setPointerCapture(e.pointerId)
    }

    const onPointerUp = (e: PointerEvent) => {
      s.current.dragging = false
      s.current.dragMode = null
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {}
    }

    const onPointerMove = (e: PointerEvent) => {
      if (s.current.cinematic) return
      if (!s.current.dragging) return

      const dx = e.clientX - s.current.lastX
      const dy = e.clientY - s.current.lastY
      s.current.lastX = e.clientX
      s.current.lastY = e.clientY

      const st = s.current

      if (st.dragMode === 'rotate') {
        const rotateSpeed = 0.005
        st.dYaw -= dx * rotateSpeed

        st.dPitch += dy * rotateSpeed
        st.dPitch = clamp(st.dPitch, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05)
        return
      }

      if (st.dragMode === 'pan') {
        // scale pan with distance so it feels consistent
        const panSpeed = st.dRadius * 0.0015

        const { right, up } = getBasis()

        // mouse right -> move target left (so view moves right), mouse down -> move target down
        st.dTarget.addScaledVector(right, dx * panSpeed)
        st.dTarget.addScaledVector(up,  dy * panSpeed)

        // keep current target moving smoothly too (optional but feels nicer)
        // (we already lerp target -> dTarget in useFrame, so this is enough)
        return
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (s.current.cinematic) return
      const zoomSpeed = 0.0015
      s.current.dRadius *= Math.exp(e.deltaY * zoomSpeed)
      s.current.dRadius = clamp(s.current.dRadius, 2, 80)
    }

    el.addEventListener('contextmenu', onContextMenu)
    el.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('wheel', onWheel, { passive: true })

    return () => {
      el.removeEventListener('contextmenu', onContextMenu)
      el.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('wheel', onWheel)
    }
  }, [gl])

  // 2) When a cameraTarget arrives, switch to cinematic by setting desired orbit from its position
// 2) When a cameraTarget arrives, switch to cinematic by setting desired orbit from its position
useEffect(() => {
  if (!cameraTarget) {
    s.current.cinematic = false
    return
  }


  s.current.cinematic = true

  //if we have center or width then its like a 'fit'

  if (cameraTarget.center && (cameraTarget.width || cameraTarget.height)) {
    const [cx, cy, cz] = cameraTarget.center
    s.current.dTarget.set(cx, cy, cz)
    s.current.dYaw = 0
    s.current.dPitch = 0

    const vFov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180)
    const aspect = (camera as THREE.PerspectiveCamera).aspect || 1


    //if ai put h and w both itll pick biggest one
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

    const W = cameraTarget.width;
    const H = cameraTarget.height;

    // distance needed to fit width and height (if provided)
    const distW = W ? ((W+2) / (2 * Math.tan(hFov / 2))) : 0;
    const distH = H ? ((H+2) / (2 * Math.tan(vFov / 2))) : 0;

    // pick the larger (further back) so BOTH fit
    const distance = Math.max(distW, distH);

    s.current.dRadius = clamp(distance, 2, 80);

    return
  }

  if (!cameraTarget.position) {
    s.current.cinematic = false
    return
  }

  const [px, py, pz] = cameraTarget.position

  // NEW: allow custom lookAt, fallback to origin
  const look = cameraTarget.center ?? [0, 0, 0]
  s.current.dTarget.set(look[0], look[1], look[2])

  const pos = new THREE.Vector3(px, py, pz)
  const offset = pos.clone().sub(s.current.dTarget)
  const r = offset.length()

  // guard against r=0 just in case
  if (r < 1e-6) {s.current.cinematic = false; return}

  const yaw = Math.atan2(offset.x, offset.z)
  const pitch = Math.asin(clamp(offset.y / r, -1, 1))

  s.current.dYaw = yaw
  s.current.dPitch = clamp(pitch, -Math.PI / 2 + 0.05, Math.PI / 2 - 0.05)
  s.current.dRadius = clamp(r, 2, 80)
}, [cameraTarget])

  // 3) Per-frame: smooth current -> desired and apply to camera
  useFrame((_, delta) => {
    const st = s.current

    // damping (frame-rate independent)
    const k = 1 - Math.pow(0.001, delta)

    st.yaw += (st.dYaw - st.yaw) * k
    st.pitch += (st.dPitch - st.pitch) * k
    st.radius += (st.dRadius - st.radius) * k
    st.target.lerp(st.dTarget, k)

    const cp = Math.cos(st.pitch)
    const sp = Math.sin(st.pitch)
    const cy = Math.cos(st.yaw)
    const sy = Math.sin(st.yaw)

    const x = st.target.x + st.radius * (sy * cp)
    const y = st.target.y + st.radius * sp
    const z = st.target.z + st.radius * (cy * cp)

    camera.position.set(x, y, z)
    camera.lookAt(st.target)
    camera.updateProjectionMatrix()

    // auto-unlock cinematic once we're close enough to the target position
    if (st.cinematic) {
      const targetClose = st.target.distanceTo(st.dTarget) < 0.01;
      const radiusClose = Math.abs(st.radius - st.dRadius) < 0.02;
      const yawClose = Math.abs(st.yaw - st.dYaw) < 0.01;
      const pitchClose = Math.abs(st.pitch - st.dPitch) < 0.01;
    
      if (targetClose && radiusClose && yawClose && pitchClose) {
        st.cinematic = false;
      }
    }
  })

  return null
}