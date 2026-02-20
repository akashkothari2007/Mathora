import katex from "katex";

const FALLBACK_LINE = "\\text{Formula could not be displayed}";

/**
 * Apply one round of common LaTeX fixes (missing backslashes, etc.).
 * Kept small and documented to avoid over-correcting.
 */
function applyLatexFixes(latex: string): string {
  let s = latex;
  // pm -> \pm (word-boundary so we don't break "example")
  s = s.replace(/\bpm\b/g, "\\pm");
  // sqrt{ -> \sqrt{
  s = s.replace(/sqrt\{/g, "\\sqrt{");
  // frac{ -> \frac{
  s = s.replace(/frac\{/g, "\\frac{");
  // Fix unclosed \sqrt{...}: from first \sqrt{, count braces; if more { than }, append }
  const sqrtOpen = s.indexOf("\\sqrt{");
  if (sqrtOpen !== -1) {
    let depth = 0;
    for (let i = sqrtOpen; i < s.length; i++) {
      if (s[i] === "{") depth++;
      else if (s[i] === "}") depth--;
    }
    if (depth > 0) s = s + "}".repeat(depth);
  }
  return s;
}

/**
 * Validate one whiteboard line with KaTeX; if it throws, try applyLatexFixes once and retry.
 * If still invalid, return a safe fallback line.
 */
function validateAndFixOneLine(line: string): string {
  try {
    katex.renderToString(line, { throwOnError: true, displayMode: true });
    return line;
  } catch {
    const fixed = applyLatexFixes(line);
    try {
      katex.renderToString(fixed, { throwOnError: true, displayMode: true });
      return fixed;
    } catch {
      return FALLBACK_LINE;
    }
  }
}

/**
 * Validate and fix all whiteboard lines so they render with KaTeX.
 * Returns a new array; invalid lines are replaced with a safe fallback.
 */
export function validateAndFixWhiteboardLines(lines: string[]): string[] {
  if (!lines?.length) return lines ?? [];
  return lines.map(validateAndFixOneLine);
}
