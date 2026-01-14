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
    time: 2,
    subtitle: "Graph of y = sin(x)",
    target: {
      position: [10, 0, 10],
      duration: 1,
    },
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
    target: {
      position: [0, 0, 10],
      duration: 1,
    },
    time: 4,
    subtitle: "Graph of y = 0.3cos(x)",
  },
  {
    type: "add",
    object: {
      id: "t1",
      type: "slidingTangent",
      props: {
        f: (x:number) => Math.sin(x),
        startX: -Math.PI,
        endX: Math.PI,
        color: "white",
        lineWidth: 2,
        duration: 2,
      },
    },
    subtitle: "Sliding tangent of sin(x)",
    time: 0,
  },
  {
    type: "add",
    object: {
      id: "p4",
      type: "point",
      props: {
        position: {x: Math.PI, y: 0},
        color: "magenta",
        size: 0.2,
        followFunction: {
          f: (x:number) => Math.sin(x),
          startX: -Math.PI,
          endX: Math.PI,
          duration: 2,
        },
      },
    },
    time: 5,
    subtitle: "Tangent follows sin(x)",
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
    target: {
      position: [20, 20, 20],
      duration: 1,
    },
    time: 3,
    subtitle: "Area between sin(x) and 0.3cos(x)",
  },
  {
    type: "update",
    id: "t1",
    props: {
      f: (x:number) => 0.3 * Math.cos(x),
      startX: 0,
      endX: Math.PI/2,
    },
    time: 5,
    subtitle: "Update tangent of sin(x)",
  },
  // 4️⃣ Update — both functions + area morph at SAME time
  {
    type: "remove",
    id: "t1",
    time: 6,
    subtitle: "Remove tangent of sin(x)",
  },
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
      animateDuration: 0.2
    },
    time: 4,
    subtitle: "Area updates with both functions",
  },
  {
    type: "add",
    object: {
      id: "p1",
      type: "point",
      props: {
        position: {x: 0, y: 0},
        color: "green",
        size: 0.2,
      },
    },
    time: 6,
    subtitle: "Add point at (0, 0)",
  },
  {
    type: "update",
    id: "p1",
    props: {
      followFunction: {
        f: (x:number) => 2 * Math.sin(x),
        startX: 0,
        endX: Math.PI,
        duration: 1,
      },
    },
    time: 6,
    subtitle: "Point follows 2sin(x)",
  },
];