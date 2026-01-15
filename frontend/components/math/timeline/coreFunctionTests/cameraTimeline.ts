import { Action } from "../../types/actions";

export const cameraTimeline: Action[] = [
    // 1) Add simple sine for reference
    {
      type: "add",
      object: {
        id: "f_cam_ref",
        type: "function",
        props: {
          f: (x: number) => Math.sin(x),
          xmin: -2 * Math.PI,
          xmax: 2 * Math.PI,
          color: "white",
          lineWidth: 2,
        },
      },
      time: 2,
      subtitle: "Reference function y = sin(x).",
      target: {
        position: [0, 0, 18],
        duration: 2,
      },
    },
  
    // 2) Slide camera to the right & slightly up
    {
      type: "wait",
      time: 3,
      subtitle: "Camera moves to the right.",
      target: {
        position: [8, 3, 20],
        duration: 2,
      },
    },
  
    // 3) Slide camera to the left & slightly up
    {
      type: "wait",
      time: 3,
      subtitle: "Camera moves to the left.",
      target: {
        position: [-8, 3, 20],
        duration: 2,
      },
    },
  
    // 4) Move camera higher
    {
      type: "wait",
      time: 3,
      subtitle: "Camera moves higher for an overview.",
      target: {
        position: [0, 10, 24],
        duration: 2,
      },
    },
  
    // 5) Pull back for a wide shot
    {
      type: "wait",
      time: 4,
      subtitle: "Wide shot to end the camera test.",
      target: {
        position: [0, 0, 28],
        duration: 3,
      },
    },
  ];    