import { Action } from '../types/actions'
import { SceneObject } from '../types/scene'
//fake timeline for testing
export const demoTimeline: Action[] = [
  {
    type: 'add',
    object: {
        id: 'f1',
        type: 'function',
        props: {
            f: (x: number) => Math.sin(x),
            xmin: -2*Math.PI,
            xmax: 2*Math.PI,
            color: 'cyan',
            lineWidth: 2,
        }
    },
    time: 4,
    subtitle: 'Here is the graph of the function y = sin(x)',
  },
  {
    type: 'add',
    object: {
        id: 'p1',
        type: 'point',
        props: {
            position: {x: Math.PI/2, y: 1},
            size: 0.1,
            color: 'orange',
        }
    },
    time: 2,
    subtitle: 'Here is the point (π/2,1)',
  },
  {
    type: 'add',
    object: {
        id: 'l1',
        type: 'label',
        props: {
            text: '(π/2,1)',
            position: {x: Math.PI/2, y: 1},
        }
    },
    time: 2,
    subtitle: 'Here is the label (π/2,1)',
  },
  {
    type: 'update',
    id: 'p1',
    props: {
      position: {x: Math.PI/2, y: 1},
      animateTo: {x: Math.PI, y: 0},
      animateDuration: 2,
    },
    time: 4,
    subtitle: 'Updating the point to (π,0)',
  },
  {
    type: 'wait',
    time: 2,
    subtitle: '',
  },
  {
    type: 'remove',
    id: 'l1',
    time: 2,
    subtitle: 'removing the label ',
  },
]