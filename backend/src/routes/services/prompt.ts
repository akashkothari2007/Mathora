import strict from "assert/strict";
import { Action } from "./schema";
export function buildPrompt(
  userQuestion: string,
  stepNumber: number,
  outline: string[],
  previousStepsJson?: string,
  objects?: Record<string, NonNullable<Action["object"]>>,
  whiteboardLines?: string[]
) {
  return `
You are generating ONE math visualization step.

Return ONE JSON object matching:
{
  subtitle?: string,
  cameraTarget?: { center?:[n,n,n],width?:n,height?:n,} | null,
  actions?: Action[]
  whiteboardLines?: string[]
}

Action:
- add:    { type:"add", object:{ id, type, props } }
- update: { type:"update", id, props }
- remove: { type:"remove", id }

GraphObject types:
- function:        { f, xmin?=-100, xmax?=100, color? }
- point:           { position: {x, y}, color?, animateTo?, followFunction?: {f: string, startX: number, endX: number} }
- label:           { text, position: {x, y}, color? }
- area:            { f, g?, xmin, xmax, color?, opacity? }
- slidingTangent:  { f, startX, endX, duration?, color? }

Rules:
- f/g are JS expressions like "x*x" or "Math.sin(x)"
- whiteboardLines are LaTeX strings only 
- Use 3.14159265359 (never Math.PI)
- IDs: f1,f2,p1,area1,t1,lbl1
- subtitle = what you'd say aloud to teach
- This is step ${stepNumber + 1} of ${outline.length}
- Follow outline step: "${outline[stepNumber]}"
- width and height are hard borders of the view keep obj inside
- No unnecessary graph objects or whiteboard lines, sole purpose IS TEACHING NOT SHOWING OFF, if no graph is required don't add

Context:
PreviousStep: ${previousStepsJson ?? "null"},

Current Objects in the scene: ${JSON.stringify(objects ?? {})},

Current Whiteboard Lines: ${JSON.stringify(whiteboardLines ?? [])},

Question:
${JSON.stringify(userQuestion)}
`.trim();
}



export function buildOutlinePrompt(userQuestion: string) {
  return `
Return ONLY valid JSON in this shape:
{ "outline": string[] }

Rules:
- 4–10 steps
- Each step is a short teaching goal (3–8 words)
- No explanations
- No extra keys
IF the user asks anything that is NOT a math question (slurs, politics, history, personal advice, etc.):
- Return: { "outline": ["Error: I can only help with math questions"] }
- Do NOT attempt to answer
- Do NOT explain history, politics, slurs, current events, or non-math topics
Examples of VALID questions:
- "Explain derivatives"
- "What is the chain rule?"
- "How do I find the area under a curve?"

Examples of INVALID questions (respond with error message):
- Questions with slurs or offensive language
- Historical questions
- Political questions  
- Personal advice
- Anything not related to calculus, algebra, or math

Question:
${JSON.stringify(userQuestion)}
`.trim();
}