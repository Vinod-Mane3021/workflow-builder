import { v4 as uuid } from "uuid";
import React, { CSSProperties } from "react";
import { Connection, Handle, HandleType, Position } from "reactflow";
import { useWorkflowStore } from "@/store/use-workflow-store";
import { CustomNodeType } from "@/types/node";
import { toast } from "sonner";

type CustomHandle = {
  id?: string;
  nodeId?: string;
  nodeType?: CustomNodeType
  type: HandleType;
  position: Position;
  style?: CSSProperties;
  notAllowedTargets?: string[]
  notAllowedSource?: string[]
};

const CustomHandle = ({ id, type, position, style, nodeId, nodeType, notAllowedTargets = [], notAllowedSource = [] }: CustomHandle) => {
  const { edges, nodes } = useWorkflowStore()

  const getNodeType = (nodeId: string | null) => {
    const found = nodes.find(node => nodeId && (node.id == nodeId))?.type

    return found
  }

  
  const getEdge = (nodeId: string) => {
    const edgeFound = edges.find(edge => nodeId && (edge.target == nodeId || edge.source == nodeId))

    return edgeFound;
  }
  
  const onConnect = (con: Connection) => {
    console.log({edges})

    console.log({con})

    const sourceType = getNodeType(con.source)
    const targetType = getNodeType(con.target)

    if(sourceType && con.source && targetType && con.target) {
      if(notAllowedSource.includes(sourceType) || notAllowedTargets.includes(targetType)) {
        console.log({delete: getEdge(con.source)})
        toast.warning(`You can't connect from ${sourceType} to ${targetType}, delete this edge`)
        console.log("delete this sourceType edge ", sourceType)
      }
    }
  }

  return (
    <Handle
      type={type}
      position={position}
      onConnect={onConnect}
      style={{
        ...style,
        fontSize: 90,
        backgroundColor: "white",
        height: 15,
        width: 15,
        borderColor: "gray",
        transition: "outline-color 0.5s",
      }}
      onMouseEnter={(e: any) => {
        e.target.style.outline = "4px solid #a9abf7";
      }}
      onMouseLeave={(e: any) => (e.target.style.outlineColor = "transparent")}
    />
  );
};

export default CustomHandle;
