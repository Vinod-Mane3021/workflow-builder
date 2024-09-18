"use client";

import Workflow from "@/components/pages/workflow/workflow";
import { useGetWorkflow } from "@/features/workflow/api/use-get-workflow";
import { useWorkflowStore } from "@/store/use-workflow-store";
import { useEffect } from "react";

type Props = {
  params: {
    id: string;
  };
};

const UpdateWorkflowPage = ({ params }: Props) => {

  const { addNodesAndEdges } = useWorkflowStore();

  const workflowQuery = useGetWorkflow(params.id)
  const workflow = workflowQuery.data

  const isLoading = workflowQuery.isLoading
  const isSuccess = workflowQuery.isSuccess;

  useEffect(() => {
    if(isLoading) {
      addNodesAndEdges([], []);
    }
    if (workflow && isSuccess) {
      // console.log({UpdateWorkflowPage: workflow})
      // console.log({id: params.id, workflowId: workflow.id, name: workflow.name})
      addNodesAndEdges(workflow.nodes, workflow.edges);
    }
  }, [isSuccess, params.id])
  
  if(isLoading) {
    return <p>Loading</p>
  }

  return <Workflow type="update" id={params.id} name={workflow?.name}/>;
};

export default UpdateWorkflowPage;



