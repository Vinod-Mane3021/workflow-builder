
import { Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { Loader } from "lucide-react";
import CustomHandle from "../custom-handle";

export const WaitNode = ({ id, data }: any) => {
  return (
    <NodeWrapper icon={<Loader className="size-4" />} label="Wait" nodeId={id}>
      <p>Wait Node</p>

      <CustomHandle id={`${id}-wait-left`} type="target" position={Position.Left} />
      <CustomHandle id={`${id}-wait-right`} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
