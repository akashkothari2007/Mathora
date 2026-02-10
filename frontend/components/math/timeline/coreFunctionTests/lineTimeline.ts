import { Step } from "../../types/steps";

export const lineTimeline: Step[] = [
  {
    subtitle: "Draw a line from (0, 0) to (2, 1).",
    actions: [
      {
        type: "add",
        object: {
          id: "line_1",
          type: "line",
          props: {
            start: { x: 0, y: 0 },
            end: { x: 2, y: 1 },
            color: "cyan",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle: "Add another line from (-1, 1) to (1, -1).",
    actions: [
      {
        type: "add",
        object: {
          id: "line_2",
          type: "line",
          props: {
            start: { x: -1, y: 1 },
            end: { x: 1, y: -1 },
            color: "magenta",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle: "Update the first line to extend to (3, 2).",
    actions: [
      {
        type: "update",
        id: "line_1",
        props: {
          end: { x: 3, y: 2 },
        },
      },
    ],
  },
  {
    subtitle: "Remove the second line.",
    actions: [{ type: "remove", id: "line_2" }],
  },
];
