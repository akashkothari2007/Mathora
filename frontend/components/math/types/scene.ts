import { FunctionPlotProps } from "../core functions/FunctionPlot"
import { Point2DProps } from "../core functions/Point2D"
import { Label2DProps } from "../core functions/Label2D"
import { ShadeAreaProps } from "../core functions/ShadeArea"

//types of objects for the graph for properties see core functions

export type SceneObject = 
| {
    id: string
    type: 'function'
    props: FunctionPlotProps
}
| {
    id: string
    type: 'point'
    props: Point2DProps
}
| {
    id: string
    type: 'label'
    props: Label2DProps
}
| {
    id: string
    type: 'area'
    props: ShadeAreaProps
}
