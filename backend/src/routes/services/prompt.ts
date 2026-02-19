import { Action } from "./schema";
import type { OutlineStep, Step } from "./schema";

/** Compact inventory: "f1 (function), pt1 (point), sec1 (secant)" or "None." */
function formatCurrentGraph(objects: Record<string, NonNullable<Action["object"]>>): string {
  const entries = Object.entries(objects);
  if (entries.length === 0) return "None.";
  return entries
    .map(([id, obj]) => `${id} (${obj.type})`)
    .join(", ") + ".";
}

/** One-line summary of what the previous step did: "Added f1, pt1. Updated sec1." or "First step." */
function formatPreviousStepSummary(step: Step | null | undefined): string {
  if (!step?.actions?.length) return "First step.";
  const added: string[] = [];
  const updated: string[] = [];
  const removed: string[] = [];
  for (const a of step.actions) {
    if (a.type === "add" && a.object) added.push(a.object.id);
    else if (a.type === "update" && a.id) updated.push(a.id);
    else if (a.type === "remove" && a.id) removed.push(a.id);
  }
  const parts: string[] = [];
  if (added.length) parts.push(`Added ${added.join(", ")}.`);
  if (updated.length) parts.push(`Updated ${updated.join(", ")}.`);
  if (removed.length) parts.push(`Removed ${removed.join(", ")}.`);
  return parts.length ? parts.join(" ") : "No actions.";
}

export function buildPrompt(
  userQuestion: string,
  stepNumber: number,
  outline: OutlineStep[],
  prevStep?: Step | null,
  objects?: Record<string, NonNullable<Action["object"]>>,
  _whiteboardLines?: string[]
) {
  const stepInfo = outline[stepNumber];
  const stepSubtitle = stepInfo?.subtitle ?? "";
  const stepVisualGoal = stepInfo?.visualGoal ?? "";
  const currentGraphText = formatCurrentGraph(objects ?? {});
  const previousStepSummary = formatPreviousStepSummary(prevStep ?? null);

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

Your job: (1) Output the graph actions (and optional cameraTarget) that fulfill the visual goal above. (2) Output speakSubtitle: the spoken version of THIS STEP'S NARRATION above — same content but in words you would say aloud for text-to-speech. Convert any math notation to spoken form (e.g. x^2 → "x squared", 9-(x+2)² → "9 minus the quantity x plus 2, squared"; use "quantity" for grouping so it's unambiguous when heard). If the narration has no math notation, speakSubtitle can equal it. Do NOT generate a new subtitle; use the narration given. Do only what this step asks: e.g. if the goal says "add nothing", return empty actions; if it says "add the function", add the function; if it says "update the secant", update the existing secant. Build on objects from previous steps; do not re-add what is already there unless the goal says to replace it.

CURRENT GRAPH: ${currentGraphText}

PREVIOUS STEP: ${previousStepSummary}

ACTIONS YOU CAN USE:
- add: put a new object on the graph (use new IDs: f1, pt1, tan1, area1, sec1, ln1, lbl1), no reusing ids for any two objects
- update: change props of an existing object by id (e.g. move a point, change secant endpoints).
- remove: remove an object by id (e.g. when moving to a new concept).

GUIDELINES:
- 1–4 actions per step is fine. Add only what teaches.
- Remove or update when it helps the story (e.g. remove old points when highlighting a new one).
- Don't add decoration. Every object should support the explanation.

OBJECT TYPES AND PROPS (numbers must be bare, not strings):

function — graph y = f(x). Optional: xmin, xmax (default -5..5), color, lineWidth.
  add: {"type":"add","object":{"id":"f1","type":"function","props":{"f":"x*x","color":"#4ade80"}}}

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
- label whatever is necessary to make it further understandable for the user
OUTPUT: Only valid JSON, no markdown or backticks. Include speakSubtitle (spoken version of the step narration above).
{
  "actions": [...],
  "cameraTarget": { ... } or omit,
  "speakSubtitle": "string — same as narration but in spoken words, math notation converted"
}

Question: ${JSON.stringify(userQuestion)}
`.trim();
}



export function buildOutlinePrompt(userQuestion: string) {
  return `
You are writing a short lesson outline. The outline is the single source of truth: cohesive story, great explanations, and clear instructions for what to draw each step. A later step generator will receive ONLY your visualGoal and a short "current graph" summary — so your visualGoal must be specific and use consistent object ids.

Return ONLY valid JSON:
{ "outline": [ { "subtitle": string, "visualGoal": string, "pauseDuration": "short" | "medium" | "long" }, ... ] }

---

OBJECT IDS (use these exact prefixes; never reuse an id for two different objects)
- function: f1, f2, ...
- point: pt1, pt2, ...
- label: lbl1, lbl2, ...
- line: ln1, ln2, ...
- secantLine: sec1, sec2, ...
- slidingTangent: tan1, tan2, ...
- area: area1, area2, ...
Use the same id across steps for the same object (e.g. "update sec1" in step 4 refers to sec1 added in step 2). Never use p1/p2 — use pt1, pt2 for points.

---

SUBTITLE (the main teaching content — 3–5 sentences the user will see and read)
- Style: like 3Blue1Brown. Explain WHY before formulas. Build from basics; assume no prior knowledge.
- Use analogies and "what if we..." so it feels like a conversation. One main idea per step.
- Natural, friendly tone. Make the intuition crystal clear; then the math follows.
- No jargon dumps. If you use a term, briefly say what it means.
- Readability: write so it can be read aloud; avoid long strings of symbols. Prefer "x squared" in prose when possible; keep notation minimal so TTS and the reader can follow.
- Correctness: every number or formula you state in the subtitle must appear on the graph in that step or a prior step (e.g. if you say "we get x = 2", there must be a point or label at x = 2). Do not state an answer without showing it visually.

---

VISUAL GOAL (what to draw this step only — the step generator gets only this and "current graph: id (type), ...")
- Be specific and unambiguous. Use object ids: "Add f1 (y = x^2). Add sec1 from x=-1 to x=2." not "add a curve and a line".
- One main visual change per step (or one logical group: e.g. "Add f1 and lbl1 labeling the vertex").
- First step often: "Add nothing." so we don't dump the graph before the intro.
- Later steps: "Add pt1 at (1,1).", "Update sec1 so startX=0.5, endX=1.5.", "Add area1 under f1 from x=0 to x=2.", "Add lbl1 at vertex."
- Match the subtitle: when you say "here's the curve", that step's goal is "add f1". When you say "draw the line between two points", that step's goal is "add sec1" or "add ln1".
- Prefer "update" for smooth transitions (e.g. "Update sec1 so the two points are closer.") instead of remove + add.
- Everything you solve or compute must be drawn: derivative → graph it; critical points x = -1, 1 → add points or labels at those x. The user learns by seeing every step on the graph.
- Last step: show the full result (e.g. area shaded, points and labels in place, final formula visible). Complete and accurate so a user unfamiliar with the topic can follow.
- Example (average rate of change): show rise and run with labels, then the ratio; complete the lesson with the example and numbers on the graph.

Object types: function (f1), point (pt1), label (lbl1), line (ln1), secantLine (sec1), slidingTangent (tan1), area (area1).

---

STRUCTURE (typical arc)
- Step 1: Often "Add nothing." — intro/motivation.
- Steps 2–3: Setup — add main function (f1) or diagram.
- Middle steps: Build — add points, lines, labels step by step; update when you want to change something.
- Near end: Payoff — shade area, show result, add final labels.
- Last step: Full visual state so the lesson feels complete.

---

PAUSE DURATION (optional)
- "short": quick transitions. "medium": default. "long": complex ideas or multiple visuals. Omit for "medium".

---

IF the user asks anything that is NOT a math question (slurs, politics, history, personal advice, etc.):
- Return: { "outline": [ { "subtitle": "Error: I can only help with math questions.", "visualGoal": "none" } ] }

---

Example for "Explain the derivative":
[
  { "subtitle": "What if we could measure how steep a curve is at a single point? That's exactly what the derivative does. Think of driving a car: your speedometer shows how fast you're going right now — that's the derivative of your position.", "visualGoal": "Add nothing.", "pauseDuration": "medium" },
  { "subtitle": "Here's a trick. Take two points on the curve and draw the line between them. That line is called a secant. Its slope is the average rate of change between those two points — like your average speed over a stretch of road.", "visualGoal": "Add f1 (y = x^2). Add sec1 between x=-1 and x=2.", "pauseDuration": "medium" },
  { "subtitle": "Now imagine moving the second point closer and closer to the first. The secant line rotates and approaches a limiting line — the tangent. That tangent just kisses the curve at one point.", "visualGoal": "Update sec1 so the two points are closer together, near x=1.", "pauseDuration": "long" },
  { "subtitle": "The slope of that tangent line is the derivative at that point. So the derivative is the instantaneous rate of change: how fast things are changing right at that moment.", "visualGoal": "Add pt1 at the point where the tangent touches (1,1). Add lbl1 there.", "pauseDuration": "medium" }
]
4–7 steps is fine; may vary by topic.

Question:
${JSON.stringify(userQuestion)}
`.trim();
}

