import { Action } from "../../types/actions";

export const functionPlotTimeline: Action[] = [
    // 1) Add y = x on [-2, 2]
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
      time: 2,
      subtitle: "Start with y = x on [-2, 2].",
    },
  
    // 2) Add label
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
      time: 1.5,
      subtitle: "Label the function.",
    },
  
    // 3) Animate to y = x²
    {
      type: "update",
      id: "f_test",
      props: {
        g: (x: number) => x * x,  
        animateDuration: 2,
      },
      time: 2,
      subtitle: "Morph into y = x².",
    },
  
    // 4) Animate to y = sin(x)
    {
      type: "update",
      id: "f_test",
      props: {
        g: (x: number) => Math.sin(x),
        animateDuration: 2,
      },
      time: 2,
      subtitle: "Morph again into y = sin(x).",
    },
  
    // 5) Change range and style
    {
      type: "update",
      id: "f_test",
      props: {
        xmin: -Math.PI,
        xmax: Math.PI,
        color: "orange",
        lineWidth: 3,
      },
      time: 2,
      subtitle: "Extend the domain to [-π, π] and change style.",
    },
  
    // 6) Remove label
    {
      type: "remove",
      id: "label_f",
      time: 1.5,
      subtitle: "Remove the label (function stays).",
    },
  ];