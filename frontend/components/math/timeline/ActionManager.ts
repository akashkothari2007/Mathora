import {GraphObject} from '../types/graphObject'
import { AttentionState } from '../types/attentionStates'

type ApplyAttentionArgs = {
    objects: GraphObject[]
    addedIds?: string[]
    updatedIds?: string[]
}

export function applyAttention({
    objects,
    addedIds = [],
    updatedIds = [],
}: ApplyAttentionArgs): GraphObject[] {
    const highlightState = "highlighted"
    const dimmedState = "dimmed"

    const focus = new Set<string>([...addedIds, ...updatedIds]);
    return objects.map((obj) => ({
        ...obj,
        props: {
          ...obj.props,
          attentionState: focus.has(obj.id) ? highlightState : dimmedState,
        },
      })) as GraphObject[];
}