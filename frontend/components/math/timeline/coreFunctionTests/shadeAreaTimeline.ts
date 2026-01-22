import { Step } from "../../types/steps";

export const shadeAreaTimeline: Step[] = [
  {
    subtitle: "Start with y = 0.5x² on [-4, 4].",
    cameraTarget: null,
    actions: [
      {
        type: "add",
        object: {
          id: "f_area",
          type: "function",
          props: {
            f: (x: number) => 0.5 * x * x,
            xmin: -4,
            xmax: 4,
            color: "white",
            lineWidth: 2,
          },
        },
      },
    ],
  },

  {
    subtitle: "Shade the area between y = 0.5x² and the x-axis.",
    cameraTarget: null,
    actions: [
      {
        type: "add",
        object: {
          id: "area_under",
          type: "area",
          props: {
            f: (x: number) => 0.5 * x * x,
            xmin: -4,
            xmax: 4,
            color: "#22c55e",
            opacity: 0.35,
          },
        },
      },
    ],
  },

  {
    subtitle: "Zoom in: restrict shading to [-2, 2].",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "area_under",
        props: {
          animateTo: {
            f: (x: number) => 0.5 * x * x,
            xmin: -2,
            xmax: 2,
          },
          animateDuration: 0.3,
        },
      },
    ],
  },

  {
    subtitle: "Add the line y = x + 1.",
    cameraTarget: null,
    actions: [
      {
        type: "add",
        object: {
          id: "f_line",
          type: "function",
          props: {
            f: (x: number) => x + 1,
            xmin: -4,
            xmax: 4,
            color: "magenta",
            lineWidth: 2,
          },
        },
      },
    ],
  },

  {
    subtitle: "Now shade the region between y = 0.5x² and y = x + 1.",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "area_under",
        props: {
          animateTo: {
            f: (x: number) => 0.5 * x * x,
            g: (x: number) => x + 1,
            xmin: -0.73,
            xmax: 2.73,
          },
          animateDuration: 0.2,
        },
      },
    ],
  },

  {
    subtitle: "Move shading to the region between y = x + 1 and the x-axis.",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "area_under",
        props: {
          animateTo: {
            f: (x: number) => x + 1,
            g: (x: number) => 0,
            xmin: 0,
            xmax: 3,
          },
          animateDuration: 0.3,
        },
      },
    ],
  },

  {
    subtitle: "Add y = sin(x) in the background.",
    cameraTarget: null,
    actions: [
      {
        type: "add",
        object: {
          id: "f_sin",
          type: "function",
          props: {
            f: (x: number) => Math.sin(x),
            xmin: -3.14159265359,
            xmax: 3.14159265359,
            color: "cyan",
            lineWidth: 2,
          },
        },
      },
    ],
  },

  {
    subtitle: "Shading morphs to the area under y = sin(x).",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "area_under",
        props: {
          animateTo: {
            f: (x: number) => Math.sin(x),
            g: (x: number) => 0,
            xmin: -3.14159265359,
            xmax: 3.14159265359,
          },
          animateDuration: 0.4,
        },
      },
    ],
  },

  {
    subtitle: "Remove the shaded region.",
    cameraTarget: null,
    actions: [{ type: "remove", id: "area_under" }],
  },
  {
    subtitle: "Remove y = 0.5x².",
    cameraTarget: null,
    actions: [{ type: "remove", id: "f_area" }],
  },
  {
    subtitle: "Remove y = x + 1.",
    cameraTarget: null,
    actions: [{ type: "remove", id: "f_line" }],
  },
  {
    subtitle: "Clear y = sin(x) and reset.",
    cameraTarget: null,
    actions: [{ type: "remove", id: "f_sin" }],
  },
];