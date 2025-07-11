import React, { useState, useCallback, useRef } from "react";
import { DockProps, DockDimensions } from "./types";
import { ResizeHandle } from "./ResizeHandle";

const DEFAULT_DIMENSIONS: DockDimensions = {
  leftPaneWidth: 240,
  rightPaneWidth: 240,
  bottomPaneHeight: 200,
  minLeftWidth: 150,
  maxLeftWidth: 400,
  minRightWidth: 150,
  maxRightWidth: 400,
  minBottomHeight: 100,
  maxBottomHeight: 400,
};

export const DockSystem: React.FC<DockProps> = ({
  leftPanel,
  centerPanel,
  bottomPanel,
  rightPanel,
  initialDimensions = {},
  onDimensionsChange,
}) => {
  const [dimensions, setDimensions] = useState<DockDimensions>({
    ...DEFAULT_DIMENSIONS,
    ...initialDimensions,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const updateDimensions = useCallback(
    (newDimensions: Partial<DockDimensions>) => {
      setDimensions((prev) => {
        const updated = { ...prev, ...newDimensions };
        onDimensionsChange?.(updated);
        return updated;
      });
    },
    [onDimensionsChange],
  );

  const handleLeftResize = useCallback(
    (deltaX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const newWidth = Math.max(
        dimensions.minLeftWidth,
        Math.min(dimensions.maxLeftWidth, dimensions.leftPaneWidth + deltaX),
      );

      updateDimensions({ leftPaneWidth: newWidth });
    },
    [dimensions, updateDimensions],
  );

  const handleRightResize = useCallback(
    (deltaX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const newWidth = Math.max(
        dimensions.minRightWidth,
        Math.min(dimensions.maxRightWidth, dimensions.rightPaneWidth - deltaX),
      );

      updateDimensions({ rightPaneWidth: newWidth });
    },
    [dimensions, updateDimensions],
  );

  const handleBottomResize = useCallback(
    (deltaY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const newHeight = Math.max(
        dimensions.minBottomHeight,
        Math.min(
          dimensions.maxBottomHeight,
          dimensions.bottomPaneHeight - deltaY,
        ),
      );

      updateDimensions({ bottomPaneHeight: newHeight });
    },
    [dimensions, updateDimensions],
  );

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#f3f4f6",
        overflow: "hidden",
      }}
    >
      {/* Left Pane */}
      {leftPanel && (
        <>
          <div
            style={{
              width: dimensions.leftPaneWidth,
              flexShrink: 0,
              backgroundColor: "#f9fafb",
              borderRight: "1px solid #d1d5db",
            }}
          >
            {leftPanel}
          </div>
          <ResizeHandle
            direction="vertical"
            onResize={handleLeftResize}
            style={{
              width: "4px",
              backgroundColor: "#d1d5db",
              cursor: "col-resize",
            }}
          />
        </>
      )}

      {/* Center Area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {/* Main Center Pane */}
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#ffffff",
              minWidth: 0,
            }}
          >
            <div style={{ flex: 1 }}>{centerPanel}</div>

            {/* Bottom Pane - only spans the center area */}
            {bottomPanel && (
              <>
                <ResizeHandle
                  direction="horizontal"
                  onResize={handleBottomResize}
                  style={{
                    height: "4px",
                    backgroundColor: "#d1d5db",
                    cursor: "row-resize",
                  }}
                />
                <div
                  style={{
                    height: dimensions.bottomPaneHeight,
                    flexShrink: 0,
                    backgroundColor: "#f9fafb",
                    borderTop: "1px solid #d1d5db",
                  }}
                >
                  {bottomPanel}
                </div>
              </>
            )}
          </div>

          {/* Right Pane */}
          {rightPanel && (
            <>
              <ResizeHandle
                direction="vertical"
                onResize={handleRightResize}
                style={{
                  width: "4px",
                  backgroundColor: "#d1d5db",
                  cursor: "col-resize",
                }}
              />
              <div
                style={{
                  width: dimensions.rightPaneWidth,
                  flexShrink: 0,
                  backgroundColor: "#f9fafb",
                  borderLeft: "1px solid #d1d5db",
                }}
              >
                {rightPanel}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
