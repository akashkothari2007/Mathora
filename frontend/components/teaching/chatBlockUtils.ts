import type { ChatBlock } from "../math/timeline/TimelineController";

/** Index of the first character after the next sentence end (. ! ? or newline) at or after start. */
export function nextSentenceEnd(text: string, start: number): number {
  const len = text.length;
  for (let i = start; i < len; i++) {
    const c = text[i];
    if (c === "." || c === "!" || c === "?" || c === "\n") return i + 1;
  }
  return len;
}

/** Build chat blocks for a completed step in display order: text segment, wb, text segment, wb, ... */
export function buildBlocksForCompletedStep(
  subtitle: string,
  whiteboardLines: string[],
  whiteboardAtIndices?: number[]
): ChatBlock[] {
  const len = subtitle.length;
  const n = whiteboardLines.length;
  if (n === 0) {
    return subtitle.trim() ? [{ type: "subtitle", text: subtitle }] : [];
  }
  const useAtIndices =
    whiteboardAtIndices != null &&
    whiteboardAtIndices.length === n &&
    whiteboardAtIndices.every((i) => i >= 0 && i <= len);
  const sorted =
    useAtIndices && whiteboardAtIndices
      ? whiteboardAtIndices
          .map((idx, i) => ({
            displayAt: nextSentenceEnd(subtitle, idx),
            latex: whiteboardLines[i],
          }))
          .sort((a, b) => a.displayAt - b.displayAt)
      : null;
  const breakPoints: number[] =
    sorted != null
      ? [0, ...sorted.map((s) => s.displayAt), len]
      : Array.from({ length: n + 2 }, (_, i) => Math.round((i / (n + 1)) * len));
  const latexBySegment = sorted != null ? sorted.map((s) => s.latex) : whiteboardLines;
  const blocks: ChatBlock[] = [];
  for (let i = 0; i <= n; i++) {
    const start = breakPoints[i];
    const end = Math.max(breakPoints[i + 1] ?? len, start);
    const segmentText = subtitle.slice(start, end);
    blocks.push({ type: "subtitle", text: segmentText });
    if (i < n) blocks.push({ type: "whiteboard", latex: latexBySegment[i] });
  }
  return blocks;
}
