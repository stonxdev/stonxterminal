import { cn } from "@renderer/utils/cn";
import type React from "react";
import { useState } from "react";

interface HorizontalResizeHandleProps {
  onResizeStart: (e: React.MouseEvent | React.TouchEvent) => void;
  isDragging: boolean;
  align: "left" | "right";
}

const forceMobileHandles =
  localStorage.getItem("__forceMobileHandles") === "true";

export const HorizontalResizeHandle: React.FC<HorizontalResizeHandleProps> = ({
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
        "absolute top-0 bottom-0 z-10 flex items-center justify-center",
        forceMobileHandles ? "w-4" : "w-1.5 max-md:w-4",
        "cursor-col-resize",
        align === "left" ? "left-0" : "right-0",
        "transition-all duration-200",
        isDragging
          ? "bg-blue-500/50"
          : isHovering || forceMobileHandles
            ? "bg-border"
            : "bg-transparent",
        "hover:bg-border",
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
    >
      {showGrip && (
        <div className="flex flex-col gap-0.5">
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
          <div className="w-1 h-1 rounded-full bg-foreground/40" />
        </div>
      )}
    </button>
  );
};
