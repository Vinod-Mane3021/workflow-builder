import { z } from "zod";

export const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    id: z.string(),
    nodeType: z.string(),
  }),
  connectionOrder: z.number()
});

export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string(),
  targetHandle: z.string(),
  type: z.string(),
  animated: z.boolean(),
});

export const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

