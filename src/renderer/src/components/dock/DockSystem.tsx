import React, { useState, useCallback, useRef } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";

export const DockSystem: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

  const getLeftConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth = containerRef.current.offsetWidth - rightWidth - 100; // Ensure center panel has at least 100px
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [rightWidth]);

  const getRightConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth = containerRef.current.offsetWidth - leftWidth - 100; // Ensure center panel has at least 100px
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [leftWidth]);

  const handleLeftResize = useResize(
    setLeftWidth,
    () => leftWidth,
    getLeftConstraints,
  );
  const handleRightResize = useResize(
    setRightWidth,
    () => rightWidth,
    getRightConstraints,
    true,
  );

  return (
    <div
      ref={containerRef}
      style={{ display: "flex", height: "100vh", width: "100vw" }}
    >
      <div
        style={{
          width: leftWidth,
          backgroundColor: "var(--color-surface-0)",
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
          <ResizeHandle direction="vertical" onMouseDown={handleLeftResize} />
        </div>
      </div>
      <div style={{ flex: 1, backgroundColor: "var(--color-surface-1)" }}>
        <p style={{ color: "white", padding: 10 }}>Center Panel</p>
      </div>
      <div
        style={{
          width: rightWidth,
          backgroundColor: "var(--color-surface-0)",
          position: "relative",
        }}
      >
        <p style={{ color: "white", padding: 10 }}>Right Panel</p>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "0px",
          }}
        >
          <ResizeHandle direction="vertical" onMouseDown={handleRightResize} />
        </div>
      </div>
    </div>
  );
};
