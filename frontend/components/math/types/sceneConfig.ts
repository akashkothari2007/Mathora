// Public, AI-facing scene config shape used in steps and outline.

export type AxesOptions = {
  /** Whether to show axis labels and tick labels (default true). */
  labels?: boolean
  /** Spacing between tick marks / numeric labels (default 1). */
  tickSpacing?: number
}

export type UnitCircleOptions = {
  /** Whether to show angle labels on the unit circle rays (default false). */
  labels?: boolean
  /** Units for angle labels on the unit circle (default 'degrees'). */
  units?: "degrees" | "radians"
}

export type SceneConfig = {
  mode: "axes" | "unitCircle"
  axes?: AxesOptions
  unitCircle?: UnitCircleOptions
}

export const DEFAULT_SCENE_CONFIG: SceneConfig = {
  mode: "axes",
  axes: {
    labels: true,
    tickSpacing: 1,
  },
}

