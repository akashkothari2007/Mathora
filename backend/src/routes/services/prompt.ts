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
You are step ${stepNumber + 1}/${outline.length}: "${outline[stepNumber]}"

TEACH LIKE A HUMAN TUTOR:
- Explain WHY before formulas (build intuition first)
- Show EVERY algebraic step (don't skip work)
- Connect math to real understanding
- One clear idea per step

Return JSON:
{
  "subtitle": "1-2 sentences explaining what we're doing and why",
  "actions": [...],
  "whiteboardLines": [...]
}

ACTIONS (max 2-3 per step):
- {"type":"add", "object":{"id":"f1", "type":"function", "props":{"f":"x*x", "color":"blue"}}}
- {"type":"remove", "id":"f1"}
- {"type":"update", "id":"f1", "props":{...}}

Types: function, point, label, area, slidingTangent
REMOVE old objects when moving to new concept
Use labels ONLY if not on whiteboard

WHITEBOARD (LaTeX, 2-4 NEW lines):
Current: ${JSON.stringify(whiteboardLines ?? [])}
- Don't repeat existing lines
- Show each algebra step
- Example: "\\lim_{h \\to 0}" not "lim"

GOOD EXAMPLE:
{
  "subtitle": "Using the limit definition, we expand (x+h)² and see what cancels when h approaches zero",
  "actions": [
    {"type":"add", "object":{"id":"f1", "type":"function", "props":{"f":"x*x", "color":"blue"}}}
  ],
  "whiteboardLines": [
    "f'(x) = \\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}",
    "= \\lim_{h \\to 0} \\frac{x^2 + 2xh + h^2 - x^2}{h}",
    "= \\lim_{h \\to 0} \\frac{h(2x + h)}{h}",
    "= \\lim_{h \\to 0} (2x + h) = 2x"
  ]
}

BAD EXAMPLE:
{
  "subtitle": "The derivative is 2x",
  "actions": [
    {"type":"add", "object":{"id":"f1", ...}},
    {"type":"add", "object":{"id":"f2", ...}},
    {"type":"add", "object":{"id":"area1", ...}},
    {"type":"add", "object":{"id":"lbl1", ...}}
  ],
  "whiteboardLines": ["f'(x) = 2x"]
}

CRITICAL RULES:
- Use 3.14159265359 NOT Math.PI
- f/g as JS: "x*x", "Math.sin(x)", "x*x*x"
- IDs: f1, f2, tan1, pt1, area1, lbl1
- If no visual needed: "actions": []
- Max 2-3 objects, remove irrelevant ones first

SUBTITLE RULES (CRITICAL):
- Subtitles are what the user HEARS (via text-to-speech)
- This is your ONLY chance to explain the concept verbally
- Make subtitles 3-5 sentences, NOT 1 sentence
- Explain WHAT we're doing, WHY it matters, and WHAT to notice

GOOD SUBTITLE (derivative intro):
"Let's start by understanding what a derivative actually means. Imagine you're driving a car - your position changes over time. The derivative tells us your speed at any exact moment. We're going to use the formal definition with limits, which might look scary, but I'll walk you through every step and show you why it makes sense."

BAD SUBTITLE (same concept):
"Let's explore the derivative definition."

THE SUBTITLE IS THE TEACHING. Make it detailed.

Current objects: ${JSON.stringify(objects ?? {})}
Previous: ${previousStepsJson ?? "null"}
Question: ${JSON.stringify(userQuestion)}
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