import React, { ReactNode } from "react";
import NodeContextMenu from "../node-context-menu";
import { cn } from "../../lib/utils";
import { CircleX } from "lucide-react";
import CustomTooltip from "../custom-tooltip";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteNodeDialogProps } from "@/constants/props";
import { useWorkflowStore } from "@/store/use-workflow-store";

type NodeWrapper = {
  children: ReactNode,
  label: string,
  icon: JSX.Element,
  className?: string,
  nodeId: string
}

const NodeWrapper = ({ children, label, icon, className, nodeId }: NodeWrapper) => {
  const { deleteNode } = useWorkflowStore();

  const [ConfirmationDialog, confirm] = useConfirm(deleteNodeDialogProps);

  const handleRemoveNode = async () => {
    const isConfirm = await confirm();
    if (isConfirm) {
      deleteNode(nodeId);
      toast.success("Node deleted");
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <NodeContextMenu>
        <div
          style={{ width: 250 }}
          className={cn(
            className,
            "bg-white relative rounded-xl px-5 py-3 border border-blue-700 outline outline-4 outline-[#a9abf7]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              {icon}
              <span className="font-semibold">{label}</span>
            </div>
            <CustomTooltip label="Delete">
              <CircleX
                className="top-0 right-0 text-muted-foreground cursor-pointer hover:text-rose-500"
                onClick={handleRemoveNode}
                size={16}
              />
            </CustomTooltip>
          </div>
          {children}
        </div>
      </NodeContextMenu>
    </>
  );
};

export default NodeWrapper;
