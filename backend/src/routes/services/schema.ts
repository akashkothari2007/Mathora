import { z } from "zod";

const CameraTargetSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  duration: z.number().optional(),
});

export const ActionSchema = z.object({
  type: z.enum(["add", "update", "remove", "wait"]),
  time: z.number().or(z.string().transform(val => parseFloat(val))),
  subtitle: z.string().transform(str => str.trim()),
  id: z.string().optional(),
  target: CameraTargetSchema.optional(),

  object: z
    .object({
      id: z.string(),
      type: z.enum(["function", "point", "label", "area", "slidingTangent"]),
      props: z.record(z.string(), z.any())
    })
    .optional(),

  props: z.record(z.string(), z.any()).optional()
});

export const TimelineSchema = z.array(ActionSchema);

export type Action = z.infer<typeof ActionSchema>;
