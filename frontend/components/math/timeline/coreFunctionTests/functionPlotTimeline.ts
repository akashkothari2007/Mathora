import { Step } from "../../types/steps";

export const functionPlotTimeline: Step[] = [
  {
    subtitle: "Start with y = x on [-2, 2].",
    actions: [
      {
        type: "add",
        object: {
          id: "f_test",
          type: "function",
          props: {
            f: (x: number) => x,
            xmin: -2,
            xmax: 2,
            color: "cyan",
            lineWidth: 2,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "label_f",
          type: "label",
          props: {
            text: "y = x",
            position: { x: 1.5, y: 1.5 },
          },
        },
      },
    ],
    whiteboardLines: [
      String.raw`y = x`,
    ],
  },

 
  {
    subtitle: "Morph into y = x².",
    actions: [
      {
        type: "update",
        id: "f_test",
        props: {
          f: (x: number) => x * x,
        },
      },
      {
        type: "update",
        id: "label_f",
        props: {
          text: "y = x²"
        }
      }
    ],
    whiteboardLines: [
      String.raw`\text{Domain }[-4,4]`,
    ],
  },

  {
    subtitle: "Morph again into y = sin(x).",
    actions: [
      {
        type: "update",
        id: "f_test",
        props: {
          f: (x: number) => Math.sin(x),
        },
      },
      {
        type: "update",
        id: "label_f",
        props: {
          text: "y = sin(X)"
        }
      }
    ],
  },

  {
    subtitle: "Extend the domain to [-π, π] and change style.",
    actions: [
      {
        type: "update",
        id: "f_test",
        props: {
          xmin: -3.14159265359,
          xmax: 3.14159265359,
          color: "orange",
          lineWidth: 3,
        },
      },
    ],
  },

  {
    subtitle: "Remove the label (function stays).",
    cameraTarget: null,
    actions: [
      {
        type: "remove",
        id: "label_f",
      },
    ],
  },
];