import { Action } from "../types/actions"

export function compileFunction(expr: string): (x: number) => number {
    const trimmed = expr.trim()
  
    try {
      // If they gave an arrow function string: "(x) => Math.sin(x)"
      if (trimmed.includes("=>")) {
        return new Function(`return (${trimmed})`)() as (x: number) => number
      }
  
      // If they gave an expression: "Math.sin(x)"
      return new Function("x", `return (${trimmed})`) as unknown as (x: number) => number
    } catch (error) {
      console.error("Failed to compile function:", trimmed)
      throw error
    }
  }

function normalizeProps(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(normalizeProps)
    }
  
    if (obj && typeof obj === "object") {
      const out: any = {}
      for (const key in obj) {
        const val = obj[key]
  
        if (
          typeof val === "string" &&
          (key === "f" || key === "g")
        ) {
          out[key] = compileFunction(val)
        } else {
          out[key] = normalizeProps(val)
        }
      }
      return out
    }
  
    return obj
  }


export function normalizeTimeline(actions: Action[]): Action[] {
  return actions.map(action => {
    if (action.type === "add" && action.object) {
      return {
        ...action,
        object: {
          ...action.object,
          props: normalizeProps(action.object.props),
        },
      }
    }

    if (action.type === "update" && action.props) {
      return {
        ...action,
        props: normalizeProps(action.props),    
      }
    }

    return action
  })
}