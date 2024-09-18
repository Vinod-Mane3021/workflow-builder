import React, { useEffect, useState } from "react";
import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WorkflowToolbar } from "@/components/workflow-toolbar";
import { WorkflowUI } from "./workflow-ui";
import { exitWorkflowProps, fileUploadProps } from "@/constants/props";
import { useConfirm } from "@/hooks/use-confirm";
import { Check, CircleCheck, CloudFog, Loader2, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateWorkflow } from "@/features/workflow/api/use-create-workflow";
import { EdgeType, NodeType, WorkflowType } from "@/types";
import { useUpdateWorkflow } from "@/features/workflow/api/use-update-workflow";
import { useWorkflowStore } from "@/store/use-workflow-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useExecuteWorkflow } from "@/features/workflow/api/use-execute-worflow";
import { io as socketio, Socket } from "socket.io-client";
import { useUploadFile } from "@/hooks/use-upload-file";

type Props = {
  type: "create" | "update";
  id?: string;
  name?: string;
  // initialWorkflow?: WorkflowType
};

const Workflow = ({ type, id, name }: Props) => {
  const {
    addWorkflowExecutionUpdate,
    nodes,
    edges,
    workflowExecutionUpdate,
    totalSteps,
    currentStep,
  } = useWorkflowStore();
  const router = useRouter();
  const createWorkflowMutation = useCreateWorkflow();
  const updateWorkflowMutation = useUpdateWorkflow();
  const executeWorkflowMutation = useExecuteWorkflow();

  const [workflowName, setWorkflowName] = useState(name);
  const [ConfirmationDialog, confirm] = useConfirm(exitWorkflowProps);
  const [ConfirmationFileUploadDialog, confirmFileUpload] =
    useUploadFile(fileUploadProps);

  const isPending =
    createWorkflowMutation.isPending || updateWorkflowMutation.isPending;
  const isSuccess =
    createWorkflowMutation.isSuccess || updateWorkflowMutation.isSuccess;

  const onSaveWorkflow = () => {
    console.log("onSaveWorkflow")
    if (!id) {
      return;
    }
    if (!workflowName || workflowName == "untitled") {
      return toast.warning("Please give a valid workflow name to workflow");
    }
    if (!edges || edges.length == 0 || !nodes || nodes.length == 0) {
      return toast.warning("You have not created valid workflow");
    }

    console.log({nodes})
    console.log({edges})

    console.log({
      order: nodes[0].connectionOrder,
    })

    const startNode = nodes.find(node => (node.connectionOrder == 0 && node.type == "start"))
    const endNode = nodes.find(node => (node.connectionOrder == nodes.length-1 && node.type == "end"))

    if(!startNode) {
      return toast.warning("Please add start node at the starting of workflow")
    }

    if(!endNode) {
      return toast.warning("Please add end node at the end of workflow")
    }

    const sendNode = nodes.find(node => (node.type == "sendPOSTRequest"))

    // const sourceEdge = edges.find(edge => 
    //   edge.target == sendNode?.id
    // )

    // console.log({sourceEdge})
    

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
        connectionOrder: node.connectionOrder,
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

    
    console.log({ convertedNodes });
    console.log({ convertedEdges });

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
    const file = await confirmFileUpload();
    if (id && file) {
      connectSocket();
      executeWorkflowMutation.mutate({
        id: id,
        file: file,
      });

      console.log({ id, file });
    }
  };

  const handleExitWorkflow = async () => {
    const ok = await confirm();
    if (ok) {
      // addNodesAndEdges([], []);
      router.replace("/workflow");
    }
  };

  const connectSocket = () => {
    const newSocket = socketio(`http://localhost:4000`);

    console.log("turn on socketio");

    newSocket.on("nodeStatus", (data) => {
      // console.log("--------->   dataId = ", data.nodeId + "  |  " + "status = " + data.status);

      addWorkflowExecutionUpdate(
        data.nodeId,
        data.status,
        data.totalSteps,
        data.currentStep
      );
    });
    console.log("Cose the socket");
  };

  // useEffect(() => {
  //   return () => {
  //     newSocket.close();
  //   }
  // }, [])

  return (
    <>
      <ConfirmationDialog />
      <ConfirmationFileUploadDialog />
      <div className="border border-gray-300 shadow-sm mx-2 my-2 rounded-lg h-[98vh] relative">
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
              {type === "update" && (
                <Button
                  onClick={onExecuteWorkflow}
                  className="text-xs h-7 hover:cursor-pointer"
                  variant="outline"
                >
                  Execute
                  <Play className="size-3 ml-2" />
                  {/* {workflowExecutionUpdate && (
                  <p className="text-green-500 font-bold ml-2">{workflowExecutionUpdate.status}</p>
                )} */}
                </Button>
              )}
              <Button
                className={cn("text-xs h-7 hover:cursor-pointer",)}
                disabled={createWorkflowMutation.isSuccess}
                onClick={onSaveWorkflow}
                variant="outline"
              >
                {type == "create" ? "Create Workflow" : "Save Workflow"}
                {isPending && (
                  <Loader2 className="size-4 ml-2 animate-spin text-muted-foreground" />
                )}
                {isSuccess && (
                  <Check className="size-4 ml-2 bg-green-400 rounded-full p-[1px] border-[1px] border-green-700" />
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
        {workflowExecutionUpdate.length && (
          <div className="w-full absolute bottom-10 flex items-center justify-center">
            <div className="w-fit backdrop-blur-sm px-5 py-1 rounded-full bg-green-400/25">
              <p className="text-xs md:text-sm text-primary ">
                Step{" "}
                <span className="text-blue-700 font-semibold">
                  {currentStep}
                </span>{" "}
                of {totalSteps} Completed
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Workflow;
