
import { Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { CalendarCheck2 } from "lucide-react";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";

export const EndNode = ({ id, data }: any) => {

  return (
    <NodeWrapper icon={<CalendarCheck2 className="size-4" />} label="End" nodeId={id}>
      <p>End Node</p>

      <CustomHandle id={uuid()} type="target" position={Position.Left} />
    </NodeWrapper>
  );
};
