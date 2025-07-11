import React, { useRef, useCallback, useState } from "react";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onResize,
  onResizeStart,
  onResizeEnd,
  className = "",
  style = {},
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const startPositionRef = useRef<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      startPositionRef.current = { x: event.clientX, y: event.clientY };
      onResizeStart?.();

      const handleMouseMove = (moveEvent: MouseEvent): void => {
        if (!startPositionRef.current) return;

        const delta =
          direction === "vertical"
            ? moveEvent.clientX - startPositionRef.current.x
            : moveEvent.clientY - startPositionRef.current.y;

        onResize(delta);
      };

      const handleMouseUp = (): void => {
        startPositionRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        onResizeEnd?.();
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [direction, onResize, onResizeStart, onResizeEnd],
  );

  const newStyle: React.CSSProperties = {
    ...style,
    userSelect: "none",
    transition: "background-color 0.15s ease",
    backgroundColor: isHovering
      ? style.backgroundColor || "#d1d5db"
      : "transparent",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
  };

  const interactionPadding = "3px";

  if (direction === "vertical") {
    const width = style.width || "0px";
    newStyle.paddingLeft = interactionPadding;
    newStyle.paddingRight = interactionPadding;
    newStyle.marginRight = `-${width}`;
    newStyle.transform = "translateX(-50%)";
  } else {
    const height = style.height || "0px";
    newStyle.paddingTop = interactionPadding;
    newStyle.paddingBottom = interactionPadding;
    newStyle.marginBottom = `-${height}`;
    newStyle.transform = "translateY(-50%)";
  }

  return (
    <div
      ref={elementRef}
      className={`select-none ${className}`}
      style={newStyle}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    />
  );
};
