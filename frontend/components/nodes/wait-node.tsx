
import { Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { Loader } from "lucide-react";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";
import { useWorkflowStore } from "@/store/use-workflow-store";

export const WaitNode = ({ id, data }: any) => {

  return (
    <NodeWrapper icon={<Loader className="size-4" />} label="Wait" nodeId={id}>
      <p>Wait Node</p>

      <CustomHandle id={uuid()} type="target" position={Position.Left} />
      <CustomHandle id={uuid()} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
