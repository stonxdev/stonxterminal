import { cn } from "@renderer/utils/cn";
import type React from "react";
import { useState } from "react";

interface VerticalResizeHandleProps {
  onResizeStart: (e: React.MouseEvent | React.TouchEvent) => void;
  isDragging: boolean;
  align: "top" | "bottom";
}

const forceMobileHandles =
  localStorage.getItem("__forceMobileHandles") === "true";

export const VerticalResizeHandle: React.FC<VerticalResizeHandleProps> = ({
  onResizeStart,
  isDragging,
  align,
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const showGrip = forceMobileHandles || isHovering || isDragging;

  return (
    <button
      data-component="ResizeHandle"
      type="button"
      tabIndex={0}
      style={{ pointerEvents: "auto", touchAction: "none" }}
      className={cn(
        "absolute left-0 right-0 z-10 flex items-center justify-center",
        forceMobileHandles ? "h-4" : "h-1.5 max-md:h-4",
        "cursor-row-resize",
        align === "top" ? "top-0" : "bottom-0",
        "transition-all duration-200",
        isDragging
          ? "bg-blue-500/50"
          : isHovering || forceMobileHandles
            ? "bg-border"
            : "bg-border/10",
        "hover:bg-border",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
    >
      {showGrip && (
        <div className="flex flex-row gap-0.5">
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
        </div>
      )}
    </button>
  );
};
