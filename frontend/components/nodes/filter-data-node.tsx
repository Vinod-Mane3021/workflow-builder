import { useState } from "react";
import NodeWrapper from "./nodeWrapper";
import { Position } from "reactflow";
import { ArrowDownWideNarrow } from "lucide-react";
import CustomHandle from "../custom-handle";

type InputNodeProps = {
  id: string;
  data: any;
};

export const FilterDataNode = ({ id, data }: InputNodeProps) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");

  const handleNameChange = (e: any) => {
    setCurrName(e.target.value);
  };

  return (
    <NodeWrapper
      icon={<ArrowDownWideNarrow className="size-4" />}
      label="Filter"
      nodeId={id}
    >
      <p>Filter Data Node</p>

      <CustomHandle id={`${id}-filter-left`} type="target" position={Position.Left} />
      <CustomHandle id={`${id}-filter-right`} type="source" position={Position.Right} />
    </NodeWrapper>
  );
};
