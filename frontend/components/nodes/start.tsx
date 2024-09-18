
import { Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { CirclePlay } from "lucide-react";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";

export const StartNode = ({ id, data }: any) => {

  return (
    <NodeWrapper icon={<CirclePlay className="size-4" />} label="Start" nodeId={id}>
      <p>Start Node</p>

      <CustomHandle id={uuid()} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
