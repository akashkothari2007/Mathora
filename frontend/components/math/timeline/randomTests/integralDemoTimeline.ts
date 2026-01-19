import { Action } from "../../types/actions";

export const integralDemoTimeline: Action[] = [
  // 1) Introduce f(x) = x^2 on [0, 3]
  {
    type: "add",
    object: {
      id: "f_main",
      type: "function",
      props: {
        f: (x: number) => x * x,
        xmin: 0,
        xmax: 3,
        color: "cyan",
        lineWidth: 2,
      },
    },
    time: 2,
    subtitle: "Let’s look at the function y = x² on the interval [0, 3].",
    target: {
      position: [0, 0, 16],
      duration: 1.5,
    },
  },

  // 2) Label the curve
  {
    type: "add",
    object: {
      id: "label_f_main",
      type: "label",
      props: {
        text: "y = x²",
        position: { x: 2.4, y: 5.2 },
      },
    },
    time: 1.5,
    subtitle: "This curve gets steeper as x increases.",
  },

  // 3) Add a point at x = 1
  {
    type: "add",
    object: {
      id: "p_a",
      type: "point",
      props: {
        position: { x: 1, y: 1 },
        color: "orange",
        size: 0.1,
      },
    },
    time: 1.5,
    subtitle: "We’ll study the slope at the point (1, 1).",
    target: {
      position: [1, 1.2, 13],
      duration: 1.2,
    },
  },

  // 4) Label a = 1 below the point
  {
    type: "add",
    object: {
      id: "label_a",
      type: "label",
      props: {
        text: "a = 1",
        position: { x: 1, y: -0.6 },
      },
    },
    time: 1,
    subtitle: "Let’s call this x-value a = 1.",
  },

  // 5) Add a second point for secant at x = 3
  {
    type: "add",
    object: {
      id: "p_b",
      type: "point",
      props: {
        position: { x: 3, y: 9 },
        color: "magenta",
        size: 0.1,
      },
    },
    time: 1.5,
    subtitle: "Now pick another point to the right, at x = 3.",
  },

  // 6) Add a secant line through (1,1) and (3,9)
  {
    type: "add",
    object: {
      id: "secant",
      type: "function",
      props: {
        // slope m = (9 - 1)/(3 - 1) = 4
        f: (x: number) => 4 * (x - 1) + 1,
        xmin: 1,
        xmax: 3,
        color: "red",
        lineWidth: 2,
      },
    },
    time: 1.5,
    subtitle: "The red line is the secant line: its slope is the average rate of change.",
  },

  // 7) Move the right point closer: x = 2
  {
    type: "update",
    id: "p_b",
    props: {
      position: { x: 2, y: 4 },
    },
    time: 2,
    subtitle: "Now move the second point closer to a: from x = 3 to x = 2.",
  },

  // 8) Update secant line to go through (1,1) and (2,4)
  {
    type: "update",
    id: "secant",
    props: {
      // slope m = (4 - 1)/(2 - 1) = 3
      g: (x: number) => 3 * (x - 1) + 1,
      animateDuration: 1.5,
    },
    time: 0,
    subtitle: "The secant line rotates as the second point moves.",
  },

  // 9) Move the right point even closer: x = 1.5
  {
    type: "update",
    id: "p_b",
    props: {
      position: { x: 1.5, y: 1.5 * 1.5 },
    },
    time: 2,
    subtitle: "Bring the second point even closer: x = 1.5.",
  },

  // 10) Update secant line again to new slope ~2.5
  {
    type: "update",
    id: "secant",
    props: {
      // slope m = (1.5² - 1)/(1.5 - 1) = (2.25 - 1)/0.5 = 2.5
      g: (x: number) => 2.5 * (x - 1) + 1,
      animateDuration: 1.2,
    },
    time: 0,
    subtitle: "The secant is now very close to the tangent line at x = 1.",
  },

  // 11) Remove the second point; keep focus on a
  {
    type: "remove",
    id: "p_b",
    time: 2,
    subtitle: "Now imagine the second point sliding all the way into a.",
  },

  // 12) Replace secant with a true tangent line at x = 1
  {
    type: "update",
    id: "secant",
    props: {
      // derivative of x² is 2x ⇒ at x=1, slope = 2
      g: (x: number) => 2 * (x - 1) + 1,
      animateDuration: 1.5,
    },
    time: 0,
    subtitle: "In the limit, the secant becomes the tangent line at x = 1.",
  },

  // 13) Add a sliding tangent that moves along the curve
  {
    type: "add",
    object: {
      id: "t_slide",
      type: "slidingTangent",
      props: {
        f: (x: number) => x * x,
        startX: 0.5,
        endX: 2,
        color: "white",
        lineWidth: 2,
        duration: 3.5,
      },
    },
    time: 3,
    subtitle: "Let’s watch the tangent line slide along y = x².",
    target: {
      position: [1.4, 2, 12],
      duration: 1.5,
    },
  },

  // 14) Add a point that follows the curve with the tangent
  {
    type: "add",
    object: {
      id: "p_slide",
      type: "point",
      props: {
        position: { x: 0.5, y: 0.5 * 0.5 },
        color: "yellow",
        size: 0.09,
        followFunction: {
          f: (x: number) => x * x,
          startX: 0.5,
          endX: 2,
          duration: 3.5,
        },
      },
    },
    time: 0,
    subtitle: "At each x, the tangent’s slope is the instantaneous rate of change.",
  },

  // 15) Pause and summarize the tangent/derivative idea
  {
    type: "wait",
    time: 3.5,
    subtitle: "The derivative at a point is exactly the slope of the tangent at that point.",
  },

  // 16) Introduce the derivative function explicitly
  {
    type: "add",
    object: {
      id: "f_deriv",
      type: "function",
      props: {
        // start it as a copy of x², then morph it
        f: (x: number) => x * x,
        xmin: 0,
        xmax: 3,
        color: "gold",
        lineWidth: 2,
      },
    },
    time: 2,
    subtitle: "Now we’ll build the derivative function of y = x².",
    target: {
      position: [0.8, 1.5, 15],
      duration: 1.5,
    },
  },

  // 17) Morph this copy into y = 2x
  {
    type: "update",
    id: "f_deriv",
    props: {
      g: (x: number) => 2 * x,
      animateDuration: 2.5,
    },
    time: 1,
    subtitle: "The derivative of x² is 2x, which gives the slope at every x.",
  },

  // 18) Add a label for the derivative curve
  {
    type: "add",
    object: {
      id: "label_f_deriv",
      type: "label",
      props: {
        text: "y = 2x (derivative)",
        position: { x: 2.2, y: 3.8 },
      },
    },
    time: 2.5,
    subtitle: "This line y = 2x tells you the tangent slope for each point on y = x².",
  },

  // 19) Final zoom out and wrap-up
  {
    type: "wait",
    time: 4,
    subtitle:
      "Summary: secant slopes approach the tangent slope, and the derivative function collects all those slopes.",
    target: {
      position: [0, 0, 18],
      duration: 2,
    },
  },
];