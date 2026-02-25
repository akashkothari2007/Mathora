/**
 * Example outline for "Explain the derivative of x²".
 * Limit steps (5–6) rewritten to be human and 3B1B-style; rest unchanged.
 */
export const derivativeOfXSquaredExample = [
  {
    subtitle:
      "The derivative is one of those ideas in math that seems intimidating at first, but once you really see where it comes from, it feels almost inevitable. My goal here is not just to show you the mechanics of finding the derivative of x², but to make you feel like you could have invented this idea yourself. All we need to start with is a parabola and a simple question: how steep is it at any given point?",
    visualGoal: "Add f1 for x*x from x=-2 to x=2.",
    pauseDuration: "long",
  },
  {
    subtitle:
      "Let's think about what 'steepness' even means. If you zoom in really close on any smooth curve, it starts to look like a straight line—that tilt is what we're after. To measure it we need a concrete spot. So pick a point on the curve—say when x equals 1. We're on the curve y equals x squared, so when x is 1, the height is 1 squared, which is 1. So our first point is at (1, 1). The question we're asking: how steep is the curve right there?",
    visualGoal: "Add pt1 at (1, 1). Add lbl1 near pt1 with text 'x=1'.",
    pauseDuration: "medium",
  },
  {
    subtitle:
      "Here's the key insight: we can't measure steepness at a single point alone—we need two points to draw a line and get a slope. So let's pick a second point a small step to the right. Call that step h. So the second point has x equals 1 plus h. Since we're still on the curve y equals x squared, its height is (1+h) squared. So we have two points: first at (1, 1²) and second at (1+h, (1+h)²). The slope of the line between them is rise over run. The rise is how much the height changed: (1+h)² minus 1². The run is how much x changed: h. So slope equals rise over run: (1+h)² minus 1², all over h.",
    visualGoal: "Add pt2 at (1.5, 2.25). Add ln1 from pt1 to pt2. Add lbl2 near ln1 with text 'secant line'.",
    whiteboardGoal: "Show slope = rise/run = [(1+h)² - 1²] / h",
    pauseDuration: "long",
  },
  {
    subtitle:
      "Now here's where it gets interesting. That slope we just calculated is only an approximation—it's the average steepness between our two points, not the exact steepness at x equals 1. But what if we make h smaller? As h shrinks, that second point slides closer and closer to the first, and our secant line starts to look more and more like the tangent line—the line that just barely kisses the curve at that one point.",
    visualGoal: "Animate pt2 sliding from (1.5, 2.25) toward (1, 1). Show ln1 rotating to become tangent.",
    pauseDuration: "long",
  },
  {
    subtitle:
      "So the derivative at that point is really just: what does that slope get closer and closer to as the second point gets closer and closer to the first? Mathematicians have a word for that—they call it a limit. The notation can look a bit weird, and it was invented so long ago that I wouldn't get too hung up on the symbols. The idea is simple: we're asking what number our slope is heading toward. Remember our slope was rise over run: (1+h)² minus 1², all over h. We're just simplifying that fraction. (1+h)² is 1 + 2h + h², so the top becomes 1 + 2h + h² minus 1. The 1s cancel, leaving 2h + h². So we have 2h + h² over h. Factor an h out of the top: h times (2 + h), over h. The h cancels, and we're left with 2 + h.",
    visualGoal: "Keep tangent line at (1,1).",
    whiteboardGoal: "Show the full derivation step by step: [(1+h)² - 1²]/h → [2h + h²]/h → 2 + h",
    pauseDuration: "long",
  },
  {
    subtitle:
      "Now here's the beautiful part. When we imagine h getting tinier and tinier—and that's all we mean by a limit, what that number is heading toward—that 2 + h gets closer and closer to just 2. So the slope of the tangent line at x equals 1 is exactly 2. That's the derivative at that point. And notice: we didn't just memorize a rule. We discovered it by thinking carefully about what slope means when you zoom in.",
    visualGoal: "Add lbl3 with text 'slope = 2' near the tangent line.",
    whiteboardGoal: "Show: as h → 0, slope → 2",
    pauseDuration: "medium",
  },
  {
    subtitle:
      "Of course there's nothing special about x equals 1. We could do this same process for any point on the parabola. If we generalize it, starting with any x instead of just 1, we get the derivative formula: the slope at any x is 2x. That's why the derivative of x² is 2x—it tells us the instantaneous rate of change at every point along the curve. And that idea, that limit of smaller and smaller slopes, is the heart of calculus.",
    visualGoal: "Add f2 for 2*x (the derivative). Add lbl4 with text \"f'(x) = 2x\".",
    whiteboardGoal: "Show general formula: d/dx[x²] = 2x",
    pauseDuration: "long",
  },
];
