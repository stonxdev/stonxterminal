import React, { useRef, useCallback } from "react";

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

  return (
    <div
      ref={elementRef}
      className={`select-none transition-colors duration-150 ${className}`}
      style={{
        userSelect: "none",
        transition: "background-color 0.15s",
        ...style,
      }}
      onMouseDown={handleMouseDown}
    />
  );
};
