import { Action } from "../../types/actions";

export const shadeAreaTimeline: Action[] = [
  // 1) Add base parabola f(x) = 0.5x²
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
    time: 2,
    subtitle: "Start with y = 0.5x² on [-4, 4].",
  },

  // 2) Shade under f(x) from -4 to 4 (vs x-axis)
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
    time: 2,
    subtitle: "Shade the area between y = 0.5x² and the x-axis.",
  },

  // 3) Animate shaded region to a smaller window [-2, 2]
  {
    type: "update",
    id: "area_under",
    props: {
      animateTo: {
        f: (x: number) => 0.5 * x * x,
        xmin: -2,
        xmax: 2,
      },
      animateDuration: 1.2,
    },
    time: 3,
    subtitle: "Zoom in: restrict shading to [-2, 2].",
  },

  // 4) Add straight line g(x) = x + 1
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
    time: 2,
    subtitle: "Add the line y = x + 1.",
  },

  // 5) Animate area to be BETWEEN curves 0.5x² and x + 1
  //    on their intersection interval ≈ [-0.73, 2.73]
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
      animateDuration: 2,
    },
    time: 3,
    subtitle: "Now shade the region between y = 0.5x² and y = x + 1.",
  },

  // 6) Slide the region so it’s between the line and the x-axis on [0, 3]
  {
    type: "update",
    id: "area_under",
    props: {
      animateTo: {
        f: (x: number) => x + 1,
        g: (x: number) => 0,       // x-axis
        xmin: 0,
        xmax: 3,
      },
      animateDuration: 1.5,
    },
    time: 3,
    subtitle: "Move shading to the region between y = x + 1 and the x-axis.",
  },

  // 7) Add a sine wave h(x) = sin(x) over a wider range
  {
    type: "add",
    object: {
      id: "f_sin",
      type: "function",
      props: {
        f: (x: number) => Math.sin(x),
        xmin: -Math.PI,
        xmax: Math.PI,
        color: "cyan",
        lineWidth: 2,
      },
    },
    time: 2,
    subtitle: "Add y = sin(x) in the background.",
  },

  // 8) Morph the shaded region to live under sin(x) on [-π, π]
  {
    type: "update",
    id: "area_under",
    props: {
      animateTo: {
        f: (x: number) => Math.sin(x),
        g: (x: number) => 0, // x-axis again
        xmin: -Math.PI,
        xmax: Math.PI,
      },
      animateDuration: 2,
    },
    time: 3,
    subtitle: "Shading morphs to the area under y = sin(x).",
  },

  // 9) Fade out the area, then the curves
  {
    type: "remove",
    id: "area_under",
    time: 2,
    subtitle: "Remove the shaded region.",
  },
  {
    type: "remove",
    id: "f_area",
    time: 1,
    subtitle: "Remove y = 0.5x².",
  },
  {
    type: "remove",
    id: "f_line",
    time: 1,
    subtitle: "Remove y = x + 1.",
  },
  {
    type: "remove",
    id: "f_sin",
    time: 1,
    subtitle: "Clear y = sin(x) and reset.",
  },
]