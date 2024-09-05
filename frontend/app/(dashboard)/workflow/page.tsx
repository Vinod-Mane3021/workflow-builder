"use client"

import { Edit2 } from "lucide-react";
import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
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

const WorkflowPage = () => {
  const workflowsQuery = useGetWorkflows();

  const workflows = workflowsQuery.data || [];
  const isLoading = workflowsQuery.isLoading;

  if (isLoading) {
    return <p>Loading workflows...</p>;
  }

  return (
    <div className="py-5 md:py-8 px-2 md:px-8">
      {/* load data */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
        {workflows.map((item) => (
          <div key={item.id}>
            <Card className="border-none drop-shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl line-clamp-1">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    id : {item.id}
                  </CardDescription>
                </div>

                <CustomTooltip label="Edit workflow">
                  <div
                    className={
                      "shrink-0 rounded-md p-3 bg-blue-500/20 cursor-pointer"
                    }
                  >
                    <Edit2 className={"size-4"} />
                  </div>
                </CustomTooltip>
              </CardHeader>
              <CardContent>
                <p
                  className={cn(
                    "text-muted-foreground text-sm line-clamp-1 text-emerald-500"
                  )}
                >
                  80% from last period
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowPage;
