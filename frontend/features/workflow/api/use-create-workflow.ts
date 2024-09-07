import { ApiResponseType, WorkflowType } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = ApiResponseType<undefined>;
type RequestType = WorkflowType;

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const endpoint = "http://localhost:4000/api/v1/workflow/create";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      });
      const data = await response.json();
      if (response.ok) {
        // toast.success(data.message);
        return data;
      } else {
        toast.error(data.message);
      }
    },
    onSuccess: () => {
      // This will refetch the all workflows, every time I create new workflow
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("error in creating workflow : ", err.message);
    },
  });

  return mutation;
};
