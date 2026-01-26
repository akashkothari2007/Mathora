import strict from "assert/strict";
export function buildPrompt(
  userQuestion: string,
  stepNumber: number,
  outline: string[],
  previousStepsJson?: string
) {
  return `
You are generating ONE math visualization step.

Return ONE JSON object matching:
{
  subtitle?: string,
  cameraTarget?: { position?: [n,n,n], lookAt?: [n,n,n], duration?: n } | null,
  actions?: Action[]
}

Action:
- add:    { type:"add", object:{ id, type, props } }
- update: { type:"update", id, props }
- remove: { type:"remove", id }

GraphObject types:
- function:        { f, xmin?, xmax?, color? }
- point:           { position: {x, y}, color?, animateTo?, followFunction? }
- label:           { text, position: {x, y}, color? }
- area:            { f, g?, xmin, xmax, color?, opacity? }
- slidingTangent:  { f, startX, endX, duration?, color? }

Rules:
- f/g are JS expressions like "x*x" or "Math.sin(x)"
- Use 3.14159265359 (never Math.PI)
- IDs: f1,f2,p1,area1,t1,lbl1
- subtitle = what you'd say aloud to teach
- This is step ${stepNumber + 1} of ${outline.length}
- Follow outline step: "${outline[stepNumber]}"

Context:
PreviousStep: ${previousStepsJson ?? "null"}

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

Question:
${JSON.stringify(userQuestion)}
`.trim();
}