import { cn } from "@renderer/utils/cn";
import type React from "react";
import { useState } from "react";

interface VerticalResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  align: "top" | "bottom";
}

const HANDLE_HEIGHT = "h-1.5";

export const VerticalResizeHandle: React.FC<VerticalResizeHandleProps> = ({
  onMouseDown,
  align,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <button
      data-component="ResizeHandle"
      type="button"
      tabIndex={0}
      style={{ pointerEvents: "auto" }}
      className={cn(
        "absolute left-0 right-0 z-10",
        HANDLE_HEIGHT,
        "cursor-row-resize",
        align === "top" ? "top-0" : "bottom-0",
        "transition-all duration-200",
        isHovering ? "bg-border" : "bg-border/10",
        "hover:bg-border",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onMouseDown}
    />
  );
};
