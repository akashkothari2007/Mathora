import { Step } from "../../types/steps";

export const demoUnitCircleSineTimeline: Step[] = [
  {
    subtitle:
      "I want you to see sine not just as a wave, but as the y-coordinate of a point moving around the unit circle.",
    pauseDuration: "long",
    sceneConfig: {
      mode: "unitCircle",
      unitCircle: {
        labels: true,
        units: "radians",
      },
    },
    cameraTarget: {
      center: [0, 0, 0],
      height: 4,
      width: 4,
    },
    whiteboardLines: ["\\text{Unit circle: radius }1", "\\sin(\\theta) = y"],
    actions: [],
  },
  {
    subtitle:
      "Let's focus on a single angle, say \\theta = \\tfrac{\\pi}{6}. We'll mark the point on the circle and its sine value on the y-axis.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [0, 0, 0],
      height: 4,
      width: 4,
    },
    whiteboardLines: ["\\theta = \\tfrac{\\pi}{6}", "\\sin\\tfrac{\\pi}{6} = \\tfrac{1}{2}"],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_pi6",
          type: "point",
          props: {
            position: {
              x: Math.cos(Math.PI / 6),
              y: Math.sin(Math.PI / 6),
            },
            color: "#22c55e",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_pi6",
          type: "label",
          props: {
            text: "θ = π/6",
            position: { x: 0.9, y: 0.6 },
            color: "#22c55e",
            fontSize: 0.32,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_sin_pi6",
          type: "point",
          props: {
            position: { x: 0, y: 0.5 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_sin_pi6",
          type: "label",
          props: {
            text: "sin θ = 1/2",
            position: { x: -0.8, y: 0.8 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Now zoom out and switch to an axes view so we can plot the whole sine wave that comes from this circular motion.",
    pauseDuration: "medium",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 7,
    },
    whiteboardLines: ["y = \\sin x"],
    actions: [
      {
        type: "add",
        object: {
          id: "f_sin",
          type: "function",
          props: {
            f: (x: number) => Math.sin(x),
            xmin: 0,
            xmax: 2 * Math.PI,
            color: "#22c55e",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Mark a few key angles along the x-axis and their sine values on the graph so you can line them up with the unit circle in your head.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 7,
    },
    whiteboardLines: [
      "x = 0,\\ \\tfrac{\\pi}{2},\\ \\pi,\\ \\tfrac{3\\pi}{2},\\ 2\\pi",
      "\\sin 0 = 0,\\ \\sin \\tfrac{\\pi}{2} = 1,\\ \\sin \\pi = 0,\\dots",
    ],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_0",
          type: "point",
          props: {
            position: { x: 0, y: 0 },
            color: "#eab308",
            size: 0.11,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_pi2",
          type: "point",
          props: {
            position: { x: Math.PI / 2, y: 1 },
            color: "#eab308",
            size: 0.11,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_pi",
          type: "point",
          props: {
            position: { x: Math.PI, y: 0 },
            color: "#eab308",
            size: 0.11,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_3pi2",
          type: "point",
          props: {
            position: { x: (3 * Math.PI) / 2, y: -1 },
            color: "#eab308",
            size: 0.11,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "pt_2pi",
          type: "point",
          props: {
            position: { x: 2 * Math.PI, y: 0 },
            color: "#eab308",
            size: 0.11,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "Finally, notice how moving once around the circle from 0 to 2π exactly matches tracing out one full sine wave from x = 0 to x = 2π.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 7,
    },
    whiteboardLines: [
      "\\text{One circle turn} \\leftrightarrow \\text{one sine wave}",
    ],
    actions: [],
  },
];

