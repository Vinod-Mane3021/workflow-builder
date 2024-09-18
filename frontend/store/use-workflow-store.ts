// import { create } from "zustand";
// import {
//   addEdge,
//   applyNodeChanges,
//   applyEdgeChanges,
//   MarkerType,
//   Edge,
//   Node,
//   Connection,
//   EdgeChange,
//   NodeChange,
// } from "reactflow";
// import { createWithEqualityFn } from "zustand/traditional";
// import { v4 as uuid } from "uuid";

// type WorkflowExecutionUpdateType = {
//   nodeId: string;
//   status: string;
// };

// export interface WorkflowStoreState {
//   nodes: Node[];
//   edges: Edge[];
//   nodeIDs: Record<string, number>;
//   workflowExecutionUpdate: WorkflowExecutionUpdateType[];

//   totalSteps: number;
//   currentStep: number;

//   nextConnectionOrder: number;

//   sortNodesByConnectionOrder: () => void;
//   addWorkflowExecutionUpdate: (
//     nodeId: string,
//     status: string,
//     totalSteps: number,
//     currentStep: number
//   ) => void;
//   addNodesAndEdges: (nodes: Node[], edges: Edge[]) => void;
//   getNodeID: (type: string) => string;
//   addNode: (node: Node) => void;
//   onNodesChange: (changes: NodeChange[]) => void;
//   onEdgesChange: (changes: EdgeChange[]) => void;
//   onConnect: (connection: Connection) => void;
//   updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
//   deleteNode: (nodeId: string) => void;
//   deleteEdge: (edgeId: string) => void;
// }

// export const useWorkflowStore = createWithEqualityFn<WorkflowStoreState>(
//   (set, get) => ({
//     nodes: [],
//     edges: [],
//     nodeIDs: {},
//     workflowExecutionUpdate: [],
//     nextConnectionOrder: 0,
//     totalSteps: 0,
//     currentStep: 0,

//     sortNodesByConnectionOrder: () =>
//       set((state) => ({
//         nodes: [...state.nodes].sort(
//           (a, b) =>
//             (a.data.connectionOrder ?? Infinity) -
//             (b.data.connectionOrder ?? Infinity)
//         ),
//       })),

//     addWorkflowExecutionUpdate: (
//       nodeId: string,
//       status: string,
//       totalSteps: number,
//       currentStep: number
//     ) => {
//       set((state) => ({
//         workflowExecutionUpdate: [
//           ...state.workflowExecutionUpdate,
//           { nodeId, status },
//         ],
//       }));

//       if(totalSteps && totalSteps > 0 && currentStep && currentStep > 0) {
//         set((state) => ({
//           totalSteps,
//           currentStep,
//         }));
//       }
//     },

//     addNodesAndEdges: (nodes: Node[], edges: Edge[]) => {
//       set((state) => {
//         if (
//           JSON.stringify(state.nodes) !== JSON.stringify(nodes) ||
//           JSON.stringify(state.edges) !== JSON.stringify(edges)
//         ) {
//           return {
//             nodes,
//             edges,
//           };
//         }
//         return state;
//       });
//     },

//     getNodeID: (type: string) => {
//       const newIDs = { ...get().nodeIDs };
//       if (newIDs[type] === undefined) {
//         newIDs[type] = 0;
//       }
//       newIDs[type] += 1;
//       set({ nodeIDs: newIDs });
//       return uuid();
//     },

//     addNode: (node: Node) => {
//       set((state) => {
//         return {
//           nodes: [
//             ...state.nodes,
//             {
//               ...node,
//               data: { ...node.data, connectionOrder: 0 }, // Start with a null order
//             },
//           ],
//         };
//       });
//     },

//     onNodesChange: (changes: NodeChange[]) => {
//       set({
//         nodes: applyNodeChanges(changes, get().nodes),
//       });
//     },

//     onEdgesChange: (changes: EdgeChange[]) => {
//       set({
//         edges: applyEdgeChanges(changes, get().edges),
//       });
//     },

//     onConnect: (connection: Connection) => {
//       set((state) => {
//         const updatedEdges = addEdge(
//           {
//             ...connection,
//             type: "smoothstep",
//             animated: true,
//             deletable: true,
//             style: {color: 'red'},
//             markerEnd: { type: MarkerType.Arrow, height: 20, width: 20, },
//           },
//           state.edges
//         );

//         const updatedNodes = state.nodes.map((node) => {
//           if (node.id === connection.target) {
//             // Find maximum connectionOrder among all predecessors
//             const predecessorOrders = updatedEdges
//               .filter((edge) => edge.target === node.id)
//               .map((edge) => {
//                 const sourceNode = state.nodes.find(
//                   (n) => n.id === edge.source
//                 );
//                 return sourceNode?.data.connectionOrder ?? -1;
//               });

//             // Update the connectionOrder for the target node
//             const maxPredecessorOrder = Math.max(...predecessorOrders, -1);
//             return {
//               ...node,
//               data: {
//                 ...node.data,
//                 connectionOrder: maxPredecessorOrder + 1,
//               },
//             };
//           }
//           return node;
//         });

//         return {
//           nodes: updatedNodes,
//           edges: updatedEdges,
//         };
//       });
//     },

//     updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => {
//       set({
//         nodes: get().nodes.map((node) => {
//           if (node.id === nodeId) {
//             node.data = { ...node.data, [fieldName]: fieldValue };
//           }
//           return node;
//         }),
//       });
//     },

//     deleteNode: (nodeId: string) => {
//       set({
//         nodes: get().nodes.filter((node) => node.id !== nodeId),
//         edges: get().edges.filter(
//           (edge) => edge.source !== nodeId && edge.target !== nodeId
//         ),
//       });
//     },

//     deleteEdge: (edgeId: string) => {
//       set({
//         edges: get().edges.filter((edge) => edge.id !== edgeId),
//       });
//     },
//   })
// );



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
import { v4 as uuid } from "uuid";

type WorkflowExecutionUpdateType = {
  nodeId: string;
  status: string;
};

interface CustomNode extends Node {
  connectionOrder: number; // Directly store connectionOrder here
}

export interface WorkflowStoreState {
  nodes: CustomNode[];
  edges: Edge[];
  nodeIDs: Record<string, number>;
  workflowExecutionUpdate: WorkflowExecutionUpdateType[];

  totalSteps: number;
  currentStep: number;

  nextConnectionOrder: number;

  sortNodesByConnectionOrder: () => void;
  addWorkflowExecutionUpdate: (
    nodeId: string,
    status: string,
    totalSteps: number,
    currentStep: number
  ) => void;
  addNodesAndEdges: (nodes: CustomNode[], edges: Edge[]) => void;
  getNodeID: (type: string) => string;
  addNode: (node: CustomNode) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
}

export const useWorkflowStore = createWithEqualityFn<WorkflowStoreState>(
  (set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    workflowExecutionUpdate: [],
    nextConnectionOrder: 0,
    totalSteps: 0,
    currentStep: 0,

    sortNodesByConnectionOrder: () =>
      set((state) => ({
        nodes: [...state.nodes].sort(
          (a, b) => (a.connectionOrder ?? Infinity) - (b.connectionOrder ?? Infinity)
        ),
      })),

    addWorkflowExecutionUpdate: (
      nodeId: string,
      status: string,
      totalSteps: number,
      currentStep: number
    ) => {
      set((state) => ({
        workflowExecutionUpdate: [
          ...state.workflowExecutionUpdate,
          { nodeId, status },
        ],
      }));

      if (totalSteps && totalSteps > 0 && currentStep && currentStep > 0) {
        set((state) => ({
          totalSteps,
          currentStep,
        }));
      }
    },

    addNodesAndEdges: (nodes: CustomNode[], edges: Edge[]) => {
      set((state) => {
        if (
          JSON.stringify(state.nodes) !== JSON.stringify(nodes) ||
          JSON.stringify(state.edges) !== JSON.stringify(edges)
        ) {
          return {
            nodes,
            edges,
          };
        }
        return state;
      });
    },

    getNodeID: (type: string) => {
      const newIDs = { ...get().nodeIDs };
      if (newIDs[type] === undefined) {
        newIDs[type] = 0;
      }
      newIDs[type] += 1;
      set({ nodeIDs: newIDs });
      return uuid();
    },

    addNode: (node: CustomNode) => {
      set((state) => {
        return {
          nodes: [
            ...state.nodes,
            {
              ...node,
              connectionOrder: 0, // Start with a default order
            },
          ],
        };
      });
    },

    // onNodesChange: (changes: NodeChange[]) => {
    //   set({
    //     nodes: applyNodeChanges(changes, get().nodes),
    //   });
    // },

    onNodesChange: (changes: NodeChange[]) => {
      set((state) => {
        const updatedNodes = applyNodeChanges(changes, state.nodes).map((node) => ({
          ...node,
          connectionOrder: (node as CustomNode).connectionOrder ?? 0,
        }));
    
        return {
          nodes: updatedNodes as CustomNode[],
        };
      });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },

    onConnect: (connection: Connection) => {
      set((state) => {
        const updatedEdges = addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            deletable: true,
            style: { color: "red" },
            markerEnd: { type: MarkerType.Arrow, height: 20, width: 20 },
          },
          state.edges
        );

        const updatedNodes = state.nodes.map((node) => {
          if (node.id === connection.target) {
            // Find maximum connectionOrder among all predecessors
            const predecessorOrders = updatedEdges
              .filter((edge) => edge.target === node.id)
              .map((edge) => {
                const sourceNode = state.nodes.find((n) => n.id === edge.source);
                return sourceNode?.connectionOrder ?? -1;
              });

            // Update the connectionOrder for the target node
            const maxPredecessorOrder = Math.max(...predecessorOrders, -1);
            return {
              ...node,
              connectionOrder: maxPredecessorOrder + 1, // Update the connectionOrder directly
            };
          }
          return node;
        });

        return {
          nodes: updatedNodes,
          edges: updatedEdges,
        };
      });
    },

    updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              [fieldName]: fieldValue,
            };
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
  })
);
