import { Step } from "../../types/steps";

export const pointAndLabelTestTimeline: Step[] = [
  {
    subtitle: "Add a point at the origin.",
    cameraTarget: { position: [0, 0, 0], center: [0, 0, 0] },
    whiteboardLines: [
      String.raw`y=\frac{1}{2}x^2`,
      String.raw`\text{Domain: }[-4,4]`,
    ],
    actions: [
      {
        type: "add",
        object: {
          id: "p_test",
          type: "point",
          props: {
            position: { x: 0, y: 0 },
            color: "white",
          },
        },
      },
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
      },
    ],
  },

  {
    subtitle: "Animate the point to (2, 1).",
    cameraTarget: { position: [2, 1, 0], center: [2, 1, 0] },
    actions: [
      {
        type: "update",
        id: "p_test",
        props: {
          animateTo: { x: 2, y: 1 },
          animateDuration: 1.5,
        },
      },
      {
        type: "update",
        id: "label_p",
        props: {
          text: "(2, 1)",
          position: { x: 2, y: 0.4 },
        },
      },
    ],
  },

 

  {
    subtitle: "Point follows the curve y = sin(x) from -π to π.",
    cameraTarget: { position: [2, 1, 0], center: [-Math.PI, 0, 0] },
    actions: [
      {
        type: "update",
        id: "p_test",
        props: {
          followFunction: {
            f: (x: number) => Math.sin(x),
            startX: -3.14159265359,
            endX: 3.14159265359,
            duration: 4,
          },
        },
      },
    ],
  },

  {
    subtitle: "Label updated while the point moves along sin(x).",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "label_p",
        props: {
          text: "Moving along y = sin(x)",
          position: { x: 0, y: -1.2 },
        },
      },
    ],
  },

  {
    subtitle: "Now the point follows y = x² from -2 to 2.",
    cameraTarget: null,
    actions: [
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
      },
    ],
  },

  {
    subtitle: "Reset motion and animate back to (0, 0).",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "p_test",
        props: {
          followFunction: null,
          animateTo: { x: 0, y: 0 },
          animateDuration: 2,
        },
      },
    ],
  },

  {
    subtitle: "Label updated at the origin again.",
    cameraTarget: null,
    actions: [
      {
        type: "update",
        id: "label_p",
        props: {
          text: "Back at (0, 0)",
          position: { x: 0, y: -0.6 },
        },
      },
    ],
  },

  {
    subtitle: "Remove the label.",
    cameraTarget: null,
    actions: [
      {
        type: "remove",
        id: "label_p",
      },
    ],
  },
];