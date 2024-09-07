import { GetWorkflowSchema, EdgeSchema, NodeSchema, WorkflowSchema } from "./schema";
import { z } from "zod";

export type ApiResponseType<T> = {
  statusCode: number;
  status: string;
  message: string;
  data?: T;
};


export type WorkflowType = z.infer<typeof WorkflowSchema>

export type GetWorkflowType = z.infer<typeof GetWorkflowSchema>

export type NodeType = z.infer<typeof NodeSchema>

export type EdgeType = z.infer<typeof EdgeSchema>
