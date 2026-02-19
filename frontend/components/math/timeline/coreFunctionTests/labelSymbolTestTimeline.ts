import { Step } from "../../types/steps";

/**
 * Test that labels can render math symbols (², ∞, etc.) using the fallback font.
 * Run with prompt: "symbol test"
 */
export const labelSymbolTestTimeline: Step[] = [
  {
    subtitle: "Symbol test: labels should show squared, infinity, and other math symbols (no boxes).",
    actions: [
      {
        type: "add",
        object: {
          id: "sym_squared",
          type: "label",
          props: {
            text: "y = x²",
            position: { x: -2, y: 1.5 },
            color: "#4ade80",
            fontSize: 0.6,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "sym_cubed",
          type: "label",
          props: {
            text: "y = x³",
            position: { x: -2, y: 0.5 },
            color: "#60a5fa",
            fontSize: 0.6,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "sym_infinity",
          type: "label",
          props: {
            text: "limit → ∞",
            position: { x: -2, y: -0.5 },
            color: "#f472b6",
            fontSize: 0.6,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "sym_inequalities",
          type: "label",
          props: {
            text: "±1, ≤2, ≥0, ≠3",
            position: { x: -2, y: -1.5 },
            color: "#fbbf24",
            fontSize: 0.5,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "sym_mixed",
          type: "label",
          props: {
            text: "√2 ≈ 1.41, ½ + ¼",
            position: { x: 1, y: 1 },
            color: "white",
            fontSize: 0.5,
          },
        },
      },
    ],
    cameraTarget: {
      center: [0, 0, 0],
      width: 10,
      height: 7,
    },
  },
];
