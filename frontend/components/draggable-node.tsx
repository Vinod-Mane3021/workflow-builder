import { cn } from "@/lib/utils";
import { ComponentType, DragEvent } from "react";
import { NodeTypes } from "reactflow";
import { CustomNodeType } from "@/types/node";

type DraggableNodeType = {
  type: CustomNodeType;
  label: string;
  icon: JSX.Element;
};

export const DraggableNode = ({ type, label, icon }: DraggableNodeType) => {
  const onDragStart = (event: any, nodeType: string) => {
    const appData = { nodeType };
    event.target.style.cursor = "grabbing";
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={cn(
        type,
        "cursor-grab flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex-col border border-gray-300 text-muted-foreground font-semibold gap-1"
      )}
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event: any) => (event.target.style.cursor = "grab")}
      draggable
    >
      {icon}
      <span className="text-xs md:text-sm">{label}</span>
    </div>
  );
};
