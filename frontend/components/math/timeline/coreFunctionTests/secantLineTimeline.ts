import { Step } from "../../types/steps";

export const secantLineTimeline: Step[] = [
  {
    subtitle: "Draw a function to attach the secant to.",
    actions: [
      {
        type: "add",
        object: {
          id: "f_secant",
          type: "function",
          props: {
            f: (x: number) => 0.5 * x * x - 1,
            xmin: -3,
            xmax: 3,
            color: "white",
            lineWidth: 2,
          },
        },
      },
    ],
  },
  {
    subtitle: "Add a secant line from x = -2 to x = 2 (line extends past the points).",
    actions: [
      {
        type: "add",
        object: {
          id: "sec_1",
          type: "secantLine",
          props: {
            f: (x: number) => 0.5 * x * x - 1,
            startX: -2,
            endX: 2,
            extension: 2.5,
            color: "cyan",
            lineWidth: 2,
            pointSize: 0.06,
          },
        },
      },
    ],
  },
  {
    subtitle: "Slide the secant: move the left point toward the right.",
    actions: [
      {
        type: "update",
        id: "sec_1",
        props: {
          startX: 0,
          endX: 2,
        },
      },
    ],
  },
  {
    subtitle: "Slide both: narrow the secant to near x = 1.",
    actions: [
      {
        type: "update",
        id: "sec_1",
        props: {
          startX: 0.5,
          endX: 1.5,
        },
      },
    ],
  },
  {
    subtitle: "Tangent limit: almost a single point — line still extends as tangent.",
    actions: [
      {
        type: "update",
        id: "sec_1",
        props: {
          startX: 1,
          endX: 1.001,
        },
      },
    ],
  },
  {
    subtitle: "Widen it again across the parabola.",
    actions: [
      {
        type: "update",
        id: "sec_1",
        props: {
          startX: -2.5,
          endX: 2.5,
        },
      },
    ],
  },
  {
    subtitle: "Remove the secant and the function.",
    actions: [
      { type: "remove", id: "sec_1" },
      { type: "remove", id: "f_secant" },
    ],
  },
];
