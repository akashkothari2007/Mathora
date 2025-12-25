//action types for the timeline
//has a type, id, time, subtitle and any other props for each type of action
//see scene.ts for the types of objects that can be added to the scene
import { SceneObject } from './scene'

export type Action =
  | {
    type: 'add'
    object: SceneObject
    time: number
    subtitle: string
  }
  | {
    type: 'remove'
    id: string
    time: number
    subtitle: string
  }
  | {
    type: 'update'
    id: string
    props: any
    time: number
    subtitle:string
  }
  | {
    type: 'wait'
    time: number
    subtitle: string
  }
