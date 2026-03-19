import { Step } from "../../types/steps";

const TAU = 2 * Math.PI;
// Slightly past 2π so we can show the next crest at 5π/2 for the period segment
const XMAX_SIN = (5 * Math.PI) / 2;

export const demoSineTimeline: Step[] = [
  {
    subtitle:
      "We'll look at key parts of the sine wave, then see how it changes under simple transformations.",
    pauseDuration: "long",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: false,
        tickSpacing: 1,
      },
    },
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 7,
    },
    whiteboardLines: ["y = \\sin x"],
    actions: [],
  },
  {
    subtitle:
      "Here's one full period of y = sin(x) from 0 to 2π. Notice the wave goes up to 1 and down to -1.",
    speakSubtitle:
      "Here's one full period of y = sin x from 0 to 2 pi. Notice the wave goes up to 1 and down to -1.",
    pauseDuration: "medium",
    whiteboardLines: ["y = \\sin x", "\\text{one period: } 0 \\text{ to } 2\\pi"],
    actions: [
      {
        type: "add",
        object: {
          id: "f_sin",
          type: "function",
          props: {
            f: (x: number) => Math.sin(x),
            xmin: 0,
            xmax: XMAX_SIN,
            color: "#22c55e",
            lineWidth: 2,
          },
        },
      },
      { type: "add", object: { id: "axis_lbl_0", type: "label", props: { text: "0", position: { x: 0, y: -0.35 }, color: "rgba(255,255,255,0.8)", fontSize: 0.3 } } },
      { type: "add", object: { id: "axis_lbl_pi2", type: "label", props: { text: "π/2", position: { x: Math.PI / 2, y: -0.35 }, color: "rgba(255,255,255,0.8)", fontSize: 0.3 } } },
      { type: "add", object: { id: "axis_lbl_pi", type: "label", props: { text: "π", position: { x: Math.PI, y: -0.35 }, color: "rgba(255,255,255,0.8)", fontSize: 0.3 } } },
      { type: "add", object: { id: "axis_lbl_3pi2", type: "label", props: { text: "3π/2", position: { x: (3 * Math.PI) / 2, y: -0.35 }, color: "rgba(255,255,255,0.8)", fontSize: 0.3 } } },
      { type: "add", object: { id: "axis_lbl_2pi", type: "label", props: { text: "2π", position: { x: TAU, y: -0.35 }, color: "rgba(255,255,255,0.8)", fontSize: 0.3 } } },
    ],
  },
  {
    subtitle:
      "The highest point is the crest. For sin(x) it occurs at x = π/2 with value 1.",
    speakSubtitle:
      "The highest point is the crest. For sin x it occurs at x = pi over 2 with value 1.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI / 2, 0.5, 0],
      height: 3,
      width: 3,
    },
    whiteboardLines: ["\\text{crest at } x = \\tfrac{\\pi}{2}", "y = 1"],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_crest",
          type: "point",
          props: {
            position: { x: Math.PI / 2, y: 1 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_crest",
          type: "label",
          props: {
            text: "crest",
            position: { x: Math.PI / 2 + 0.3, y: 1.4 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "The lowest point is the trough. For sin(x) it's at x = 3π/2 with value -1.",
    speakSubtitle:
      "The lowest point is the trough. For sin x it's at x = 3 pi over 2 with value -1.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [(3 * Math.PI) / 2, -0.5, 0],
      height: 3,
      width: 3,
    },
    whiteboardLines: ["\\text{trough at } x = \\tfrac{3\\pi}{2}", "y = -1"],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_trough",
          type: "point",
          props: {
            position: { x: (3 * Math.PI) / 2, y: -1 },
            color: "#60a5fa",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_trough",
          type: "label",
          props: {
            text: "trough",
            position: { x: (3 * Math.PI) / 2 + 0.35, y: -1.5 },
            color: "#60a5fa",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "The distance from crest to crest—or trough to trough—is the period. For sin(x) the period is 2π.",
    speakSubtitle:
      "The distance from crest to crest, or trough to trough, is the period. For sin x the period is 2 pi.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 8,
    },
    whiteboardLines: ["\\text{period} = 2\\pi", "\\text{amplitude} = 1"],
    actions: [],
  },
  {
    subtitle:
      "We'll mark the next crest and draw the segment between them. That horizontal distance is exactly one period: 2π.",
    speakSubtitle:
      "We'll mark the next crest and draw the segment between them. That horizontal distance is exactly one period: 2 pi.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0.5, 0],
      height: 4,
      width: 8,
    },
    whiteboardLines: ["\\text{period} = 2\\pi"],
    actions: [
      {
        type: "add",
        object: {
          id: "pt_crest2",
          type: "point",
          props: {
            position: { x: (5 * Math.PI) / 2, y: 1 },
            color: "#eab308",
            size: 0.12,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "line_period",
          type: "line",
          props: {
            start: { x: Math.PI / 2, y: 1 },
            end: { x: (5 * Math.PI) / 2, y: 1 },
            color: "#eab308",
            lineWidth: 1.5,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "lbl_period",
          type: "label",
          props: {
            text: "period = 2π",
            position: { x: Math.PI, y: 1.35 },
            color: "#eab308",
            fontSize: 0.32,
          },
        },
      },
    ],
  },
  {
    subtitle:
      "First transformation: sin(2x). The 2 inside compresses the wave horizontally—the period halves to π.",
    speakSubtitle:
      "First transformation: sin of 2 x. The 2 inside compresses the wave horizontally—the period halves to pi.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI / 2, 0, 0],
      height: 4,
      width: 5,
    },
    whiteboardLines: ["y = \\sin(2x)", "\\text{period} = \\pi \\text{ (half of } 2\\pi)"],
    actions: [
      { type: "remove", id: "pt_crest" },
      { type: "remove", id: "lbl_crest" },
      { type: "remove", id: "pt_crest2" },
      { type: "remove", id: "line_period" },
      { type: "remove", id: "lbl_period" },
      { type: "remove", id: "pt_trough" },
      { type: "remove", id: "lbl_trough" },
      { type: "remove", id: "axis_lbl_0" },
      { type: "remove", id: "axis_lbl_pi2" },
      { type: "remove", id: "axis_lbl_pi" },
      { type: "remove", id: "axis_lbl_3pi2" },
      { type: "remove", id: "axis_lbl_2pi" },
      {
        type: "update",
        id: "f_sin",
        props: {
          f: (x: number) => Math.sin(2 * x),
        },
      },
    ],
  },
  {
    subtitle:
      "Second transformation: 2·sin(x). The 2 outside stretches the wave vertically—amplitude doubles to 2.",
    speakSubtitle:
      "Second transformation: 2 times sin x. The 2 outside stretches the wave vertically—amplitude doubles to 2.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 5,
      width: 7,
    },
    whiteboardLines: ["y = 2\\sin(x)", "\\text{amplitude} = 2"],
    actions: [
      {
        type: "update",
        id: "f_sin",
        props: {
          f: (x: number) => 2 * Math.sin(x),
        },
      },
    ],
  },
  {
    subtitle:
      "Third transformation: sin(x + π/2). Adding inside shifts the wave left by π/2—same shape, different phase.",
    speakSubtitle:
      "Third transformation: sin of x plus pi over 2. Adding inside shifts the wave left by pi over 2—same shape, different phase.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 0, 0],
      height: 4,
      width: 7,
    },
    whiteboardLines: ["y = \\sin\\left(x + \\tfrac{\\pi}{2}\\right)", "\\text{phase shift left } \\tfrac{\\pi}{2}"],
    actions: [
      {
        type: "update",
        id: "f_sin",
        props: {
          f: (x: number) => Math.sin(x + Math.PI / 2),
        },
      },
    ],
  },
  {
    subtitle:
      "Last transformation: add 1 at the end. 2·sin(x + π/2) + 1 shifts the whole wave up by 1—same shape, new center line.",
    speakSubtitle:
      "Last transformation: add 1 at the end. 2 times sin of x plus pi over 2, plus 1, shifts the whole wave up by 1—same shape, new center line.",
    pauseDuration: "medium",
    cameraTarget: {
      center: [Math.PI, 1, 0],
      height: 5,
      width: 7,
    },
    whiteboardLines: ["y = 2\\sin\\left(x + \\tfrac{\\pi}{2}\\right) + 1", "\\text{vertical shift up } 1"],
    actions: [
      {
        type: "update",
        id: "f_sin",
        props: {
          f: (x: number) => 2 * Math.sin(x + Math.PI / 2) + 1,
        },
      },
    ],
  },
  {
    subtitle:
      "So: something times x changes the period; something times sin(x) changes the amplitude; adding inside shifts the phase; adding outside shifts the graph up or down.",
    speakSubtitle:
      "So: something times x changes the period; something times sin x changes the amplitude; adding inside shifts the phase; adding outside shifts the graph up or down.",
    pauseDuration: "medium",
    whiteboardLines: [
      "\\sin(Bx) \\Rightarrow \\text{period} = \\tfrac{2\\pi}{B}",
      "A\\sin(x) \\Rightarrow \\text{amplitude} = |A|",
      "\\sin(x + C) \\Rightarrow \\text{phase shift}",
      "\\ldots + D \\Rightarrow \\text{vertical shift}",
    ],
    actions: [],
  },
];
