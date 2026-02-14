import { Step } from "../../types/steps";

export const label2DTestTimeline: Step[] = [
  {
    subtitle: "Type 'type test' and press Enter to see the Label2D animation.",
    actions: [
      {
        type: "add",
        object: {
          id: "label2d_test",
          type: "label",
          props: {
            text: "This is a test of the Label2D animation!",
            position: { x: 1, y: 1 },
            color: "white",
            fontSize: 1
          }
        }
      }
    ]
  }
];
