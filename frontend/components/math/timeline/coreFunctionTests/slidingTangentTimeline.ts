import { Action } from "../../types/actions";

export const slidingTangentTimeline: Action[] = [
    // 1) Base function y = cos(x)
    {
      type: "add",
      object: {
        id: "f_tan",
        type: "function",
        props: {
          f: (x: number) => Math.cos(x),
          xmin: -Math.PI,
          xmax: Math.PI,
          color: "cyan",
          lineWidth: 2,
        },
      },
      time: 4,
      subtitle: "Base function y = cos(x).",
    },
  
    // 2) Sliding tangent from -π to π
    {
      type: "add",
      object: {
        id: "t_slide_test",
        type: "slidingTangent",
        props: {
          f: (x: number) => Math.cos(x),
          startX: -Math.PI,
          endX: Math.PI,
          color: "white",
          lineWidth: 2,
          duration: 4,
        },
      },
      time: 5,
      subtitle: "Sliding tangent line across y = cos(x).",
    },
  
    // 3) Update tangent to a shorter range
    {
      type: "update",
      id: "t_slide_test",
      props: {
        startX: -Math.PI / 2,
        endX: Math.PI / 2,
        duration: 3,
      },
      time: 4,
      subtitle: "Now restrict the tangent to [-π/2, π/2].",
    },
  
    // 4) Double the function amplitude
    {
      type: "update",
      id: "f_tan",
      props: {
        animateTo: (x: number) => 2 * Math.cos(x),
        animateDuration: 2,
      },
      time: 4,
      subtitle: "Morph y = cos(x) into y = 2cos(x).",
    },
  
    // 5) Update sliding tangent to match new function
    {
      type: "update",
      id: "t_slide_test",
      props: {
        f: (x: number) => 2 * Math.cos(x),
        startX: -Math.PI / 2,
        endX: Math.PI / 2,
        duration: 3,
      },
      time: 3,
      subtitle: "Sliding tangent now follows y = 2cos(x).",
    },
  
    // 6) Reverse direction
    {
      type: "update",
      id: "t_slide_test",
      props: {
        startX: Math.PI / 2,
        endX: -3,
        duration: 3,
      },
      time: 3,
      subtitle: "Reverse the sliding direction.",
    },
    {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: -3,
          endX: 2.7,
          duration: 3,
        },
        time: 3,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: 2.7,
          endX: -2.2,
          duration: 2.7,
        },
        time: 2.7,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: -2.2,
          endX: 1.7,
          duration: 2.2,
        },
        time: 2.2,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: 1.7,
          endX: -1,
          duration: 1.7,
        },
        time: 1.7,
        subtitle: "Reverse the sliding direction.",
      },
        
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: -1,
          endX: 0.5,
          duration: 1,
        },
        time: 1,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: 0.5,
          endX: -0.15,
          duration: 0.5,
        },
        time: 3,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: -0.15,
          endX: 0.05,
          duration: 0.15,
        },
        time: 3,
        subtitle: "Reverse the sliding direction.",
      },
      {
        type: "update",
        id: "t_slide_test",
        props: {
          startX: 0.05,
          endX: 0,
          duration: 0.05,
        },
        time: 5,
        subtitle: "Reverse the sliding direction.",
      },
    
    
    
    
  
    // 7) Clean up
    {
      type: "remove",
      id: "t_slide_test",
      time: 2,
      subtitle: "Remove the sliding tangent.",
    },
    {
      type: "remove",
      id: "f_tan",
      time: 1.5,
      subtitle: "Remove the base function.",
    },
  ];