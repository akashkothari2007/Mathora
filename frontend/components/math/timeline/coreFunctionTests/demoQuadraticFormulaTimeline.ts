import { Step } from "../../types/steps";

export const demoQuadraticFormulaTimeline: Step[] = [
  {
    subtitle:
      "Our goal is to solve the quadratic equation x^2 - 3x - 4 = 0 and really see what the roots mean on the graph.",
    pauseDuration: "long",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
    whiteboardLines: ["x^2 - 3x - 4 = 0"],
    actions: [],
  },
  {
    subtitle:
      "First, let's draw the graph of y = x^2 - 3x - 4 so we can see where it crosses the x-axis.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [0, -1, 0],
      height: 10,
    },
    whiteboardLines: ["y = x^2 - 3x - 4"],
    actions: [
      {
        type: "add",
        object: {
          id: "f1",
          type: "function",
          props: {
            f: (x: number) => x * x - 3 * x - 4,
            xmin: -4,
            xmax: 5,
            color: "#22c55e",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "The quadratic formula will give us the exact roots. Let's write it down and plug in a, b, and c for this equation.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [0, -1, 0],
      height: 10,
    },
    whiteboardLines: [
      "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}",
      "a = 1,\\ b = -3,\\ c = -4",
    ],
    actions: [],
  },
  {
    subtitle:
      "Now compute the discriminant b^2 - 4ac step by step so we can see how many roots we should expect.",
    pauseDuration: "medium",
    whiteboardLines: [
      "D = b^2 - 4ac",
      "D = (-3)^2 - 4(1)(-4) = 9 + 16 = 25",
    ],
    actions: [],
  },
  {
    subtitle:
      "With D = 25, the square root is 5. That gives us two exact roots; let's write them and then mark them on the graph.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1.5, -1, 0],
      height: 8,
    },
    whiteboardLines: [
      "x = \\frac{-b \\pm \\sqrt{D}}{2a} = \\frac{3 \\pm 5}{2}",
      "x = 4,\\ x = -1",
    ],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_root1",
          type: "point",
          props: {
            position: { x: 4, y: 0 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_root2",
          type: "point",
          props: {
            position: { x: -1, y: 0 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_root1",
          type: "label",
          props: {
            text: "x = 4",
            position: { x: 4.1, y: -0.8 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_root2",
          type: "label",
          props: {
            text: "x = -1",
            position: { x: -1.6, y: -0.8 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Finally, notice how the graph crosses the x-axis exactly at x = 4 and x = -1. Those algebraic roots are exactly the x-intercepts of the parabola.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1.5, -1, 0],
      height: 8,
    },
    whiteboardLines: ["x = 4,\\ x = -1"],
    actions: [],
  },
];

