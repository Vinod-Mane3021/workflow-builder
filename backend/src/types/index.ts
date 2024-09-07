import z from "zod";
import { EdgeSchema, NodeSchema, WorkflowSchema } from "./schema";

export type WorkflowType = z.infer<typeof WorkflowSchema>
export type NodeType = z.infer<typeof NodeSchema>
export type EdgeType = z.infer<typeof EdgeSchema>
