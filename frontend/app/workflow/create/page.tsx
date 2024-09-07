"use client";

import Workflow from "@/components/pages/workflow/workflow";
import { uuid } from "@/lib/utils";
import { useWorkflowStore } from "@/store/use-workflow-store";
import { useEffect } from "react";

const CreateWorkflowPage = () => {

  const { addNodesAndEdges } = useWorkflowStore();

  useEffect(() => {
    addNodesAndEdges([], []);
  }, [])
  
  return <Workflow type="create" name="untitled" id={uuid()} />;
};

export default CreateWorkflowPage;
