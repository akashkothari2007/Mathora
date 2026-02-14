import type { Step } from "../../types/steps"

export const functionAttentionTimeline: Step[] = [
  {
    subtitle: "Two functions appear.",
    actions: [
      {
        type: "add",
        object: {
          id: "f1",
          type: "function",
          props: { f: (x: number) => x * x, xmin: -3, xmax: 3, color: "#4ade80", lineWidth: 2, attentionState: "normal" },
        },
      },
      {
        type: "add",
        object: {
          id: "f2",
          type: "function",
          props: { f: (x: number) => 0.5 * x * x, xmin: -3, xmax: 3, color: "#60a5fa", lineWidth: 2, attentionState: "normal" },
        },
      },
    ],
  },

  {
    subtitle: "Highlight f1.",
    actions: [
      { type: "update", id: "f1", props: { attentionState: "highlighted" } },
      { type: "update", id: "f2", props: { attentionState: "dimmed" } },
    ],
  },

  {
    subtitle: "Highlight f2.",
    actions: [
      { type: "update", id: "f1", props: { attentionState: "dimmed" } },
      { type: "update", id: "f2", props: { attentionState: "highlighted" } },
    ],
  },
  {
    subtitle: "return to normal.",
    actions: [
      { type: "update", id: "f1", props: { attentionState: "normal" } },
      { type: "update", id: "f2", props: { attentionState: "normal" } },
    ],
  },


]