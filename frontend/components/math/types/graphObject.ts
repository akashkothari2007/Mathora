import { FunctionPlotProps } from "../graphFunctions/FunctionPlot"
import { Point2DProps } from "../graphFunctions/Point2D"
import { Label2DProps } from "../graphFunctions/Label2D"
import { ShadeAreaProps } from "../graphFunctions/ShadeArea"
import { SlidingTangentProps } from "../graphFunctions/slidingTangent"
import { Line2DProps } from "../graphFunctions/Line2D"
import { SecantLineProps } from "../graphFunctions/SecantLine"

//types of objects for the graph for properties see core functions

export type GraphObject =
  | {
      id: string
      type: "function"
      props: FunctionPlotProps
    }
  | {
      id: string
      type: "point"
      props: Point2DProps
    }
  | {
      id: string
      type: "label"
      props: Label2DProps
    }
  | {
      id: string
      type: "area"
      props: ShadeAreaProps
    }
  | {
      id: string
      type: "slidingTangent"
      props: SlidingTangentProps
    }
  | {
      id: string
      type: "line"
      props: Line2DProps
    }
  | {
      id: string
      type: "secantLine"
      props: SecantLineProps
    }