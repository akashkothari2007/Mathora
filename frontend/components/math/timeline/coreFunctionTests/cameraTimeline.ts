import { Step } from "../../types/steps";

export const cameraTimeline: Step[] = [
  {
    subtitle: "Add a sine curve for camera reference.",
    cameraTarget: { position: [0, 0, 10], duration: 1 },
    actions: [
      {
        type: "add",
        object: {
          id: "f_cam_ref",
          type: "function",
          props: {
            f: (x: number) => Math.sin(x),
            xmin: -6.28318530718,
            xmax: 6.28318530718,
            color: "white",
            lineWidth: 2,
          },
        },
      },
      {
        type: "add",
        object: {
          id: "p1",
          type: "point",
          props: {
            position: {x: 0, y: 0},
            color: "white",
            size: 0.4,
          },
        },
      },
    ],
  },

  {
    subtitle: "Camera moves to the right.",
    cameraTarget: { position: [8, 3, 20], duration: 2, lookAt: [0, 0, 0] },
    actions: [],
  },

  {
    subtitle: "Camera moves to the left.",
    cameraTarget: { position: [-8, 3, 20], duration: 2, lookAt: [10, 0, 0] },
    actions: [],
  },

  {
    subtitle: "Camera moves higher for an overview.",
    cameraTarget: { position: [0, 10, 24], duration: 2, lookAt: [-10, 0, 4] },
    actions: [],
  },

  {
    subtitle: "Wide shot to end the camera test.",
    cameraTarget: { position: [0, 0, 28], duration: 3 },
    actions: [],
  },
];