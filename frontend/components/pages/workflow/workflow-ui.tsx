"use client";

// Displays the drag-and-drop UI

import { useState, useRef, useCallback, DragEvent } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  ReactFlowInstance,
  ConnectionLineType,
} from "reactflow";
import { shallow } from "zustand/shallow";

import "reactflow/dist/style.css";
import {
  useWorkflowStore,
  WorkflowStoreState,
} from "@/store/use-workflow-store";
import { useFirstMountState, useMountedState } from "react-use";
import { FilterDataNode } from "@/components/nodes/filter-data-node";
import { WaitNode } from "@/components/nodes/wait-node";
import { ConvertFormatNode } from "@/components/nodes/convert-format-node";
import { SendPOSTRequestNode } from "@/components/nodes/send-post-request-node";
import { useGetWorkflow } from "@/features/workflow/api/use-get-workflow";
import { WorkflowType } from "@/types";
import { StartNode } from "@/components/nodes/start";
import { EndNode } from "@/components/nodes/end";
import { CustomEdge } from "@/components/nodes/custom-edge";

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  filterData: FilterDataNode,
  wait: WaitNode,
  convertFormat: ConvertFormatNode,
  sendPOSTRequest: SendPOSTRequestNode,
  start: StartNode,
  end: EndNode
};

const edgeTypes = {
  'custom-edge': CustomEdge
}

const selector = (state: WorkflowStoreState) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  updateNodeField: state.updateNodeField,
  deleteNode: state.deleteNode,
  deleteEdge: state.deleteEdge,
  nodeIDs: state.nodeIDs,
  addNodesAndEdges: state.addNodesAndEdges,
});


type Props = {
  type: "create" | "update";
  id?: string;
};

export const WorkflowUI = ({ id, type }: Props) => {
  
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    any,
    any
  > | null>(null);


  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useWorkflowStore(selector, shallow);

  const getInitNodeData = (nodeID: string, type: string) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      if (
        !event ||
        !reactFlowWrapper ||
        !reactFlowWrapper.current ||
        !reactFlowInstance
      ) {
        return;
      }

      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div
      className="w-[98vw] h-[81vh] relative pt-2 pl-2"
      ref={reactFlowWrapper}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        // edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background color="#aaa" gap={gridSize} />
        <Controls />
        <MiniMap position="bottom-right" />
      </ReactFlow>
    </div>
  );
};



