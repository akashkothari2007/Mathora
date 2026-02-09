import { z } from "zod";



export const VisualElementSchema = z.object({
  type: z.enum(["function", "point", "label", "area", "slidingTangent"]),
  description: z.string(), 
  function: z.string().optional(), 
  coordinates: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  startX: z.number().optional(),
  endX: z.number().optional(),
  color: z.string().optional(),
});

export const PlanSchema = z.object({
  teachingGoal: z.string(), 
  keyVisuals: z.array(VisualElementSchema), 
  explanation: z.string(),
  whiteboardWork: z.array(z.string()), 
});

export type VisualElement = z.infer<typeof VisualElementSchema>;
export type Plan = z.infer<typeof PlanSchema>;
