import { Step } from "../../types/steps";

const PI = 3.14159265359;

export const cameraTimeline: Step[] = [
  {
    subtitle: "Start with a curve, axes points, and labels.",
    cameraTarget: { center: [0, 0, 0], width: 18, height: 10, duration: 1.2 },
    actions: [
      {
        type: "add",
        object: {
          id: "f_cam_ref",
          type: "function",
          props: {
            f: (x: number) => Math.sin(x),
            xmin: -2 * PI,
            xmax: 2 * PI,
            color: "white",
            lineWidth: 2,
          },
        },
      },

      // reference points
      {
        type: "add",
        object: {
          id: "p_origin",
          type: "point",
          props: { position: { x: 0, y: 0 }, color: "white", size: 0.35 },
        },
      },
      {
        type: "add",
        object: {
          id: "p_left",
          type: "point",
          props: { position: { x: -PI, y: 0 }, color: "white", size: 0.28 },
        },
      },
      {
        type: "add",
        object: {
          id: "p_right",
          type: "point",
          props: { position: { x: PI, y: 0 }, color: "white", size: 0.28 },
        },
      },

      // labels (helps you verify label rendering too)
      {
        type: "add",
        object: {
          id: "lbl0",
          type: "label",
          props: { text: "0", position: { x: 0.15, y: -0.35 }, color: "white" },
        },
      },
      {
        type: "add",
        object: {
          id: "lblL",
          type: "label",
          props: { text: "−π", position: { x: -PI, y: -0.35 }, color: "white" },
        },
      },
      {
        type: "add",
        object: {
          id: "lblR",
          type: "label",
          props: { text: "π", position: { x: PI, y: -0.35 }, color: "white" },
        },
      },
    ],
  },

  {
    subtitle: "Fit tightly around the peak using center + height (tests height fit).",
    cameraTarget: { center: [PI / 2, 1, 0], height: 2.8, duration: 1.0 },
    actions: [],
  },

  {
    subtitle: "Keep the same height but pan right (tests pan while fit stays).",
    cameraTarget: { center: [PI, 0.2, 0], height: 2.8, duration: 1.0 },
    actions: [],
  },

  {
    subtitle: "Fit around the trough using center + height (tests y framing).",
    cameraTarget: { center: [-PI / 2, -1, 0], height: 2.8, duration: 1.0 },
    actions: [],
  },

  {
    subtitle: "Now fit by width instead (tests width fit + aspect behavior).",
    cameraTarget: { center: [0, 0, 0], width: 10, duration: 1.1 },
    actions: [],
  },

  {
    subtitle: "Zoom out to the full period using BOTH width + height (tests max(distW, distH)).",
    cameraTarget: { center: [0, 0, 0], width: 18, height: 7, duration: 1.2 },
    actions: [],
  },

  {
    subtitle: "Cinematic angle shot (position + center).",
    cameraTarget: { position: [10, 5, 18], center: [0, 0, 0], duration: 1.4 },
    actions: [],
  },

  {
    subtitle: "Opposite cinematic angle (position + center).",
    cameraTarget: { position: [-10, 4.5, 18], center: [0, 0, 0], duration: 1.4 },
    actions: [],
  },

  {
    subtitle: "End on a clean fitted view (center + width + height).",
    cameraTarget: { center: [0, 0, 0], width: 14, height: 6, duration: 1.2 },
    actions: [],
  },
];