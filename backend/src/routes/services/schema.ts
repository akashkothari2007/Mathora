import { z } from "zod";


const FunctionExprSchema = z.string().refine(expr => {
  try {
    new Function("x", `return (${expr})`);
    return true;
  } catch {
    return false;
  }
}, {
  message: "Invalid function expression string"
});

const CameraTargetSchema = z.object({
  position: z.tuple([z.number(), z.number(), z.number()]).optional(),
  duration: z.number().optional(),
});


export const ActionSchema = z.object({
  type: z.enum(["add", "update", "remove", "wait"]),
  time: z.number(),
  subtitle: z.string().transform(s => s.trim()),
  id: z.string().optional(),
  target: CameraTargetSchema.optional(),

  object: z.object({
    id: z.string(),
    type: z.enum(["function", "point", "label", "area", "slidingTangent"]),
    props: z.record(z.string(), z.any())
  }).optional(),

  props: z.record(z.string(), z.any()).optional(),
}).superRefine((action, ctx) => {
  const checkFns = (obj: any) => {
    if (!obj || typeof obj !== "object") return;

    for (const [k, v] of Object.entries(obj)) {
      if ((k === "f" || k === "g") && typeof v === "string") {
        if (!FunctionExprSchema.safeParse(v).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid function expression: ${v}`
          });
        }
      } else if (typeof v === "object") {
        checkFns(v);
      }
    }
  };

  if (action.object) checkFns(action.object.props);
  if (action.props) checkFns(action.props);
});

export const TimelineSchema = z.array(ActionSchema);
export type Action = z.infer<typeof ActionSchema>;