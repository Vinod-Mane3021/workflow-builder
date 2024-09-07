// outputNode.js

import { useState } from "react";
import { Handle, Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { Label } from "../ui/label";
import { MdOutlineOutput } from "react-icons/md";
import { Send } from "lucide-react";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";

export const SendPOSTRequestNode = ({ id, data }: any) => {
  

  return (
    <NodeWrapper
      icon={<Send className="size-4" />}
      label="Send"
      nodeId={id}
    >
      <p>Send POST Request Node</p>


      <CustomHandle id={uuid()} type="target" position={Position.Left} />
      <CustomHandle id={uuid()} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
