export function buildPrompt(userQuestion: string) {
  return `
You generate animation timelines for a math visualization engine.

Return ONLY a valid JSON array. No markdown. No explanations.

All math functions MUST be JavaScript EXPRESSION STRINGS using Math.*.
Examples:
- "Math.sin(x)"
- "x*x"
- "2*Math.cos(x)+1"

Do NOT output "sin(x)". Always use Math.sin(x).
Do NOT include arrow functions.

All numbers must be plain numbers only.
Use 3.14159265359 instead of Math.PI.

Types:

Action =
- { type:"add", time:number, subtitle:string, object:GraphObject, target?:CameraTarget }
- { type:"update", time:number, subtitle:string, id:string, props:any, target?:CameraTarget }
- { type:"remove", time:number, subtitle:string, id:string, target?:CameraTarget }
- { type:"wait", time:number, subtitle:string, target?:CameraTarget }

CameraTarget = {
  position?: [number, number, number]
  duration?: number
}

GraphObject =
- function:
  {
    id:string,
    type:"function",
    props:{
      f:string,
      xmin?:number,
      xmax?:number,
      steps?:number,
      color?:string,
      lineWidth?:number,
      g?:string,
      animateDuration?:number
    }
  }

- point:
  {
    id:string,
    type:"point",
    props:{
      position:{x:number,y:number},
      color?:string,
      size?:number,
      animateTo?:{x:number,y:number},
      animateDuration?:number,
      followFunction?:{
        f:string,
        startX:number,
        endX:number,
        duration?:number
      }
    }
  }

- label:
  {
    id:string,
    type:"label",
    props:{
      text:string,
      position:{x:number,y:number},
      color?:string,
      fontSize?:number
    }
  }

- area:
  {
    id:string,
    type:"area",
    props:{
      f:string,
      g?:string,
      xmin:number,
      xmax:number,
      steps?:number,
      color?:string,
      opacity?:number,
      animateTo?:{
        f?:string,
        g?:string,
        xmin?:number,
        xmax?:number
      },
      animateDuration?:number
    }
  }

- slidingTangent:
  {
    id:string,
    type:"slidingTangent",
    props:{
      f:string,
      startX:number,
      endX:number,
      duration?:number,
      xmin?:number,
      xmax?:number,
      color?:string,
      lineWidth?:number
    }
  }

Rules:
- Every action must have time (seconds) and subtitle
- Use consistent ids ("f1","p1","area1","t1","lbl1")
- Timeline should be logical and sequential
- For update actions, include ONLY changed props
- Default action time: ~3 seconds if not specified

User request:
"${userQuestion}"

Return the JSON array now.
`.trim()
}