"use client";

import {
  ArrowDownWideNarrow,
  Loader,
  Recycle,
  Send,
} from "lucide-react";
import { DraggableNode } from "./draggable-node";
import Navigation from "./navigation";
import { Button } from "./ui/button";

export const WorkflowToolbar = () => {

  return (
    <div className="shadow-md px-2 flex justify-between items-center py-2">
      <div className="flex flex-row items-center gap-x-2  ">
        <DraggableNode
          type="filterData"
          label="Filter"
          icon={<ArrowDownWideNarrow className="size-3 md:size-4" />}
        />
        <DraggableNode
          type="wait"
          label="Wait"
          icon={<Loader className="size-3 md:size-4" />}
        />
        <DraggableNode
          type="convertFormat"
          label="Convert"
          icon={<Recycle className="size-3 md:size-4" />}
        />
        <DraggableNode
          type="sendPOSTRequest"
          label="Send"
          icon={<Send className="size-3 md:size-4" />}
        />
      </div>
    </div>
  );
};
