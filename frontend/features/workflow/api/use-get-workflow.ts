import { ApiResponseType, GetWorkflowType } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetWorkflow = (id?: string) => {
  const query = useQuery({
    queryKey: ["get-workflow"],
    queryFn: async () => {

      if (!id) {
        throw new Error("Failed to fetch workflow data");;
      }
      const endpoint = `http://localhost:4000/api/v1/workflow/${id}`;
      const response = await fetch(endpoint);
      const data: ApiResponseType<GetWorkflowType> = await response.json();
      if (response.ok) {
        if (data.data) {
          return data.data;
        }
      } else {
        toast.error(data.message);
        throw new Error("Failed to fetch workflow data");;
        //   throw new Error("Failed to fetch workflow data");
      }
    },
  });
  return query;
};
