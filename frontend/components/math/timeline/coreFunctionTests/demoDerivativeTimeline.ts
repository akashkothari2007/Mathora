import { Step } from "../../types/steps";

export const demoDerivativeTimeline: Step[] = [
  {
    subtitle:
      "I want you to feel what a derivative really is: the slope of the curve right at a single point.",
    pauseDuration: "long",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
    actions: [],
  },
  {
    subtitle:
      "We'll use the simple parabola y = x squared, and focus on what happens at x = 1.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [0, 0, 0],
      height: 6,
    },
    whiteboardLines: ["y = x^2"],
    actions: [
      {
        type: "add",
        object: {
          id: "f1",
          type: "function",
          props: {
            f: (x: number) => x * x,
            xmin: -3,
            xmax: 3,
            color: "#22c55e",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "At x = 1, the curve passes through the point (1, 1). Let's mark that point so we can talk about its slope.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1, 1, 0],
      height: 4,
    },
    whiteboardLines: ["x = 1", "f(1) = 1"],
    actions: [
      {
        type: "add",
        object: {
          id: "pt1",
          type: "point",
          props: {
            position: { x: 1, y: 1 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl1",
          type: "label",
          props: {
            text: "(1, 1)",
            position: { x: 1.1, y: 0.35 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "One way to approximate the slope at x = 1 is to compare it to another point, say x = 2, and draw the secant line between them.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1.5, 2.5, 0],
      height: 5,
    },
    whiteboardLines: [
      "m_{\\text{avg}} = \\frac{f(2) - f(1)}{2 - 1}",
      "= \\frac{4 - 1}{1} = 3",
    ],
    actions: [
      {
        type: "add",
        object: {
          id: "pt2",
          type: "point",
          props: {
            position: { x: 2, y: 4 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "sec1",
          type: "secantLine",
          props: {
            f: (x: number) => x * x,
            startX: 1,
            endX: 2,
            color: "#60a5fa",
            lineWidth: 2,
            extension: 2.5,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Now shrink the gap: move the second point closer to x = 1 so the secant tilts toward the true tangent line.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1, 1, 0],
      height: 3.5,
    },
    whiteboardLines: [
      "m_{\\text{tan}} = \\lim_{h \\to 0} \\frac{f(1+h) - f(1)}{h}",
    ],
    actions: [
      {
        type: "update",
        id: "sec1",
        props: {
          endX: 1.3,
        },
      },
      {
        type: "update",
        id: "pt2",
        props: {
          animateTo: { x: 1.3, y: 1.3 * 1.3 },
          animateDuration: 1.5,
        },
      },
      {
        type: "add",
        object: {
          id: "tan1",
          type: "slidingTangent",
          props: {
            f: (x: number) => x * x,
            startX: 0.5,
            endX: 1.5,
            duration: 3,
            color: "#a855f7",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "For y = x squared, the derivative is 2x, so at x = 1 the true tangent slope is 2. Let's show that final tangent and its value.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1, 1, 0],
      height: 3,
    },
    whiteboardLines: ["f'(x) = 2x", "f'(1) = 2"],
    actions: [
      {
        type: "remove",
        id: "sec1",
      },
      {
        type: "update",
        id: "tan1",
        props: {
          startX: 0.2,
          endX: 1.8,
          duration: 1.2,
        },
      },
      {
        type: "add",
        object: {
          id: "lbl2",
          type: "label",
          props: {
            text: "slope = 2",
            position: { x: 1.4, y: 2.2 },
            color: "#a855f7",
            fontSize: 0.36,
          },
        },
      },
    ],
  },
];

