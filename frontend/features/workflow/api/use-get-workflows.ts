import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

const data = [
  { id: "1_zhsgdvfbjzshbfv", name: "workflow 1" },
  { id: "2_zjshrbfvkzhjdbfk", name: "workflow 2" },
  { id: "2_zjshrbfvkzhjdbfasdk", name: "workflow 3" },
  { id: "2_zjshrbfvkzhjdbfksdvsv", name: "workflow 4" },
  { id: "1_zhsgdvfbjzshbfsascv", name: "workflow 5" },
  { id: "2_zjshrbfvkzhjdascabfk", name: "workflow 6" },
  { id: "2_zjshrbfvkzhjdascsdk", name: "workflow 7" },
  { id: "2_zjshrbfvkzhjdasdvsv", name: "workflow 8" },
];

export const useGetWorkflows = () => {
  const query = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      {
        const endpoint = "https://ui.shadcn.com/docs/components/input";
        const response = await axios.get(endpoint);

        if (response.status == 200) {
          return data;
        } else {
        //   return toast.error("Failed to fetch workflow data");
          throw new Error("Failed to fetch workflow data");
        }
      }
    },
  });
  return query;
};
