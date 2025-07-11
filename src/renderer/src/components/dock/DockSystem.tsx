import React, { useState, useCallback, useRef } from "react";
import { ResizeHandle } from "./ResizeHandle";

export const DockSystem: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = leftWidth;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const newWidth = startWidth + (moveEvent.clientX - startX);
        if (containerRef.current) {
          const maxWidth = containerRef.current.offsetWidth - 100; // Ensure right panel has at least 100px
          setLeftWidth(Math.max(100, Math.min(newWidth, maxWidth)));
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [leftWidth],
  );

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", height: "100vh", width: "100vw" }}
    >
      <div
        style={{
          width: leftWidth,
          backgroundColor: "#2C2C2C",
          position: "relative",
        }}
      >
        <p style={{ color: "white", padding: 10 }}>Left Panel</p>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "0px",
          }}
        >
          <ResizeHandle direction="vertical" onMouseDown={handleMouseDown} />
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: "#1E1E1E" }}>
        <p style={{ color: "white", padding: 10 }}>Right Panel</p>
      </div>
    </div>
  );
};
