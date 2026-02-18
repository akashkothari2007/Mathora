import { Action } from "./actions"
import { CameraTarget } from "./cameraTarget"

export type Step = {
    subtitle?: string
    speakSubtitle?: string
    pauseDuration?: "short" | "medium" | "long"
    actions?: Action[]
    cameraTarget?: CameraTarget | null
    whiteboardLines?: string[]
    timeToAdvance?: number
}