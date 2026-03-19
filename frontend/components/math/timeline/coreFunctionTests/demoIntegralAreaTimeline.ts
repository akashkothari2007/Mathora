import { Step } from "../../types/steps";

export const demoIntegralAreaTimeline: Step[] = [
  {
    subtitle:
      "I want you to see an integral as area under a curve, starting with something friendly: y = x on the interval [0, 4].",
    pauseDuration: "long",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
    cameraTarget: {
      center: [2, 2, 0],
      height: 6,
    },
    whiteboardLines: ["y = x\\ \\text{on}\\ [0,4]"],
    actions: [
      {
        type: "add",
        object: {
          id: "f_line",
          type: "function",
          props: {
            f: (x: number) => x,
            xmin: 0,
            xmax: 4,
            color: "#22c55e",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "The definite integral from 0 to 4 of y = x is the area of a simple triangle under this line.",
    pauseDuration: "medium",
    whiteboardLines: [
      "\\int_0^4 x\\,dx = \\text{area under } y = x",
      "base = 4,\\ height = 4",
    ],
    actions: [
      {
        type: "add",
        object: {
          id: "area_tri",
          type: "area",
          props: {
            f: (x: number) => x,
            g: (x: number) => 0,
            xmin: 0,
            xmax: 4,
            color: "#60a5fa",
            opacity: 0.35,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Compute that triangle's area directly, then compare it to the value of the integral.",
    pauseDuration: "medium",
    whiteboardLines: [
      "A = \\tfrac{1}{2} \\cdot \\text{base} \\cdot \\text{height}",
      "A = \\tfrac{1}{2} \\cdot 4 \\cdot 4 = 8",
    ],
    actions: [],
  },
  {
    subtitle:
      "Now do it the calculus way: use antiderivatives to find the same value for the integral.",
    pauseDuration: "medium",
    whiteboardLines: [
      "\\int_0^4 x\\,dx = \\left. \\tfrac{1}{2}x^2 \\right|_0^4",
      "= \\tfrac{1}{2} \\cdot 16 - 0 = 8",
    ],
    actions: [],
  },
  {
    subtitle:
      "To really feel it, let's morph the area into something less symmetric: the region under y = x^2 from 0 to 2.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [1.5, 2, 0],
      height: 6,
    },
    whiteboardLines: ["\\int_0^2 x^2\\,dx"],
    actions: [
      {
        type: "add",
        object: {
          id: "f_parabola",
          type: "function",
          props: {
            f: (x: number) => x * x,
            xmin: 0,
            xmax: 2,
            color: "#a855f7",
            lineWidth: 2,
          },
        },
      },
      {
        type: "update",
        id: "area_tri",
        props: {
          animateTo: {
            f: (x: number) => x * x,
            g: (x: number) => 0,
            xmin: 0,
            xmax: 2,
          },
          animateDuration: 1.2,
        },
      },
    ],
  },
  {
    subtitle:
      "Again, compute the integral with an antiderivative and notice how the shaded region now has a curved top instead of a straight line.",
    pauseDuration: "medium",
    whiteboardLines: [
      "\\int_0^2 x^2\\,dx = \\left. \\tfrac{1}{3}x^3 \\right|_0^2",
      "= \\tfrac{1}{3} \\cdot 8 - 0 = \\tfrac{8}{3}",
    ],
    actions: [],
  },
];

