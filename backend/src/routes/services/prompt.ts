import { Action } from "./schema";
import type { OutlineStep } from "./schema";

export function buildPrompt(
  userQuestion: string,
  stepNumber: number,
  outline: OutlineStep[],
  previousStepsJson?: string,
  objects?: Record<string, NonNullable<Action["object"]>>,
  _whiteboardLines?: string[]
) {
  const stepInfo = outline[stepNumber];
  const stepSubtitle = stepInfo?.subtitle ?? "";
  const stepVisualGoal = stepInfo?.visualGoal ?? "";
  return `

You are generating step ${stepNumber + 1} of ${outline.length}.

THIS STEP'S NARRATION (what the user will hear — do not change it):
"""
${stepSubtitle}
"""

THIS STEP'S VISUAL GOAL (exactly what to do on the graph this step — match this):
"""
${stepVisualGoal}
"""

Your job: output only the graph actions (and optional cameraTarget) that fulfill the visual goal above. Do NOT generate a subtitle. Do only what this step asks: e.g. if the goal says "add nothing", return empty actions; if it says "add the function", add the function; if it says "update the secant", update the existing secant. Build on objects from previous steps; do not re-add what is already there unless the goal says to replace it.

CURRENT GRAPH: ${JSON.stringify(objects ?? {})}

ACTIONS YOU CAN USE:
- add: put a new object on the graph (use new IDs: f1, pt1, tan1, area1, sec1, ln1, lbl1), no reusing ids
- update: change props of an existing object by id (e.g. move a point, change secant endpoints).
- remove: remove an object by id (e.g. when moving to a new concept).

GUIDELINES:
- 1–4 actions per step is fine. Add only what teaches.
- Remove or update when it helps the story (e.g. remove old points when highlighting a new one).
- Don't add decoration. Every object should support the explanation.

OBJECT TYPES AND PROPS (numbers must be bare, not strings):

function — graph y = f(x). Optional: xmin, xmax (default -5..5), color, lineWidth.
  add: {"type":"add","object":{"id":"f1","type":"function","props":{"f":"x*x","xmin":-3,"xmax":3,"color":"#4ade80"}}}

point — dot at (x,y). Optional: color, size. Can animate or follow a function.
  add: {"type":"add","object":{"id":"pt1","type":"point","props":{"position":{"x":1,"y":1},"color":"red"}}}
  point that moves along f from startX to endX over duration seconds:
  {"type":"add","object":{"id":"pt1","type":"point","props":{"position":{"x":0,"y":0},"followFunction":{"f":"x*x","startX":-2,"endX":2,"duration":3}}}}
  point that animates to a new position:
  {"type":"add","object":{"id":"pt1","type":"point","props":{"position":{"x":0,"y":0},"animateTo":{"x":2,"y":4},"animateDuration":1.5}}}
  update position: {"type":"update","id":"pt1","props":{"position":{"x":2,"y":4}}}

label — text at (x,y). Optional: color
  {"type":"add","object":{"id":"lbl1","type":"label","props":{"text":"slope here","position":{"x":1,"y":1}}}}

slidingTangent — tangent line that slides along f from startX to endX. Optional: duration, xmin, xmax, color, lineWidth.
  {"type":"add","object":{"id":"tan1","type":"slidingTangent","props":{"f":"x*x","startX":-2,"endX":2,"duration":2}}}

secantLine — line through (startX, f(startX)) and (endX, f(endX)); good for "average rate" then limit. Optional: extension, color, lineWidth, pointSize.
  {"type":"add","object":{"id":"sec1","type":"secantLine","props":{"f":"x*x","startX":-1,"endX":2}}}
  update: {"type":"update","id":"sec1","props":{"startX":0.5,"endX":1.5}}

line — straight segment from start to end. Optional: color, lineWidth.
  {"type":"add","object":{"id":"ln1","type":"line","props":{"start":{"x":0,"y":0},"end":{"x":2,"y":1},"color":"white"}}}

area — shaded region under f (and optionally between g and f). Required: xmin, xmax. Optional: g, color, opacity, steps.
  {"type":"add","object":{"id":"area1","type":"area","props":{"f":"x*x","xmin":0,"xmax":2,"color":"#22c55e","opacity":0.4}}}

REMOVE:
  {"type":"remove","id":"pt1"}

cameraTarget (optional) — frame the view. Use when you want to zoom or focus on a region.
- center: [x, y, 0] (where to look)
- width: horizontal span in world units (e.g. 6)
- height: vertical span in world units (e.g. 4)
Give only what matters: e.g. just height to zoom vertically, or just width. If you give both, we fit both (camera backs up so both are visible). Omit entirely for default view.
  {"cameraTarget":{"center":[0,0,0],"width":8}}
  {"cameraTarget":{"center":[1,1,0],"height":3}}

RULES:
- All numbers bare: {"x":1,"y":1} not {"x":"1","y":"1"}.
- Function f: use a string the frontend can eval: "x*x", "Math.sin(x)", "2*x+1".
- Use 3.14159265359 for pi if needed.
- LABEL EVERY SINGLE GRAPH USING THE LABEL
OUTPUT: Only valid JSON, no markdown or backticks. Do not include subtitle.
{
  "actions": [...],
  "cameraTarget": { ... } or omit
}

Context:
Previous step: ${previousStepsJson ?? "null"}
Question: ${JSON.stringify(userQuestion)}
`.trim();
}



export function buildOutlinePrompt(userQuestion: string) {
  return `
You are writing a short lesson outline. The outline is what brings everything together: cohesive story, great explanations, and clear instructions for what to draw each step.

Return ONLY valid JSON:
{ "outline": [ { "subtitle": string, "visualGoal": string }, ... ] }

---

SUBTITLE (the main teaching content — 3–5 sentences the user will hear)
- Style: like 3Blue1Brown. Explain WHY before formulas. Build from basics; assume no prior knowledge.
- Use analogies and "what if we..." so it feels like a conversation. One main idea per step.
- Natural, friendly tone. Make the intuition crystal clear; then the math follows.
- No jargon dumps. If you use a term, briefly say what it means.

---

VISUAL GOAL (simple, short — what to draw this step only)
- Plain words: "add nothing", "add a simple function", "add a line", "add a secant", "update the secant", "add a point", "draw a triangle" (with lines), "shade the area", "label the graph" etc.
- One step = one (or two) clear actions. Spread visuals across steps so the lesson builds.
- First step often: "Add nothing." so we don't dump the graph before the intro.
- Match the subtitle: when you say "here's the curve", that step's goal is "add the function". When you say "draw the line between two points", that step's goal is "add a secant line" or "add a line".
- Make sure you finish the lesson with the whole goal visually to not leave the user hanging it should be complete, accurate and make sense to users who are unfamiliar with the topic

---

IF the user asks anything that is NOT a math question (slurs, politics, history, personal advice, etc.):
- Return: { "outline": [ { "subtitle": "Error: I can only help with math questions.", "visualGoal": "none" } ] }

---

Example for "Explain the derivative":
[
  { "subtitle": "What if we could measure how steep a curve is at a single point? That's exactly what the derivative does. Think of driving a car: your speedometer shows how fast you're going right now — that's the derivative of your position.", "visualGoal": "Add nothing." },
  { "subtitle": "Here's a trick. Take two points on the curve and draw the line between them. That line is called a secant. Its slope is the average rate of change between those two points — like your average speed over a stretch of road.", "visualGoal": "Add a simple function like x squared. Add a secant line between two x values." },
  { "subtitle": "Now imagine moving the second point closer and closer to the first. The secant line rotates and approaches a limiting line — the tangent. That tangent just kisses the curve at one point.", "visualGoal": "Update the secant so the two points are closer together, near x=1." },
  { "subtitle": "The slope of that tangent line is the derivative at that point. So the derivative is the instantaneous rate of change: how fast things are changing right at that moment.", "visualGoal": "Add a point at the spot where the tangent touches, or leave as is." }
]
4-7 steps is fine may vary

Question:
${JSON.stringify(userQuestion)}
`.trim();
}

