import React, { useState } from "react";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WorkflowToolbar } from "@/components/workflow-toolbar";
import { WorkflowUI } from "./workflow-ui";
import { exitWorkflowProps } from "@/constants/props";
import { useConfirm } from "@/hooks/use-confirm";
import { Check, CircleCheck, Loader2, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateWorkflow } from "@/features/workflow/api/use-create-workflow";
import { EdgeType, NodeType, WorkflowType } from "@/types";
import { useUpdateWorkflow } from "@/features/workflow/api/use-update-workflow";
import { useWorkflowStore } from "@/store/use-workflow-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  type: "create" | "update";
  id?: string;
  name?: string;
  // initialWorkflow?: WorkflowType
};

const Workflow = ({ type, id, name }: Props) => {
  const router = useRouter();
  const createWorkflowMutation = useCreateWorkflow();
  const updateWorkflowMutation = useUpdateWorkflow();
  const { nodes, edges } = useWorkflowStore();

  const [workflowName, setWorkflowName] = useState(name);
  const [ConfirmationDialog, confirm] = useConfirm(exitWorkflowProps);

  const [executeStatus, setExecuteStatus] = useState<"idle" | "running" | "completed">("idle")

  const isPending = createWorkflowMutation.isPending || updateWorkflowMutation.isPending;
  const isSuccess = createWorkflowMutation.isSuccess || updateWorkflowMutation.isSuccess;

  const onSaveWorkflow = () => {
    if (!id) {
      return
    }
    if(!workflowName || workflowName == "untitled") {
      return toast.warning("Please give a valid workflow name to workflow")
    }
    if (!edges || edges.length == 0 || !nodes || nodes.length == 0) {
      return toast.warning("You have not created valid workflow")
    }

    const convertedNodes: NodeType[] = nodes.map((node) => {
      return {
        id: node.id,
        type: node.type || "",
        position: {
          x: node.position.x,
          y: node.position.y,
        },
        data: {
          id: node.data.id,
          nodeType: node.data.nodeType,
        },
      };
    });

    const convertedEdges: EdgeType[] = edges.map((edge) => {
      return {
        id: edge.id,
        type: edge.type || "",
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || "",
        targetHandle: edge.targetHandle || "",
        animated: edge.animated || true,
      };
    });

    if (type === "update") {
      updateWorkflowMutation.mutate({
        id,
        name: workflowName,
        nodes: convertedNodes,
        edges: convertedEdges,
      });
    }

    if (type === "create") {
      createWorkflowMutation.mutate({
        id,
        name: workflowName,
        nodes: convertedNodes,
        edges: convertedEdges,
      });
    }
  };

  const onExecuteWorkflow = async () => {
    
  }

  const handleExitWorkflow = async () => {
    const ok = await confirm();
    if (ok) {
      router.replace("/workflow");
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="border border-gray-300 shadow-sm mx-2 my-2 rounded-lg h-[98vh]">
        {/* header */}
        <div className="">
          <div className="py-2 px-2 flex flex-col sm:flex-row gap-2 items-center justify-between">
            <div className="hidden sm:flex">
              <CustomBreadcrumb skipLast={type == "update" ? 1 : undefined} />
            </div>
            <div className="flex items-center gap-2">
              <Input
                placeholder="workflow name"
                contentEditable={false}
                className={cn(
                  "rounded-full h-7 text-center text-sm",
                  !workflowName && "border border-rose-600"
                )}
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={onExecuteWorkflow}
                className="text-xs h-7 hover:cursor-pointer"
                variant="outline"
              >
                Execute
                <Play className="size-3 ml-2"/>
              </Button>
              <Button
                onClick={onSaveWorkflow}
                className="text-xs h-7 hover:cursor-pointer"
                variant="outline"
              >
                {type == "create" ? "Create Workflow" : "Save Workflow"}
                {isPending && (
                  <Loader2 className="size-4 ml-2 animate-spin text-muted-foreground" />
                )}
                {isSuccess && (
                  <Check className="size-4 ml-2 bg-green-400 rounded-full p-[1px] border-[1px] border-green-700"/>
                )}
              </Button>
              <Button
                onClick={handleExitWorkflow}
                className="text-xs h-7 hover:cursor-pointer"
                variant="outline"
              >
                Exit
                <X className="size-4 ml-2" />
              </Button>
            </div>
          </div>
          <Separator orientation="horizontal" />
        </div>
        <WorkflowToolbar />
        <WorkflowUI type={type} id={id} />
      </div>
    </>
  );
};

export default Workflow;
