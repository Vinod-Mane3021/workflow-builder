import { ApiResponseType, GetWorkflowType } from "@/types/index";
import { useQuery } from "@tanstack/react-query";
import { Edge } from "reactflow";

const nodes = [
  {
    id: "filterData-1",
    type: "filterData",
    position: { x: 20.199999809265137, y: 127.19999694824219 },
    data: { id: "filterData-1", nodeType: "filterData" },
  },
  {
    id: "wait-1",
    type: "wait",
    position: { x: 435.19999980926514, y: 117.19999694824219 },
    data: { id: "wait-1", nodeType: "wait" },
  },
];

const edges: Edge[] = [
  {
    id: "reactflow__edge-filterData-1filterData-1-filter-right-wait-1wait-1-wait-left",
    source: "filterData-1",
    sourceHandle: "filterData-1-filter-right",
    target: "wait-1",
    targetHandle: "wait-1-wait-left",
    type: "smoothstep",
    animated: true,
  },
];

const workflows = [
  { id: "1_zhsgdvfbjzshbfv", name: "workflow 1", nodes, edges },
  { id: "2_zjshrbfvkzhjdbfk", name: "workflow 2", nodes, edges },
  { id: "2_zjshrbfvkzhjdbfasdk", name: "workflow 3", nodes, edges },
  { id: "2_zjshrbfvkzhjdbfksdvsv", name: "workflow 4", nodes, edges },
  { id: "1_zhsgdvfbjzshbfsascv", name: "workflow 5", nodes, edges },
  { id: "2_zjshrbfvkzhjdascabfk", name: "workflow 6", nodes, edges },
  { id: "2_zjshrbfvkzhjdascsdk", name: "workflow 7", nodes, edges },
  { id: "2_zjshrbfvkzhjdasdvsv", name: "workflow 8", nodes, edges },
];

export const useGetWorkflows = () => {
  const query = useQuery({
    queryKey: ["workflows"],
    queryFn: async () => {
      {
        const endpoint = "http://localhost:4000/api/v1/workflow";
        const response = await fetch(endpoint);
        const data: ApiResponseType<GetWorkflowType[]> = await response.json();

        if (response.status == 200) {
          console.log({ data_get: data.data })
          return data.data;
        } else {
          //   return toast.error("Failed to fetch workflow data");
          throw new Error("Failed to fetch workflow data");
        }
      }
    },
  });
  return query;
};
