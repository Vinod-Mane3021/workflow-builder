import { v4 as uuid } from "uuid";
import React, { CSSProperties } from "react";
import { Handle, HandleType, Position } from "reactflow";

type CustomHandle = {
  id?: string;
  type: HandleType;
  position: Position;
  style?: CSSProperties;
};

const CustomHandle = ({ id, type, position, style }: CustomHandle) => {
  return (
    <Handle
      type={type}
      position={position}
      // id={uuid()}
      style={{
        ...style,
        fontSize: 90,
        backgroundColor: "white",
        height: 15,
        width: 15,
        borderColor: "gray",
        transition: "outline-color 0.5s",
      }}
      onMouseEnter={(e: any) => {
        e.target.style.outline = "4px solid #a9abf7";
      }}
      onMouseLeave={(e: any) => (e.target.style.outlineColor = "transparent")}
    />
  );
};

export default CustomHandle;
