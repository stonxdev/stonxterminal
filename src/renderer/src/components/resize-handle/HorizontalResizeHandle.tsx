import { cn } from "@renderer/utils/cn";
import type React from "react";
import { useState } from "react";

interface HorizontalResizeHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  align: "left" | "right";
}

const HANDLE_WIDTH = "w-1.5";

export const HorizontalResizeHandle: React.FC<HorizontalResizeHandleProps> = ({
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
        "absolute top-0 bottom-0 z-10",
        HANDLE_WIDTH,
        "cursor-col-resize",
        align === "left" ? "left-0" : "right-0",
        "transition-all duration-200",
        isHovering ? "bg-border" : "bg-transparent",
        "hover:bg-border",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onMouseDown}
    />
  );
};
