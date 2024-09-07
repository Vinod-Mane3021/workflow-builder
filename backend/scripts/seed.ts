const initial_nodes = [
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

const initial_edges = [
  {
    id: "reactflow__edge-filterData-1filterData-1-filter-right-wait-1wait-1-wait-left",
    source: "filterData-1",
    sourceHandle: "filterData-1-filter-right",
    target: "wait-1",
    targetHandle: "wait-1-wait-left",
    // type: "smoothstep",
    animated: true,
  },
];

