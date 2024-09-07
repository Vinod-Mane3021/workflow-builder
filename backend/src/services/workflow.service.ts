import { EdgeType, NodeType, WorkflowType } from "../types/index";
import { db } from "../../src/config/prisma-client";
import papaparse from 'papaparse'
import fs from 'fs'
import path from 'path';

// const nodes = [
//   {
//     id: "filterData-1",
//     type: "filterData",
//     position: { x: 20.199999809265137, y: 127.19999694824219 },
//     data: { id: "filterData-1", nodeType: "filterData" },
//   },
//   {
//     id: "wait-1",
//     type: "wait",
//     position: { x: 435.19999980926514, y: 117.19999694824219 },
//     data: { id: "wait-1", nodeType: "wait" },
//   },
// ];

// const edges = [
//   {
//     id: "reactflow__edge-filterData-1filterData-1-filter-right-wait-1wait-1-wait-left",
//     source: "filterData-1",
//     sourceHandle: "filterData-1-filter-right",
//     target: "wait-1",
//     targetHandle: "wait-1-wait-left",
//     type: "smoothstep",
//     animated: true,
//   },
// ];

// const workflows = [
//   { id: "1_zhsgdvfbjzshbfv", name: "workflow 11", nodes, edges },
//   { id: "2_zjshrbfvkzhjdbfk", name: "workflow 2", nodes, edges },
//   { id: "2_zjshrbfvkzhjdbfasdk", name: "workflow 3", nodes, edges },
//   { id: "2_zjshrbfvkzhjdbfksdvsv", name: "workflow 4", nodes, edges },
//   { id: "1_zhsgdvfbjzshbfsascv", name: "workflow 5", nodes, edges },
//   { id: "2_zjshrbfvkzhjdascabfk", name: "workflow 6", nodes, edges },
//   { id: "2_zjshrbfvkzhjdascsdk", name: "workflow 7", nodes, edges },
//   { id: "2_zjshrbfvkzhjdasdvsv", name: "workflow 8", nodes, edges },
// ];

export const getAllWorkflowsService = async () =>
  // page: number,
  // pageSize: number
  {
    const data = await db.workflow.findMany({
      select: {
        id: true,
        name: true,
        edges: true,
        nodes: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });
    return data;
  };

export const createWorkflowService = async ({
  id,
  name,
  edges,
  nodes,
}: WorkflowType) => {
  const data = await db.workflow.create({
    data: {
      id,
      name,
      nodes: {
        create: nodes,
      },
      edges: {
        create: edges,
      },
    },
  });
  return data;
};

type UpdateWorkflowType = {
  id: string;
  name: string;
  nodes: NodeType[];
  edges: EdgeType[];
  nodesToDelete: string[];
  edgesToDelete: string[];
};

export const updateWorkflowService = async ({
  id,
  name,
  nodes,
  edges,
  nodesToDelete,
  edgesToDelete,
}: UpdateWorkflowType) => {
  console.log("updateWorkflowService");
  // console.log({ edges })
  // console.log({ nodes })

  const data = await db.workflow.update({
    where: { id },
    data: {
      name,
      // Delete nodes that are not in the incoming data
      nodes: {
        deleteMany: nodesToDelete.map((id) => ({ id })),
        // Update or create nodes
        upsert: nodes.map((node) => ({
          where: { id: node.id },
          create: node,
          update: node,
        })),
      },
      // Delete edges that are not in the incoming data
      edges: {
        deleteMany: edgesToDelete.map((id) => ({ id })),
        // Update or create edges
        upsert: edges.map((edge) => ({
          where: { id: edge.id },
          create: edge,
          update: edge,
        })),
      },
    },
  });

  return data;
};

export const getWorkflowByIdService = async (id: string) => {
  const data = await db.workflow.findUnique({
    where: {
      id,
    },
    include: {
      nodes: true,
      edges: true,
    },
  });

  return data;
};

export type WorkflowNodeType =
  | "filterData"
  | "wait"
  | "convertFormat"
  | "sendPOSTRequest";

export interface WorkflowNode {
  id: string;
  type: string;
  position: Object;
  data: Object;
  workflowId: string;
}

export type Workflow = {
  id: string;
  nodes: WorkflowNode[];
};

export type DataRow = {
  [key: string]: any; // Data rows will be in key-value format
};

export async function executeWorkflowService(
  nodeType: string,
  fileData: any
): Promise<"ok" | "error"> {
  switch (nodeType) {
    case "filterData":
      return await filterData(fileData);
    case "wait":
      return await wait(6000);
    case "convertFormat":
      return await convertFormat(fileData);
    case "sendPOSTRequest":
      return await sendPostRequest(fileData);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}

// Helper function to filter data
async function filterData(fileData: any): Promise<"ok" | "error"> {
  try {
    const modifiedData = fileData.map((row: any) => {
      const newRow: any = {};
      Object.keys(row).forEach((key) => {
        newRow[key] = String(row[key]).toLowerCase();
      });
      return newRow;
    });

    // Perform further actions such as saving the modified data if needed
    console.log("Filtered data:", modifiedData);
    return "ok";
  } catch (error) {
    console.error("Error in filterData:", error);
    return "error";
  }
}

// Helper function to introduce delay
async function wait(delay: number): Promise<"ok" | "error"> {
  try {
    await new Promise((resolve) => setTimeout(resolve, delay));
    return "ok";
  } catch (error) {
    console.error("Error in wait:", error);
    return "error";
  }
}

// Helper function to convert CSV to JSON
async function convertFormat(fileData: any): Promise<"ok" | "error"> {
  try {
    const jsonData = JSON.stringify(fileData);
    console.log("Converted data to JSON:", jsonData);
    return "ok";
  } catch (error) {
    console.error("Error in convertFormat:", error);
    return "error";
  }
}

// Helper function to send a POST request
async function sendPostRequest(data: any): Promise<"ok" | "error"> {
  try {
    const url = "https://execute.requestcatcher.com/test"; // Replace with actual URL
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to send POST request. Status: ${response.status}, ${errorText}`
      );
    }

    return "ok";
  } catch (error) {
    console.error("Error sending POST request:", error);
    return "error";
  }
}