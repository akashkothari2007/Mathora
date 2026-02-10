import { normalizeSteps } from "../math/timeline/NormalizeTimeline";
import { rawTimeline } from "../math/timeline/randomTests/stringFunctions";
import {
  pointAndLabelTestTimeline,
  functionPlotTimeline,
  shadeAreaTimeline,
  slidingTangentTimeline,
  cameraTimeline,
  lineTimeline,
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
  return null;
}