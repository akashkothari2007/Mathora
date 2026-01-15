import { Action } from "../../types/actions";

export const wavesArtTimeline: Action[] = [
  // 1) Base wide view
  {
    type: "wait",
    time: 1,
    subtitle: "Wavefield visualisation.",
    target: {
      position: [0, 0, 24],
      duration: 2,
    },
  },

  // 2) Add three layered sine waves across a wide domain
  {
    type: "add",
    object: {
      id: "wave1",
      type: "function",
      props: {
        f: (x: number) => Math.sin(x),
        xmin: -4 * Math.PI,
        xmax: 4 * Math.PI,
        color: "cyan",
        lineWidth: 2,
      },
    },
    time: 1,
    subtitle: "First wave: y = sin(x).",
  },
  {
    type: "add",
    object: {
      id: "wave2",
      type: "function",
      props: {
        f: (x: number) => 0.6 * Math.sin(x + Math.PI / 3),
        xmin: -4 * Math.PI,
        xmax: 4 * Math.PI,
        color: "magenta",
        lineWidth: 2,
      },
    },
    time: 0.5,
    subtitle: "Second wave, phase shifted.",
  },
  {
    type: "add",
    object: {
      id: "wave3",
      type: "function",
      props: {
        f: (x: number) => 0.3 * Math.sin(2 * x),
        xmin: -4 * Math.PI,
        xmax: 4 * Math.PI,
        color: "yellow",
        lineWidth: 2,
      },
    },
    time: 0.5,
    subtitle: "Third wave, double frequency.",
  },

  // 3) Add shaded bands between two of the waves and the x-axis
  {
    type: "add",
    object: {
      id: "area_w1",
      type: "area",
      props: {
        f: (x: number) => Math.sin(x),
        g: (x: number) => 0,
        xmin: -2 * Math.PI,
        xmax: 2 * Math.PI,
        color: "#22c55e",
        opacity: 0.25,
      },
    },
    time: 1,
    subtitle: "Shaded band under sin(x).",
  },
  {
    type: "add",
    object: {
      id: "area_w2",
      type: "area",
      props: {
        f: (x: number) => 0.6 * Math.sin(x + Math.PI / 3),
        g: (x: number) => -0.6 * Math.sin(x + Math.PI / 3),
        xmin: -2 * Math.PI,
        xmax: 2 * Math.PI,
        color: "#3b82f6",
        opacity: 0.18,
      },
    },
    time: 0.5,
    subtitle: "Symmetric band around the second wave.",
  },

  // 4) Add multiple points running along each wave
  {
    type: "add",
    object: {
      id: "p_w1_a",
      type: "point",
      props: {
        position: { x: -4 * Math.PI, y: 0 },
        color: "white",
        size: 0.08,
        followFunction: {
          f: (x: number) => Math.sin(x),
          startX: -4 * Math.PI,
          endX: 4 * Math.PI,
          duration: 6,
        },
      },
    },
    time: 0.5,
    subtitle: "Particles race along the first wave.",
  },
  {
    type: "add",
    object: {
      id: "p_w1_b",
      type: "point",
      props: {
        position: { x: -2 * Math.PI, y: 0 },
        color: "cyan",
        size: 0.08,
        followFunction: {
          f: (x: number) => Math.sin(x),
          startX: -2 * Math.PI,
          endX: 2 * Math.PI,
          duration: 4,
        },
      },
    },
    time: 0,
    subtitle: "",
  },
  {
    type: "add",
    object: {
      id: "p_w2_a",
      type: "point",
      props: {
        position: { x: 4 * Math.PI, y: 0 },
        color: "magenta",
        size: 0.08,
        followFunction: {
          f: (x: number) => 0.6 * Math.sin(x + Math.PI / 3),
          startX: 4 * Math.PI,
          endX: -4 * Math.PI,
          duration: 7,
        },
      },
    },
    time: 0.5,
    subtitle: "Other particles travel in the opposite direction.",
  },
  {
    type: "add",
    object: {
      id: "p_w3_a",
      type: "point",
      props: {
        position: { x: -3 * Math.PI, y: 0 },
        color: "yellow",
        size: 0.08,
        followFunction: {
          f: (x: number) => 0.3 * Math.sin(2 * x),
          startX: -3 * Math.PI,
          endX: 3 * Math.PI,
          duration: 5,
        },
      },
    },
    time: 0,
    subtitle: "",
  },

  // 5) Sliding tangent dancing on sin(x) across the middle band
  {
    type: "add",
    object: {
      id: "t_wave",
      type: "slidingTangent",
      props: {
        f: (x: number) => Math.sin(x),
        startX: -2 * Math.PI,
        endX: 2 * Math.PI,
        color: "white",
        lineWidth: 2,
        duration: 6,
      },
    },
    time: 1,
    subtitle: "A tangent line sweeps across the main wave.",
    target: {
      position: [0, 0, 20],
      duration: 2,
    },
  },

  // 6) Morph the waves into different shapes in sync
  {
    type: "update",
    id: "wave1",
    props: {
      animateTo: (x: number) => Math.cos(2 * x) * 0.8,
      animateDuration: 3,
    },
    time: 3,
    subtitle: "The main wave morphs into a faster cosine wave.",
  },
  {
    type: "update",
    id: "wave2",
    props: {
      animateTo: (x: number) => 0.6 * Math.sin(3 * x + Math.PI / 2),
      animateDuration: 3,
    },
    time: 0,
    subtitle: "",
  },
  {
    type: "update",
    id: "wave3",
    props: {
      animateTo: (x: number) => 0.3 * Math.cos(4 * x),
      animateDuration: 3,
    },
    time: 0,
    subtitle: "",
  },
  {
    type: "update",
    id: "area_w1",
    props: {
      animateTo: {
        f: (x: number) => Math.cos(2 * x) * 0.8,
        g: (x: number) => 0,
        xmin: -2 * Math.PI,
        xmax: 2 * Math.PI,
      },
      animateDuration: 3,
    },
    time: 0,
    subtitle: "The shaded region deforms with the wave.",
  },

  // 7) Camera glide along the x-axis while things move
  {
    type: "wait",
    time: 2,
    subtitle: "Let the motion play out.",
    target: {
      position: [6, 0, 22],
      duration: 3,
    },
  },
  {
    type: "wait",
    time: 3,
    subtitle: "",
    target: {
      position: [-6, 0, 22],
      duration: 3,
    },
  },

  // 8) Final “collapse”: fade out extras, keep one clean wave
  {
    type: "remove",
    id: "area_w2",
    time: 1,
    subtitle: "The extra layers fade out.",
  },
  {
    type: "remove",
    id: "p_w1_a",
    time: 0.2,
    subtitle: "",
  },
  {
    type: "remove",
    id: "p_w1_b",
    time: 0.2,
    subtitle: "",
  },
  {
    type: "remove",
    id: "p_w2_a",
    time: 0.2,
    subtitle: "",
  },
  {
    type: "remove",
    id: "p_w3_a",
    time: 0.2,
    subtitle: "",
  },
  {
    type: "remove",
    id: "t_wave",
    time: 0.5,
    subtitle: "",
  },
  {
    type: "remove",
    id: "wave2",
    time: 0.5,
    subtitle: "",
  },
  {
    type: "remove",
    id: "wave3",
    time: 0.5,
    subtitle: "",
  },

  // 9) Calm ending: just one smooth wave + soft camera pullback
  {
    type: "update",
    id: "wave1",
    props: {
      animateTo: (x: number) => 0.7 * Math.sin(x),
      animateDuration: 2,
    },
    time: 1,
    subtitle: "We end with a single smooth wave.",
    target: {
      position: [0, 0, 26],
      duration: 3,
    },
  },
  {
    type: "wait",
    time: 4,
    subtitle: "Math as motion and light.",
  },
];