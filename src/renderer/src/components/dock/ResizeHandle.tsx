import React, { useState } from "react";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onMouseDown,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
    transition: "all 0.2s ease",
  };

  const verticalStyle: React.CSSProperties = {
    cursor: "col-resize",
    top: 0,
    bottom: 0,
    left: "50%",
    width: isHovering ? "24px" : "0px",
    transform: "translateX(-50%)",
    backgroundColor: isHovering ? "#4A90E2" : "transparent",
  };

  const horizontalStyle: React.CSSProperties = {
    cursor: "row-resize",
    left: 0,
    right: 0,
    top: "50%",
    height: isHovering ? "5px" : "0px",
    transform: "translateY(-50%)",
    backgroundColor: isHovering ? "#4A90E2" : "transparent",
  };

  const interactionAreaStyle: React.CSSProperties = {
    position: "absolute",
    ...(direction === "vertical"
      ? { top: 0, bottom: 0, left: "-5px", right: "-5px" }
      : { left: 0, right: 0, top: "-5px", bottom: "-5px" }),
  };

  return (
    <div
      style={interactionAreaStyle}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onMouseDown}
    >
      <div
        style={{
          ...baseStyle,
          ...(direction === "vertical" ? verticalStyle : horizontalStyle),
        }}
      />
    </div>
  );
};
