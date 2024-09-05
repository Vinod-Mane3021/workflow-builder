// outputNode.js

import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { Label } from "../ui/label";
import { MdOutlineOutput } from "react-icons/md";
import { Send } from "lucide-react";
import CustomHandle from "../custom-handle";

export const SendPOSTRequestNode = ({ id, data }: any) => {
  

  return (
    <NodeWrapper
      icon={<Send className="size-4" />}
      label="Send"
      nodeId={id}
    >
      <p>Send POST Request Node</p>


      <CustomHandle id={`${id}-send-left`} type="target" position={Position.Left} />
      <CustomHandle id={`${id}-send-right`} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
