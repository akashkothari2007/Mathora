export type Bounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export function rectsIntersect(a: Bounds, b: Bounds): boolean {
  return !(
    a.maxX < b.minX ||
    a.minX > b.maxX ||
    a.maxY < b.minY ||
    a.minY > b.maxY
  )
}

export function makePointBounds(
  position: { x: number; y: number },
  radius: number
): Bounds {
  const r = radius
  return {
    minX: position.x - r,
    maxX: position.x + r,
    minY: position.y - r,
    maxY: position.y + r,
  }
}

export function makeLabelBounds(
  position: { x: number; y: number },
  width: number,
  height: number
): Bounds {
  // Label2D anchors at left-middle, so treat position as left center.
  const halfH = height / 2
  return {
    minX: position.x,
    maxX: position.x + width,
    minY: position.y - halfH,
    maxY: position.y + halfH,
  }
}

