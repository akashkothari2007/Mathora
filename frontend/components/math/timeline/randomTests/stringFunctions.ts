import { Action } from "../../types/actions";

export const rawTimeline = [
    {
      type: "add",
      object: {
        id: "f1",
        type: "function",
        props: {
          f: "(x) => Math.sin(x)",
          xmin: -3.14,
          xmax: 3.14,
          color: "cyan"
        }
      },
      time: 1,
      subtitle: "Raw sin(x)"
    }
  ] as unknown as Action[]