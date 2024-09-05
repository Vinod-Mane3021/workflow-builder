"use client";

import CustomBreadcrumb from "@/components/custom-breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WorkflowToolbar } from "@/components/workflow-toolbar";
import { WorkflowUI } from "@/components/workflow-ui";
import { exitWorkflowProps } from "@/constants/props";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { CircleX, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type CreateWorkflowProps = {
  id: string;
};

const CreateWorkflowPage = ({ id }: CreateWorkflowProps) => {
  const [ConfirmationDialog, confirm] = useConfirm(exitWorkflowProps);
  const router = useRouter();
  const SaveWorkflow = () => {
    console.log("Save Workflow");
  };

  const [name, setName] = useState("Workflow name");
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleExitWorkflow = async () => {
    const ok = await confirm();
    if (ok) {
      router.push("/workflow")
      toast.warning("Exited from workflow");
    }
  };

  return (
    <>
      <ConfirmationDialog />
      <div className="border border-gray-300 shadow-sm mx-2 my-2 rounded-lg h-[98vh]">
        {/* header */}
        <div className="">
          <div className="py-2 px-2 flex items-center justify-between">
            <div className="hidden sm:flex w-fit">
              <CustomBreadcrumb />
            </div>
            <div className="flex items-center gap-2">
              <Input
                contentEditable={false}
                className="rounded-full h-7 text-center text-sm"
                type="text"
                value={name}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={SaveWorkflow}
                className="h-7 hover:cursor-pointer"
                variant="outline"
              >
                Save Workflow
              </Button>
              <Button
                onClick={handleExitWorkflow}
                className="h-7 hover:cursor-pointer"
                variant="outline"
              >
                Exit
                <CircleX className="size-4 ml-2" />
              </Button>
            </div>
          </div>
          <Separator orientation="horizontal" />
        </div>

        <WorkflowToolbar />
        <WorkflowUI />
      </div>
    </>
  );
};

export default CreateWorkflowPage;
