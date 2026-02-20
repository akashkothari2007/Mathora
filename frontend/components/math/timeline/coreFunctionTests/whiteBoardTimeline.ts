import { Step } from "../../types/steps";

export const whiteboardTimeline: Step[] = [
  {
    subtitle: "Adding some random lines to the whiteboard.",
    whiteboardLines: [
      String.raw`y = x^2 + 3x - 2`,
      String.raw`\text{Let's solve this equation}`,
    ],
  },
  {
    subtitle: "Adding more lines.",
    whiteboardLines: [
      String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
      String.raw`\text{Using the quadratic formula}`,
    ],
  },
  {
    subtitle: "One more line.",
    whiteboardLines: [
      String.raw`\text{The solution is } x = 1 \text{ or } x = -2`,
    ],
  },
];
