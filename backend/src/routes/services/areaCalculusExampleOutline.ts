/**
 * Example outline for "Explain where the idea of area / calculus comes from".
 * First 3 steps unchanged; steps 4–6 humanized to finish the story.
 */
export const areaCalculusExampleOutline = [
  {
    subtitle:
      "My goal is for you to come away from this feeling like you could have invented calculus. That is, we'll cover core ideas in a way that makes clear where they actually come from and what they really mean, using an all-around visual approach. Inventing math is no joke — there's a difference between being told why something makes sense and actually generating it from scratch. But at all points I want you to think: if you were an early mathematician pondering these ideas and drawing the right diagrams, does it feel reasonable that you could have stumbled upon these truths yourself?",
    visualGoal: "Add nothing.",
    pauseDuration: "long",
  },
  {
    subtitle:
      "Contemplating this and leaving yourself open to generalizing the tools you use along the way can lead you to a glimpse of three big ideas: integrals, derivatives, and the fact that they are opposites. But the story of finding area starts more simply: just you, and a circle. To be concrete, let's say the radius is 1.",
    visualGoal: "Add nothing.",
    pauseDuration: "long",
  },
  {
    subtitle:
      "If you weren't worried about the exact area and just wanted to estimate it, one way you might go about it is to chop the circle into smaller pieces whose areas are easier to approximate, then add up the results. There are many ways you might go about this, each of which may lead to its own interesting line of reasoning.",
    visualGoal: "Add f1 (top half of unit circle, e.g. y = sqrt(1-x*x) for x in [-1,1]). Add area1 under it from x=-1 to x=1.",
    pauseDuration: "medium",
  },
  {
    subtitle:
      "So you slice the region under the curve into thin vertical strips—like cutting a loaf of bread. Each strip is so thin it's almost a rectangle: the width is a small step along the horizontal, and the height is the height of the curve at that spot. So the area of one strip is roughly width times height. Add up all the strips and you get an estimate for the area under the curve. Use more strips—thinner strips—and the estimate gets better. Imagine using more and more strips: that sum gets closer and closer to the true area. That process—chop into smaller and smaller pieces, add them up, and ask what number that sum is heading toward—is exactly what mathematicians call an integral. So the integral is just the name for this idea: the area under a curve.",
    visualGoal: "Keep f1 and area1. Add lbl1 with text 'area under curve'.",
    whiteboardGoal: "Show: area ≈ sum of (width × height); in the limit → integral",
    pauseDuration: "long",
  },
  {
    subtitle:
      "The other big idea in calculus is the derivative—it's about slope. How steep is a curve at a single point? You get that by zooming in, looking at two nearby points, rise over run, then imagining those points getting closer and closer. The limit of that slope is the derivative. So we have two ideas: the integral, which adds up little pieces to get area, and the derivative, which measures slope at a point. They sound different—one is summing, one is zooming in—but they're opposites. If you take the function that gives you the area under the curve so far, and you ask how fast that area is growing as you move right, you get back the height of the curve. So the derivative of the area gives you the curve. That's why the two questions—what's the area, and what's the slope—turn out to be two sides of the same story.",
    visualGoal: "Keep graph as is.",
    pauseDuration: "long",
  },
  {
    subtitle:
      "So that's where the idea of area and calculus comes from. You start with a simple question—how do you find the area under a curve?—and the answer is: chop it into thin pieces, add them up, and take the limit. That's the integral. The derivative is the other half: slope and rate of change. Together they're calculus, and the fact that they're opposites is what makes the whole thing fit together.",
    visualGoal: "Add nothing.",
    pauseDuration: "long",
  },
];
