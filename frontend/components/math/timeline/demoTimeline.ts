import { Action } from "../types/actions";

export const demoTimeline: Action[] = [
  // 1️⃣ Add base function f1
  {
    type: "add",
    object: {
      id: "f1",
      type: "function",
      props: {
        f: (x:number) => Math.sin(x),
        xmin: -Math.PI,
        xmax: Math.PI,
        color: "cyan",
        lineWidth: 2,
      }
    },
    time: 4,
    subtitle: "Graph of y = sin(x)",
  },

  // 2️⃣ Add second function f2
  {
    type: "add",
    object: {
      id: "f2",
      type: "function",
      props: {
        f: (x:number) => 0.3 * Math.cos(x),
        xmin: -Math.PI,
        xmax: Math.PI,
        color: "red",
        lineWidth: 2,
      }
    },
    time: 4,
    subtitle: "Graph of y = 0.3cos(x)",
  },

  // 3️⃣ Add area between functions
  {
    type: "add",
    object: {
      id: "area1",
      type: "area",
      props: {
        f: (x:number) => Math.sin(x),
        g: (x:number) => 0.3*Math.cos(x),
        xmin: -Math.PI,
        xmax: Math.PI,
        color: "#22c55e",
        opacity: 0.35,
      }
    },
    time: 3,
    subtitle: "Area between sin(x) and 0.3cos(x)",
  },

  // 4️⃣ Update — both functions + area morph at SAME time
  {
    type: "update",
    id: "f1",
    props: {
      animateTo: (x:number) => 2*Math.sin(x),
      animateDuration: 1,
    },
    time: 0,
    subtitle: "Update f1 → 2sin(x)",
  },

  {
    type: "update",
    id: "f2",
    props: {
      animateTo: (x:number) => 1 - 0.5*Math.cos(x),
      animateDuration: 1,
    },
    time: 0,
    subtitle: "Update f2 → 1 - 0.5cos(x)",
  },

  {
    type: "update",
    id: "area1",
    props: {
      animateTo: {
        f: (x:number) => 2*Math.sin(x),
        g: (x:number) => 1 - 0.5*Math.cos(x),
      },
      animateDuration: 1
    },
    time: 4,
    subtitle: "Area updates with both functions",
  },
];