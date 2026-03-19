import { normalizeSteps } from "../math/timeline/NormalizeTimeline";
import { rawTimeline } from "../math/timeline/randomTests/stringFunctions";
import {
  pointAndLabelTestTimeline,
  functionPlotTimeline,
  shadeAreaTimeline,
  slidingTangentTimeline,
  cameraTimeline,
  lineTimeline,
  secantLineTimeline,
  label2DTestTimeline,
  labelSymbolTestTimeline,
  functionAttentionTimeline,
  whiteboardTimeline,
  sceneConfigTimeline,
  demoDerivativeTimeline,
  demoQuadraticFormulaTimeline,
  demoIntegralAreaTimeline,
  demoUnitCircleSineTimeline,
  demoSineTimeline,
} from "../math/timeline/coreFunctionTests";
import type { Step } from "../math/types/steps";

export function resolveTestTimeline(prompt: string): Step[] | null {
  if (prompt === "normalize test") return normalizeSteps(rawTimeline);
  if (prompt === "area test") return shadeAreaTimeline;
  if (prompt === "point test") return pointAndLabelTestTimeline;
  if (prompt === "function test") return functionPlotTimeline;
  if (prompt === "tangent test") return slidingTangentTimeline;
  if (prompt === "camera test") return cameraTimeline;
  if (prompt === "line test") return lineTimeline;
  if (prompt === "secant test") return secantLineTimeline;
  if (prompt === "type test") return label2DTestTimeline;
  if (prompt === "symbol test") return labelSymbolTestTimeline;
  if (prompt === "function attention test") return functionAttentionTimeline;
  if (prompt === "whiteboard test") return whiteboardTimeline;
  if (prompt === "scene test") return sceneConfigTimeline;
  if (prompt === "derivative demo") return demoDerivativeTimeline;
  if (prompt === "quadratic demo") return demoQuadraticFormulaTimeline;
  if (prompt === "integral demo") return demoIntegralAreaTimeline;
  if (prompt === "unit circle demo") return demoUnitCircleSineTimeline;
  if (prompt === "sine demo") return demoSineTimeline;
  return null;
}