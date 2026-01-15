import { Action } from "../../types/actions";

export const pointAndLabelTestTimeline: Action[] = [
  // 1) Add point at origin
  {
    type: "add",
    object: {
      id: "p_test",
      type: "point",
      props: {
        position: { x: 0, y: 0 },
        color: "white",
        size: 0.06,
      },
    },
    time: 0,
    subtitle: "Add a point at the origin.",
  },

  // 2) Add label near the point
  {
    type: "add",
    object: {
      id: "label_p",
      type: "label",
      props: {
        text: "(0, 0)",
        position: { x: 0, y: -0.6 },
      },
    },
    time: 4,
    subtitle: "Label and add a point at (0, 0).",
  },

  // 3) Animate point to (2, 1)
  {
    type: "update",
    id: "p_test",
    props: {
      animateTo: { x: 2, y: 1 },
      animateDuration: 1.5,
    },
    time: 1,
    subtitle: "Animate the point to (2, 1).",
  },

  // 4) Move label and update text
  {
    type: "update",
    id: "label_p",
    props: {
      text: "(2, 1)",
      position: { x: 2, y: 0.4 },
    },
    time: 3,
    subtitle: "Move the label to follow the new point position.",
  },

  // 5) Make point follow y = sin(x) from -π to π
  {
    type: "update",
    id: "p_test",
    props: {
      followFunction: {
        f: (x: number) => Math.sin(x),
        startX: -Math.PI,
        endX: Math.PI,
        duration: 4,
      },
    },
    time: 0,
    subtitle: "Point follows the curve y = sin(x) from -π to π.",
  },

  // 6) Update label while it moves
  {
    type: "update",
    id: "label_p",
    props: {
      text: "Moving along y = sin(x)",
      position: { x: 0, y: -1.2 },
    },
    time: 5,
    subtitle: "Label updated while the point moves along sin(x).",
  },

  // 7) Make point follow y = x² from -2 to 2
  {
    type: "update",
    id: "p_test",
    props: {
      followFunction: {
        f: (x: number) => x * x,
        startX: -2,
        endX: 2,
        duration: 3,
      },
    },
    time: 4,
    subtitle: "Now the point follows y = x² from -2 to 2.",
  },

  // 8) Clear followFunction and animate back to origin
  {
    type: "update",
    id: "p_test",
    props: {
      followFunction: null,
      animateTo: { x: 0, y: 0 },
      animateDuration: 2,

    },
    time: 4,
    subtitle: "Reset motion, change style, and animate back to (0, 0).",
  },

  // 9) Update label again
  {
    type: "update",
    id: "label_p",
    props: {
      text: "Back at (0, 0)",
      position: { x: 0, y: -0.6 },
    },
    time: 2,
    subtitle: "Label updated at the origin again.",
  },

  // 10) Remove label
  {
    type: "remove",
    id: "label_p",
    time: 1.5,
    subtitle: "Remove the label.",
  },
];