import { Step } from "../../types/steps"

export const sceneConfigTimeline: Step[] = [
  {
    subtitle: "Axes, no labels (ticks only).",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: false,
      },
    },
  },
  {
    subtitle: "Axes, labels every 1 unit.",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
  },
  {
    subtitle: "Axes, labels every 2 units.",
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 2,
      },
    },
  },
  {
    subtitle: "Camera pan to the left; axes auto-extend to cover view.",
    cameraTarget: {
      center: [-20, 0, 0],
      width: 10,
    },
    sceneConfig: {
      mode: "axes",
      axes: {
        labels: true,
        tickSpacing: 1,
      },
    },
  },
  {
    subtitle: "Back to center, unit circle (no labels, degrees).",
    cameraTarget: {
      center: [0, 0, 0],
      width: 8,
      height: 8,
    },
    sceneConfig: {
      mode: "unitCircle",
      unitCircle: {
        labels: false,
        units: "degrees",
      },
    },
  },
  {
    subtitle: "Unit circle with labels (degrees).",
    sceneConfig: {
      mode: "unitCircle",
      unitCircle: {
        labels: true,
        units: "degrees",
      },
    },
  },
]
