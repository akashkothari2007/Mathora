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
    /** 0-based character index in subtitle where each whiteboard line should appear (same order as whiteboardLines). */
    whiteboardAtIndices?: number[]
    timeToAdvance?: number
    sceneConfig?: SceneConfig
}