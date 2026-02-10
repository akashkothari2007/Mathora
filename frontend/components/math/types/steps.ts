import { Action } from "./actions"
import { CameraTarget } from "./cameraTarget"

export type Step = {
    subtitle?: string
    actions?: Action[]
    cameraTarget?: CameraTarget | null
    whiteboardLines?: string[]
    timeToAdvance?: number
}