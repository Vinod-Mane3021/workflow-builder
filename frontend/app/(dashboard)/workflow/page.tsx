"use client";

import { Edit2, Plus } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import CustomTooltip from "@/components/custom-tooltip";
import { useGetWorkflows } from "@/features/workflow/api/use-get-workflows";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date";
import { GetWorkflowType } from "@/types";
import { DataCardLoading } from "@/components/loaders/data-card-loading";

const WorkflowPage = () => {
  const router = useRouter();
  const workflowsQuery = useGetWorkflows();

  const workflows = workflowsQuery.data || [];
  const isLoading = workflowsQuery.isLoading;

  const onClickCreate = () => {
    router.push("/workflow/create");
  };

  const onClickEdit = (id: string) => {
    router.push(`/workflow/update/${id}`);
  };

  if (isLoading) {
    return (
      <div className="py-5 md:py-8 px-2 md:px-8">
        {/* load data */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
          <DataCardLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 md:py-8 px-2 md:px-8">
      {/* load data */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
        {workflows.length > 0 &&
          workflows.map((item) => (
            <DataCard key={item.id} workflow={item} onClickEdit={onClickEdit} />
          ))}
        <Card className="border-none drop-shadow-sm h-36 flex items-center justify-center">
          <CardContent className="flex flex-col items-center justify-center">
            <>
              <CustomTooltip label="Create workflow">
                <Plus
                  onClick={onClickCreate}
                  className="size-6 cursor-pointer "
                />
              </CustomTooltip>
              <p className="text-sm text-muted-foreground">Create a workflow</p>
            </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowPage;

const DataCard = ({
  workflow,
  onClickEdit,
}: {
  workflow: GetWorkflowType;
  onClickEdit: (id: string) => void;
}) => {
  return (
    <Card className="border-none drop-shadow-sm h-36">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-1">
          <CardTitle className="text-2xl line-clamp-1">
            {workflow.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            id : {workflow.id}
          </CardDescription>
        </div>

        <CustomTooltip label="Edit workflow">
          <div
            className={"shrink-0 rounded-md p-3 bg-blue-500/20 cursor-pointer"}
            onClick={() => onClickEdit(workflow.id)}
          >
            <Edit2 className={"size-4"} />
          </div>
        </CustomTooltip>
      </CardHeader>
      <CardContent>
        <p className={cn("text-muted-foreground text-sm line-clamp-1 ")}>
          Last updated on{" "}
          <span className="text-emerald-500 font-semibold">
            {formatDate(workflow.updatedAt)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

