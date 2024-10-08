// textNode.js

import { useState } from "react";
import { Handle, Position } from "reactflow";
import { Braces, CircleX, FileText, Recycle } from "lucide-react";

import NodeWrapper from "./nodeWrapper";
import CustomTooltip from "../custom-tooltip";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";

export const ConvertFormatNode = ({ id, data }: any) => {
  

  return (
    <NodeWrapper icon={<Recycle className="size-4" />} label="Convert" nodeId={id}>
      <p>Convert Format Node</p>

      <CustomHandle id={uuid()} type="target" position={Position.Left} />
      <CustomHandle id={uuid()} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
