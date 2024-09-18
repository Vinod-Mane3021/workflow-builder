import { Request, Response, NextFunction } from "express";
import { HttpStatusCode, HttpStatus } from "../constants/http-status";
import {
  createWorkflowService,
  executeWorkflowService,
  getAllWorkflowsService,
  getWorkflowByIdService,
  updateWorkflowService,
} from "../../src/services/workflow.service";
import { ApiResponse } from "../../src/utils/api-response";
import { asyncHandler } from "../../src/utils/async-handler";
import z from "zod";
import { WorkflowSchema } from "../types/schema";
import { socketio } from "../index";
import papaparse from "papaparse";
import fs from "fs";

export const getWorkflows = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("getWorkflows");
    const workflows = await getAllWorkflowsService();
    console.log("workflows ", workflows.length);
    if (!workflows) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.BAD_REQUEST,
        status: HttpStatus.NOT_FOUND,
        message: "workflow not found",
      });
    }

    return new ApiResponse(res, {
      statusCode: HttpStatusCode.OK,
      status: HttpStatus.SUCCESS,
      message: "data found",
      data: workflows,
    });
  }
);

export const createWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = WorkflowSchema.safeParse(req.body);

    if (!validatedData.success) {
      console.log("!validatedData.success");
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.BAD_REQUEST,
        status: HttpStatus.INVALID_INPUTS,
        message: "Invalid inputs provided",
      });
    }

    const { id, name, nodes, edges } = validatedData.data;

    console.log("update id --> ", id);

    const existingWorkflow = await getWorkflowByIdService(id);

    if (existingWorkflow) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.CONFLICT,
        status: HttpStatus.ALREADY_EXIST,
        message: "Workflow already exist.",
      });
    }

    const data = await createWorkflowService({
      id,
      name,
      nodes,
      edges,
    });

    if (!data) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        status: HttpStatus.SERVER_ERROR,
        message: "Failed to create workflow. Please try again later.",
      });
    }

    return new ApiResponse(res, {
      statusCode: HttpStatusCode.CREATED,
      status: HttpStatus.SUCCESS,
      message: "Workflow created successfully.",
    });
  }
);

export const updateWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = WorkflowSchema.safeParse(req.body);

    if (!validatedData.success) {
      console.log("!validatedData.success");
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.BAD_REQUEST,
        status: HttpStatus.INVALID_INPUTS,
        message: "Invalid inputs provided",
      });
    }

    const { id, name, nodes, edges } = validatedData.data;

    const existingWorkflow = await getWorkflowByIdService(id);

    if (!existingWorkflow) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.BAD_REQUEST,
        status: HttpStatus.NOT_FOUND,
        message: "Workflow not found.",
      });
    }

    const existingNodeIds = existingWorkflow.nodes.map((node) => node.id);
    const existingEdgeIds = existingWorkflow.edges.map((edge) => edge.id);

    const incomingNodeIds = nodes.map((node) => node.id);
    const incomingEdgeIds = edges.map((edge) => edge.id);

    // Determine nodes and edges to delete
    const nodesToDelete = existingNodeIds.filter(
      (nodeId) => !incomingNodeIds.includes(nodeId)
    );
    const edgesToDelete = existingEdgeIds.filter(
      (edgeId) => !incomingEdgeIds.includes(edgeId)
    );

    const updatedWorkflow = await updateWorkflowService({
      id,
      name,
      nodes,
      edges,
      edgesToDelete,
      nodesToDelete,
    });

    if (!updatedWorkflow) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
        status: HttpStatus.SERVER_ERROR,
        message: "Workflow not updated.",
      });
    }

    return new ApiResponse(res, {
      statusCode: HttpStatusCode.OK,
      status: HttpStatus.UPDATED,
      message: "Workflow updated.",
    });
  }
);

const GetWorkflowSchema = z.object({
  id: z.string(),
});

export const getWorkflow = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = GetWorkflowSchema.safeParse(req.params);

  if (!validatedData.success) {
    return new ApiResponse(res, {
      statusCode: HttpStatusCode.BAD_REQUEST,
      status: HttpStatus.INVALID_INPUTS,
      message: "Invalid ID provided",
    });
  }

  const { id } = validatedData.data;

  // Fetch the workflow using the validated ID
  const existingWorkflow = await getWorkflowByIdService(id);

  if (!existingWorkflow) {
    return new ApiResponse(res, {
      statusCode: HttpStatusCode.BAD_REQUEST,
      status: HttpStatus.NOT_FOUND,
      message: "Workflow not found.",
    });
  }

  return new ApiResponse(res, {
    statusCode: HttpStatusCode.CREATED,
    status: HttpStatus.SUCCESS,
    message: "Workflow Found.",
    data: existingWorkflow,
  });
});

export const executeWorkflow = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: workflowId } = req.params;
    const file = req.file;

    if (!workflowId || !file) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.BAD_REQUEST,
        status: HttpStatus.INVALID_INPUTS,
        message: "Workflow ID and file are required",
      });
    }

    const workflow = await getWorkflowByIdService(workflowId);
    if (!workflow) {
      return new ApiResponse(res, {
        statusCode: HttpStatusCode.NOT_FOUND,
        status: HttpStatus.NOT_FOUND,
        message: "Workflow not found",
      });
    }

    const filePath = file.path;
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Parse CSV and handle execution
    papaparse.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: async (result) => {
        // console.log({ result: result.data });
        try {
          console.log("workflow.nodes " + workflow.nodes.length);

          for (const [index, node] of workflow.nodes.entries()) {
            // Notify frontend that the node execution is about to start
            socketio.emit("nodeStatus", {
              nodeId: node.id,
              status: "about_to_start",
            });

            // Notify frontend that the node is executing
            socketio.emit("nodeStatus", {
              nodeId: node.id,
              status: "executing",
            });

            const response = await executeWorkflowService(
              node.type,
              result.data
            );

            if (response == "ok") {
              // Notify frontend that the node execution is completed
              socketio.emit("nodeStatus", {
                nodeId: node.id,
                totalSteps: workflow.nodes.length,
                currentStep: index + 1,
                status: "completed",
              });
            }

            console.log({
              totalSteps: workflow.nodes.length,
              currentStep: index + 1,
            });
          }

          return new ApiResponse(res, {
            statusCode: HttpStatusCode.OK,
            status: HttpStatus.SUCCESS,
            message: "Workflow execution is successfully completed",
          });
        } catch (err) {
          console.error("Error executing workflow:", err);
          return new ApiResponse(res, {
            statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
            status: HttpStatus.SERVER_ERROR,
            message: "Error executing workflow",
          });
        } finally {
          fs.unlinkSync(filePath);
        }
      },
      error: (error: any) => {
        console.error("Error parsing CSV:", error);
        res.status(500).json({ error: "Error parsing CSV file" });
      },
    });
  }
);
