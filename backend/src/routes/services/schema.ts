import { size, z } from "zod";
import { duration } from "zod/v4/classic/iso.cjs";

const CleanedString = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      let cleaned = val.trim();
      cleaned = cleaned.replace(/,+$/, "");
      return cleaned;
    }
    return val;
  },
  z.string()
);

const FunctionExprSchema = z.string().refine(expr => {
  try {
    new Function("x", `return (${expr})`)
    return true
  } catch {
    return false
  }
}, {
  message: "Invalid function expression string"
});

const CameraTargetSchema = z.object({
  center: z.tuple([z.number(), z.number(), z.number()]).optional(),
  width: z.number().optional(),
  height: z.number().optional(),
}).strict();

const PointPropsSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).strict(),
  color: z.string().optional(),
  size: z.number().optional(),
  animateTo: z.object({
    x: z.number(),
    y: z.number(),
  }).optional(),
  followFunction: z.object({
    f: FunctionExprSchema,
    startX: z.number(),
    endX: z.number(),
    duration: z.number().optional(),
  }).optional(),
}).strict();

const FunctionPropsSchema = z.object({
  f: FunctionExprSchema,
  xmin: z.number().optional(),
  xmax: z.number().optional(),
  steps: z.number().optional(),
  color: z.string().optional(),
  lineWidth: z.number().optional(),
}).strict();


const SlidingTangentPropsSchema = z.object({
  f: FunctionExprSchema,
  startX: z.number(),
  endX: z.number(),
  duration: z.number().optional(),
  xmin: z.number().optional(),
  xmax: z.number().optional(),
  color: z.string().optional(),
  lineWidth: z.number().optional(),
}).strict();

const AreaPropsSchema = z.object({
  f: FunctionExprSchema,
  g: FunctionExprSchema.optional(),
  xmin: z.number(),
  xmax: z.number(),
  steps: z.number().optional(),
  color: z.string().optional(),
  opacity: z.number().optional(),
  animateTo: z.object({
    f: FunctionExprSchema.optional(),
    g: FunctionExprSchema.optional(),
    xmin: z.number().optional(),
    xmax: z.number().optional(),
  }).optional(),
  animateDuration: z.number().optional(),
}).strict();

const LabelPropsSchema = z.object({
  text: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }).strict(),
  color: z.string().optional(),
  fontSize: z.number().optional(),
}).strict();

const SecantLinePropsSchema = z.object({
  f: FunctionExprSchema,
  startX: z.number(),
  endX: z.number(),
  color: z.string().optional(),
  lineWidth: z.number().optional(),
  pointSize: z.number().optional(),
}).strict();

export const ObjectSchema = z.discriminatedUnion("type", [
  z.object({
    id: CleanedString,
    type: z.literal("point"),
    props: PointPropsSchema,
  }),
  z.object({
    id: CleanedString,
    type: z.literal("label"),
    props: LabelPropsSchema,
  }),
  z.object({
    id: CleanedString,
    type: z.literal("function"),
    props: FunctionPropsSchema,
  }),
  z.object({
    id: CleanedString,
    type: z.literal("slidingTangent"),
    props: SlidingTangentPropsSchema,
  }),
  z.object({
    id: CleanedString,
    type: z.literal("area"),
    props: AreaPropsSchema,
  }),
  z.object({
    id: CleanedString,
    type: z.literal("secantLine"),
    props: SecantLinePropsSchema,
  }),
]);

export const ActionSchema = z.object({
  type: z.enum(["add", "update", "remove", "wait"]),
  id: CleanedString.optional(),
  target: CameraTargetSchema.optional(),

  object: ObjectSchema.optional(),

  props: z.record(z.string(), z.any()).optional(),
}).superRefine((action, ctx) => {
  const checkFns = (obj: any) => {
    if (!obj || typeof obj !== "object") return

    for (const [k, v] of Object.entries(obj)) {
      if ((k === "f" || k === "g") && typeof v === "string") {
        if (!FunctionExprSchema.safeParse(v).success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid function expression: ${v}`,
          })
        }
      } else if (typeof v === "object") {
        checkFns(v)
      }
    }
  }

  if (action.object) checkFns(action.object.props)
  if (action.props) checkFns(action.props)
});

export const StepSchema = z.object({
  subtitle: CleanedString.optional(),
  cameraTarget: CameraTargetSchema.nullable().optional(),
  actions: z.array(ActionSchema).optional(),
  whiteboardLines: z.array(z.string()).optional(),
})

export const TimelineSchema = z.array(StepSchema);
export type Action = z.infer<typeof ActionSchema>
export type Step = z.infer<typeof StepSchema>