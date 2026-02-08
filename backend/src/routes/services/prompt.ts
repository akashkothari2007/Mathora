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
You are generating step ${stepNumber + 1} of ${outline.length}.
GOAL: "${outline[stepNumber]}"

TEACHING PHILOSOPHY:
- Explain WHY before showing formulas
- Build from absolute basics - assume zero prior knowledge
- Show EVERY algebraic step (never skip work)
- Make intuition crystal clear before introducing math

SUBTITLE (3-5 sentences):
This is what the user HEARS via voice.
- Explain what we're doing this step
- WHY it matters conceptually
- What to notice in the visual/algebra
- Use natural teaching language

Example: "Let's see what a derivative really means. Imagine driving a car - your speedometer shows how fast you're going at each moment. That's exactly what a derivative does for any function: it tells us the rate of change at each point. We'll use the limit definition to find this mathematically."

GRAPH OBJECTS - USE SPARINGLY:
Current objects: ${JSON.stringify(objects ?? {})}

WHEN TO ADD OBJECTS:
✅ function: When introducing a NEW function to visualize
✅ point: When highlighting a SPECIFIC value (e.g., f(2) = 4)
✅ slidingTangent: When showing derivative visually
✅ area: When discussing integrals or area under curve
✅ label: RARELY - only for critical annotations NOT on whiteboard

❌ DON'T ADD:
- Decorative objects that don't teach
- Multiple functions unless comparing them
- Points that aren't referenced in explanation
- Labels that repeat whiteboard content
- More than 6 objects per step

OBJECT ID RULES:
- Each ID must be unique at any given time
- Before adding an object with existing ID, REMOVE it first:
  WRONG: [{"type":"add","object":{"id":"f1",...}}]
  RIGHT: [{"type":"remove","id":"f1"},{"type":"add","object":{"id":"f1",...}}]
- Or use different IDs: f1, f2, f3, etc.

OBJECT FORMATS (EXACT SYNTAX):

function:
{"type":"add","object":{"id":"f1","type":"function","props":{"f":"x*x","color":"blue"}}}

point:
{"type":"add","object":{"id":"pt1","type":"point","props":{"position":{"x":1,"y":1},"color":"red"}}}
⚠️ CRITICAL: Use position:{x,y} wrapper, NOT direct x,y

label:
{"type":"add","object":{"id":"lbl1","type":"label","props":{"text":"Peak","position":{"x":0,"y":1}}}}

slidingTangent:
{"type":"add","object":{"id":"tan1","type":"slidingTangent","props":{"f":"x*x","startX":-2,"endX":2}}}

area:
{"type":"add","object":{"id":"area1","type":"area","props":{"f":"x*x","xmin":0,"xmax":2}}}

WHITEBOARD (LaTeX):
Current: ${JSON.stringify(whiteboardLines ?? [])}

Add 2-4 NEW lines showing work:
- Don't repeat existing lines
- Show each algebra transformation
- Use proper LaTeX: \\lim_{h \\to 0}, \\frac{a}{b}, \\sin(x)

EXAMPLES:

✅ GOOD STEP (clear, focused):
{
  "subtitle": "We'll use the limit definition of a derivative. This formula finds the slope by taking two points infinitely close together. As h gets smaller and smaller, we zoom in on the exact slope at one point. Let's work through the algebra step by step.",
  "actions": [
    {"type":"add","object":{"id":"f1","type":"function","props":{"f":"x*x","color":"blue"}}}
  ],
  "whiteboardLines": [
    "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
    "= \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}",
    "= \\lim_{h \\to 0} \\frac{2xh + h^2}{h}",
    "= 2x"
  ]
}

❌ BAD STEP (cluttered, unfocused):
{
  "subtitle": "Here's the derivative",
  "actions": [
    {"type":"add","object":{"id":"f1","type":"function","props":{"f":"x*x"}}},
    {"type":"add","object":{"id":"f2","type":"function","props":{"f":"2*x"}}},
    {"type":"add","object":{"id":"pt1","type":"point","props":{"position":{"x":1,"y":1}}}},
    {"type":"add","object":{"id":"lbl1","type":"label","props":{"text":"Point","position":{"x":1,"y":1}}}},
    {"type":"add","object":{"id":"area1","type":"area","props":{"f":"x*x","xmin":0,"xmax":1}}}
  ],
  "whiteboardLines": ["f'(x) = 2x"]
}

CRITICAL RULES:
- Use 3.14159265359 NOT Math.PI
- Function expressions: "x*x", "Math.sin(x)", "Math.cos(x)*x"
- Max 3 objects per step (preferably 1-2)
- IDs: f1, f2, tan1, pt1, area1, lbl1
- Remove old objects before adding new concepts

OUTPUT FORMAT:
Return ONLY raw JSON (no markdown, no backticks, no explanation):
{
  "subtitle": "...",
  "actions": [...],
  "whiteboardLines": [...]
}

Context:
Previous step: ${previousStepsJson ?? "null"}
Question: ${JSON.stringify(userQuestion)}
`.trim();
}



export function buildOutlinePrompt(userQuestion: string) {
  return `
Return ONLY valid JSON in this shape:
{ "outline": string[] }

Rules:
- 4–15 steps
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