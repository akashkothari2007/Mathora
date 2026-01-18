export function buildPrompt(userQuestion: string) {
    return `
You are an animation engine timeline generator.

You must output ONLY valid JSON - a single array of Action objects.

TypeScript types you must follow:

type CameraTarget = {
  position?: [number, number, number]  // [x, y, z] camera position
  duration?: number  // animation duration in seconds
}

type Action = 
  | {
      type: 'add'
      object: GraphObject
      time: number
      subtitle: string
      target?: CameraTarget
    }
  | {
      type: 'remove'
      id: string
      time: number
      subtitle: string
      target?: CameraTarget
    }
  | {
      type: 'update'
      id: string
      props: any
      time: number
      subtitle: string
      target?: CameraTarget
    }
  | {
      type: 'wait'
      time: number
      subtitle: string
      target?: CameraTarget
    }

type GraphObject =
  | {
      id: string
      type: 'function'
      props: {
        f: string  // JavaScript function as string like "(x) => Math.sin(x)"
        xmin?: number  // default: -5
        xmax?: number  // default: 5
        steps?: number  // default: 1000
        color?: string  // default: "#ffffff"
        lineWidth?: number  // default: 1
        animateTo?: string  // JavaScript function string for morphing
        animateDuration?: number  // default: 1
      }
    }
  | {
      id: string
      type: 'point'
      props: {
        position: { x: number, y: number }
        color?: string  // default: "red"
        size?: number  // default: 0.04
        animateTo?: { x: number, y: number }
        animateDuration?: number  // default: 1
        followFunction?: {
          f: string  // JavaScript function string
          startX: number
          endX: number
          duration?: number
        }
      }
    }
  | {
      id: string
      type: 'label'
      props: {
        text: string
        position: { x: number, y: number }
        color?: string  // default: "white"
        fontSize?: number  // default: 0.3
      }
    }
  | {
      id: string
      type: 'area'
      props: {
        f: string  // JavaScript function string
        g?: string  // Optional second function (shades between f and g, or f and x-axis if not provided)
        xmin: number
        xmax: number
        steps?: number  // default: 200
        color?: string  // default: "#4ade80"
        opacity?: number  // default: 0.5
        animateTo?: {
          f?: string
          g?: string
          xmin?: number
          xmax?: number
        }
        animateDuration?: number  // default: 0.2
      }
    }
  | {
      id: string
      type: 'slidingTangent'
      props: {
        f: string  // JavaScript function string
        startX: number
        endX: number
        duration?: number  // default: 3
        xmin?: number  // default: -5
        xmax?: number  // default: 5
        color?: string  // default: "blue"
        lineWidth?: number  // default: 1
      }
    }

IMPORTANT RULES:
- Output ONLY valid JSON array - no markdown, no explanation, no code blocks, no trailing text
- Functions must be valid JavaScript strings like "(x) => Math.sin(x)" or "(x) => x * x"
- Use Math.PI for pi, Math.sin, Math.cos, Math.exp, etc. for mathematical functions
- Timeline must be sequential and logical
- Each action has a time (duration in seconds for this step) - DEFAULT: 4 seconds if not specified
- Each action has a subtitle (text explanation)
- For 'update' actions, only include props that are changing
- Camera target is optional on any action - use it to smoothly move camera to different viewpoints
- All numeric values must be plain numbers only
- Pre-compute ALL Math operations before outputting JSON
- Instead of "Math.PI", use 3.14159265359
- Instead of "2 * Math.PI", use 6.28318530718
- Instead of "Math.PI / 2", use 1.57079632679
- NO multiplication, division, or Math functions in the JSON output

User request:
"${userQuestion}"

Output the JSON array now:
`;
  }  