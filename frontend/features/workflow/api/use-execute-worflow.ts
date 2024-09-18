import { ApiResponseType, WorkflowType } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = ApiResponseType<undefined>;
type RequestType = {
  id: string;
  file: File;
};

export const useExecuteWorkflow = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const formData = new FormData();
      formData.append("file", json.file);

      const endpoint = `http://localhost:4000/api/v1/workflow/execute/${json.id}`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log({backendData: data})
      if (response.ok) {
        toast.success(data.message);
        return data;
      } else {
        toast.error(data.message);
      }
    },
    onSuccess: () => {
      // This will refetch the all workflows, every time I create new workflow
    //   queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: (err) => {
      toast.error(err.message);
      console.error("error in creating workflow : ", err.message);
    },
  });

  return mutation;
};
