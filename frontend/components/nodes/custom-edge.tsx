import React from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

export const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) => {
  // Compute the path for the edge
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Function to handle the delete button click
  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.stopPropagation(); // Prevent triggering other click events
    if (data && data.onDelete) {
      data.onDelete(id); // Call the onDelete function passed in the edge data
    }
  };

  return (
    <>    
      <BaseEdge id={id} path={edgePath} label={"vinod"} />
      {/* <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={40}
        height={40}
        x={labelX - 20}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <button
          onClick={onEdgeClick}
          className="edgebutton bg-red-500 rounded-full w-6 h-6 text-white"
        >
          ×
        </button>
      </foreignObject> */}
    </>
  );
};
