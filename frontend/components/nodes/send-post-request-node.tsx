// outputNode.js

import { useState } from "react";
import { Connection, Handle, OnConnect, Position } from "reactflow";
import NodeWrapper from "./nodeWrapper";
import { Label } from "../ui/label";
import { MdOutlineOutput } from "react-icons/md";
import { Send } from "lucide-react";
import CustomHandle from "../custom-handle";
import { uuid } from "@/lib/utils";

export const SendPOSTRequestNode = ({ id, data }: any) => {
  const [connection, setConnection] = useState({
    targetId: "",
    sourceId: "",
  });

  const onConnect = (connection: Connection) => {
    console.log({ sourceId: connection.source, targetId: connection.target });
    if (connection.source && connection.target) {
      setConnection({
        sourceId: connection.source,
        targetId: connection.target,
      });
    }
  };

  return (
    <NodeWrapper icon={<Send className="size-4" />} label="Send" nodeId={id}>
      <p>Send POST Request Node</p>

      <CustomHandle
        notAllowedTargets={["convertFormat", "filterData"]}
        notAllowedSource={[]}
        nodeType="sendPOSTRequest"
        id={uuid()}
        nodeId={id}
        type="target"
        position={Position.Left}
      />
      <CustomHandle
        id={uuid()}
        type="source"
        position={Position.Right}
        notAllowedTargets={["convertFormat", "filterData"]}
        notAllowedSource={[]}
      />
    </NodeWrapper>
  );
};
