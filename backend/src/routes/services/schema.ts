import { z } from "zod";

export const ActionSchema = z.object({
  type: z.enum(["add", "update", "remove", "wait"]),
  time: z.number(),
  subtitle: z.string(),

  id: z.string().optional(),

  object: z
    .object({
      id: z.string(),
      type: z.enum(["function", "point", "label"]),
      props: z.record(z.string(), z.any())
    })
    .optional(),

  props: z.record(z.string(), z.any()).optional()
});

export const TimelineSchema = z.array(ActionSchema);

export type Action = z.infer<typeof ActionSchema>;
