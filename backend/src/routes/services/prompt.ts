export function buildPrompt(userQuestion: string) {
    return `
  You are an animation engine timeline generator.
  
  You must output ONLY valid JSON.
  
  Create an array of Action objects that follows this TypeScript type:
  
  type Action = {
    type: 'add' | 'update' | 'remove' | 'wait',
    time: number,
    subtitle: string,
    id?: string,
    object?: {
      id: string,
      type: 'function' | 'point' | 'label',
      props: Record<string, any>
    },
    props?: Record<string, any>
  }
  
  Rules:
  - Do not include comments
  - Functions must be valid JavaScript like (x) => Math.sin(x)
  - Use Math.PI where needed
  - Timeline must be sequential and logical
  - Only output JSON, no explanation text
  
  User request:
  "${userQuestion}"
  `;
  }  