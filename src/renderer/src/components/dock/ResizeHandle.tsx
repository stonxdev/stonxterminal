import cn from "classnames";
import type React from "react";
import { useState } from "react";
import styles from "./ResizeHandle.module.css";

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onMouseDown,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const interactionAreaClasses = cn(styles.interactionArea, {
    [styles.interactionAreaVertical]: direction === "vertical",
    [styles.interactionAreaHorizontal]: direction === "horizontal",
  });

  const handleClasses = cn(styles.handle, {
    [styles.handleVertical]: direction === "vertical",
    [styles.handleHorizontal]: direction === "horizontal",
    [styles.handleHover]: isHovering,
  });

  return (
    <div
      className={interactionAreaClasses}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseDown={onMouseDown}
    >
      <div className={handleClasses} />
    </div>
  );
};
