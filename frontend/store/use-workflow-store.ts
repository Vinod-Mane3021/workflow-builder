import { create } from "zustand";
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
  Edge,
  Node,
  Connection,
  EdgeChange,
  NodeChange,
} from "reactflow";
import { createWithEqualityFn } from "zustand/traditional";

/**
 * WorkflowStoreState defines the structure of the Zustand store for managing
 * the state of a workflow editor using React Flow. It includes the state for nodes,
 * edges, and a mapping for generating unique node IDs based on their type.
 */
export interface WorkflowStoreState {
  nodes: Node[]; // Array of nodes in the workflow
  edges: Edge[]; // Array of edges connecting nodes in the workflow
  nodeIDs: Record<string, number>; // Record for storing and generating unique IDs for nodes by type

  /**
   * Generates a unique ID for a new node based on its type.
   * @param type - The type of the node.
   * @returns A unique ID string for the node.
   */
  getNodeID: (type: string) => string;

  /**
   * Adds a new node to the workflow.
   * @param node - The node object to be added.
   */
  addNode: (node: Node) => void;

  /**
   * Handles changes to the nodes, such as positions or properties, and updates the state accordingly.
   * @param changes - Array of NodeChange objects representing changes to the nodes.
   */
  onNodesChange: (changes: NodeChange[]) => void;

  /**
   * Handles changes to the edges, such as connecting nodes or removing connections, and updates the state.
   * @param changes - Array of EdgeChange objects representing changes to the edges.
   */
  onEdgesChange: (changes: EdgeChange[]) => void;

  /**
   * Handles new connections between nodes when an edge is created, and updates the state accordingly.
   * @param connection - The Connection object representing the new connection between nodes.
   */
  onConnect: (connection: Connection) => void;

  /**
   * Updates a specific field in a node's data object.
   * @param nodeId - The ID of the node to be updated.
   * @param fieldName - The name of the field to be updated.
   * @param fieldValue - The new value to set for the specified field.
   */
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;

  /**
   * Deletes a node from the workflow by its ID, and removes all associated edges.
   * @param nodeId - The ID of the node to be deleted.
   */
  deleteNode: (nodeId: string) => void;

  /**
   * Deletes an edge from the workflow by its ID.
   * @param edgeId - The ID of the edge to be deleted.
   */
  deleteEdge: (edgeId: string) => void;
}

/**
 * Creates a Zustand store for managing the state of a workflow editor.
 */
export const useWorkflowStore = createWithEqualityFn<WorkflowStoreState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},

  getNodeID: (type: string) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },

  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: "smoothstep",
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
        },
        get().edges
      ),
    });
  },

  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, [fieldName]: fieldValue };
        }
        return node;
      }),
    });
  },

  deleteNode: (nodeId: string) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  deleteEdge: (edgeId: string) => {
    set({
      edges: get().edges.filter((edge) => edge.id !== edgeId),
    });
  },
}));
