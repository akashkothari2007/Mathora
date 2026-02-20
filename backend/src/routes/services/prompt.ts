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
  const stepWhiteboardGoal = stepInfo?.whiteboardGoal ?? "";
  const currentGraphText = formatCurrentGraph(objects ?? {});
  const previousStepSummary = formatPreviousStepSummary(prevStep ?? null);

  const whiteboardBlock = stepWhiteboardGoal
    ? `

THIS STEP'S WHITEBOARD GOAL (describe what to show — you must output whiteboardLines in LaTeX that express this mathematically; do NOT paste this text verbatim; 1–2 lines only):
"""
${stepWhiteboardGoal}
"""
`
    : "";

  const cameraNote =
    stepInfo?.cameraTarget != null
      ? "\nCamera for this step is set by the outline; do not output cameraTarget."
      : "";

  return `

You are generating step ${stepNumber + 1} of ${outline.length}.

THIS STEP'S NARRATION (what the user will hear — do not change it):
"""
${stepSubtitle}
"""

THIS STEP'S VISUAL GOAL (exactly what to do on the graph this step — match this):
"""
${stepVisualGoal}
"""${whiteboardBlock}

Your job: (1) Output the graph actions (and optional cameraTarget unless the outline set it for this step) that fulfill the visual goal above. (2) Output speakSubtitle: the spoken version of THIS STEP'S NARRATION above — same content but in words you would say aloud for text-to-speech.${cameraNote} Convert any math notation to spoken form (e.g. x^2 → "x squared", 9-(x+2)² → "9 minus the quantity x plus 2, squared"; use "quantity" for grouping so it's unambiguous when heard). If the narration has no math notation, speakSubtitle can equal it. Do NOT generate a new subtitle; use the narration given. Do only what this step asks: e.g. if the goal says "add nothing", return empty actions; if it says "add the function", add the function; if it says "update the secant", update the existing secant. Build on objects from previous steps; do not re-add what is already there unless the goal says to replace it.

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

whiteboardLines (optional) — LaTeX strings only. Each line is rendered as math by KaTeX. Use for calculations and algebraic steps only; do NOT use for graph objects or labels (those go in actions).
- If this step has a WHITEBOARD GOAL above, convert that goal into LaTeX — do NOT copy the goal as plain English. E.g. goal "Show the roots: x = 2 and x = -2" → output ["x = 2 \\\\text{ and } x = -2"] or ["x = \\\\pm 2"], NOT ["Show the roots: x = 2 and x = -2."]. Output 1–2 LaTeX lines that express the math; no prose.
- WHEN TO USE (if no whiteboard goal): When the step involves solving an equation or algebraic work — first line "x^2 = 4", next line "x = \\pm 2". Omit when the step is only graph/labels/camera.
- LaTeX RULES (critical): Every command needs a backslash. Use \\pm (plus-minus), \\sqrt{...}, \\frac{a}{b}, \\text{...} for plain text. Never write bare "pm" or "sqrt" — they will not render.
- JSON ESCAPING: In JSON, a backslash is escaped. To get one backslash in the string value you must write two backslashes. So for plus-minus you must write \\\\pm in the JSON (the parsed value will be \\pm). Example correct JSON: "whiteboardLines": ["x^2 - 4 = 0", "x = \\\\pm 2"]
- FORMAT: Each string is one line; they appear in order (staggered).

RULES:
- All numbers bare: {"x":1,"y":1} not {"x":"1","y":"1"}.
- Function f: use a string the frontend can eval: "x*x", "Math.sin(x)", "2*x+1".
- Use 3.14159265359 for pi if needed.
- LABEL EVERY SINGLE GRAPH USING THE LABEL
- label whatever is necessary to make it further understandable for the user
OUTPUT: Only valid JSON, no markdown or backticks. Include speakSubtitle (spoken version of the step narration above). Include whiteboardLines only when this step has calculations or algebra to show (array of LaTeX strings, or omit).
{
  "actions": [...],
  "cameraTarget": { ... } or omit,
  "speakSubtitle": "string — same as narration but in spoken words, math notation converted",
  "whiteboardLines": ["latex line 1", "latex line 2"] or omit
}

Question: ${JSON.stringify(userQuestion)}
`.trim();
}



export function buildOutlinePrompt(userQuestion: string) {
  return `
You are writing a short lesson outline. The outline is the single source of truth: cohesive story, great explanations, and clear instructions for what to draw each step. A later step generator will receive ONLY your visualGoal and a short "current graph" summary — so your visualGoal must be specific and use consistent object ids.

Return ONLY valid JSON:
{ "outline": [ { "subtitle": string, "visualGoal": string, "whiteboardGoal": string (optional), "cameraTarget": { "center": [x,y,0], "width" or "height" (optional) } (optional), "pauseDuration": "short" | "medium" | "long" }, ... ] }

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
- Correctness: every number or formula you state in the subtitle must appear on the graph in that step or a prior step (e.g. if you say "we get x = 2", there must be a point or label at x = 2). Do not state an answer without showing it visually.

---

VISUAL GOAL (what to draw this step only — the step generator gets only this and "current graph: id (type), ...")
- The step generator sees only id and type (e.g. "f1 (function)"); it does not see formulas. When the goal involves a curve (area under it, secant on it, tangent on it), include the curve formula in the goal so the step generator can output the correct function.
- For area, secantLine, and slidingTangent: include the curve formula in the visual goal. Good: "Add area1 under x^2 - 4 from x=-2 to x=2." or "Add area1 under the curve y = x^2 - 4 from x=-2 to x=2." Bad: "Add area1 under f1 from x=-2 to x=2." (step generator does not know what f1 is.) Same for secant/tangent: "Add sec1 on y = x^2 - 4 between x=-1 and x=2" not "Add sec1 on f1 between ...".
- Be specific and unambiguous. Use object ids: "Add f1 (y = x^2). Add sec1 on y = x^2 from x=-1 to x=2." not "add a curve and a line".
- One main visual change per step (or one logical group: e.g. "Add f1 and lbl1 labeling the vertex").
- First step often: "Add nothing." so we don't dump the graph before the intro.
- Later steps: "Add pt1 at (1,1).", "Update sec1 so startX=0.5, endX=1.5.", "Add area1 under x^2 from x=0 to x=2.", "Add lbl1 at vertex."
- Match the subtitle: when you say "here's the curve", that step's goal is "add f1". When you say "draw the line between two points", that step's goal is "add sec1" or "add ln1".
- Prefer "update" for smooth transitions (e.g. "Update sec1 so the two points are closer.") instead of remove + add.
- Everything you solve or compute must be drawn: derivative → graph it; critical points x = -1, 1 → add points or labels at those x. The user learns by seeing every step on the graph.
- Last step: show the full result (e.g. area shaded, points and labels in place, final formula visible). Complete and accurate so a user unfamiliar with the topic can follow.
- Conceptual lessons: For "what is the vertex", "explain the derivative", etc., do not add area shading unless the lesson is specifically about area. For a final recap step, prefer "Add nothing." or "Keep graph as is" instead of adding objects that don't support the main idea.
- Labels: Keep label text short and readable (e.g. "Vertex" or "(-2, 9)"); avoid long sentences.

---

WHITEBOARD (use whiteboardGoal whenever showing the equation or a key formula would help)
- Equation-solving: For "solve ..." or algebra-heavy questions, plan steps with whiteboardGoal — one or two equations per step (e.g. step 1: write the equation; step 2: substitute into formula; step 3: roots).
- Conceptual / function lessons: When the lesson explains a function, vertex, derivative meaning, etc., use whiteboardGoal to show the equation or key formula when you first introduce it. E.g. the step that adds f1 for y = 9 - (x+2)^2 can have whiteboardGoal: "Show the equation y = 9 - (x+2)^2". Use whiteboard whenever showing the formula on the side would help; not only for "solve ...".
- Use visualGoal for graph work; use "Add nothing." when the step is purely algebra. When introducing an equation, consider adding a whiteboardGoal for that step so the equation appears on the side.
- When a step has a whiteboardGoal, the step generator outputs whiteboardLines in LaTeX. Do not dump the whole solution in one step — 1–2 equations per step.

Object types: function (f1), point (pt1), label (lbl1), line (ln1), secantLine (sec1), slidingTangent (tan1), area (area1).

---

CAMERA (optional per step — frame the view)
- Any step can include optional cameraTarget to control how the graph is framed. The system fits the view from center and/or width/height.
- center: [x, y, 0] (e.g. vertex at (-2, 9) → center: [-2, 9, 0]). Optionally width (horizontal span) or height (vertical span) to zoom (e.g. height: 6 to focus on the vertex region).
- Examples: Zoom to vertex → {"center": [-2, 9, 0], "height": 6}. Wide view → {"center": [0, 0, 0], "width": 10}. Omit cameraTarget for default view.

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

Example for "Solve x^2 - 3x - 4 = 0" (equation-solving: use whiteboardGoal; keep visualGoal minimal or "Add nothing." for algebra-only steps):
[
  { "subtitle": "We'll solve this quadratic step by step. First, here's our equation: x squared minus 3x minus 4 equals zero.", "visualGoal": "Add nothing.", "whiteboardGoal": "Show the equation: x^2 - 3x - 4 = 0", "pauseDuration": "medium" },
  { "subtitle": "We use the quadratic formula: x equals negative b plus or minus the square root of b squared minus 4ac, all over 2a. Here a is 1, b is minus 3, and c is minus 4.", "visualGoal": "Add nothing.", "whiteboardGoal": "Show the quadratic formula with a=1, b=-3, c=-4 substituted in", "pauseDuration": "long" },
  { "subtitle": "Under the square root we get b squared minus 4ac: that's 9 plus 16, which is 25.", "visualGoal": "Add nothing.", "whiteboardGoal": "Show discriminant: b^2 - 4ac = 9 + 16 = 25", "pauseDuration": "medium" },
  { "subtitle": "So x is 3 plus or minus 5 over 2. That gives x equals 4 or x equals minus 1. We're done.", "visualGoal": "Add f1 (y = x^2 - 3*x - 4). Add pt1 and pt2 at roots (4,0) and (-1,0). Add lbl1 and lbl2.", "whiteboardGoal": "Show x = (3 ± 5)/2 and final roots x = 4, x = -1", "pauseDuration": "medium" }
]

Example for "Explain the vertex of 9 - (x+2)^2" (conceptual: whiteboardGoal shows equation; cameraTarget zooms to vertex; no area unless about area):
[
  { "subtitle": "Let's explore the vertex of y = 9 - (x+2)^2. The vertex is where the parabola turns — its maximum or minimum.", "visualGoal": "Add nothing.", "pauseDuration": "medium" },
  { "subtitle": "We can read the vertex from the form: the vertex is at (-2, 9). Here's the graph and the equation.", "visualGoal": "Add f1 (y = 9 - (x+2)^2). Add pt1 at (-2, 9).", "whiteboardGoal": "Show the equation y = 9 - (x+2)^2", "cameraTarget": { "center": [-2, 9, 0], "height": 6 }, "pauseDuration": "medium" },
  { "subtitle": "The vertex (-2, 9) is the maximum: the parabola opens down, so 9 is the highest value.", "visualGoal": "Add lbl1 at vertex with text 'Vertex (-2, 9)'.", "pauseDuration": "medium" }
]
4–7 steps is fine; may vary by topic.

Question:
${JSON.stringify(userQuestion)}
`.trim();
}

