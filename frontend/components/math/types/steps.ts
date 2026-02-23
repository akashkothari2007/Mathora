import { Action } from "./actions"
import { CameraTarget } from "./cameraTarget"
import type { SceneConfig } from "./sceneConfig"

export type Step = {
    subtitle?: string
    speakSubtitle?: string
    pauseDuration?: "short" | "medium" | "long"
    actions?: Action[]
    cameraTarget?: CameraTarget | null
    whiteboardLines?: string[]
    timeToAdvance?: number
    sceneConfig?: SceneConfig
}