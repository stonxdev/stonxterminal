import React, { useState, useCallback, useRef } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";
import styles from "./DockSystem.module.css";

export interface DockSystemProps {
  centerPanel: React.ReactNode;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

export const DockSystem: React.FC<DockSystemProps> = ({
  centerPanel,
  leftPanel,
  rightPanel,
  bottomPanel,
}) => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(300);
  const [bottomHeight, setBottomHeight] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  const getLeftConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth - (rightPanel ? rightWidth : 0) - 100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [rightWidth, rightPanel]);

  const getRightConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth - (leftPanel ? leftWidth : 0) - 100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [leftWidth, leftPanel]);

  const getBottomConstraints = useCallback(() => {
    if (centerPanelRef.current) {
      const maxHeight = centerPanelRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Infinity };
  }, []);

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
  const handleBottomResize = useResize(
    setBottomHeight,
    () => bottomHeight,
    getBottomConstraints,
    true,
    true,
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {leftPanel && (
        <div
          className={styles.panel}
          style={{
            width: leftWidth,
          }}
        >
          {leftPanel}
          <div
            className={`${styles.resizeHandleContainer} ${styles.resizeHandleVertical} ${styles.resizeHandleLeft}`}
          >
            <ResizeHandle direction="vertical" onMouseDown={handleLeftResize} />
          </div>
        </div>
      )}
      <div ref={centerPanelRef} className={styles.centerPanelContainer}>
        <div className={styles.centerPanel}>{centerPanel}</div>
        {bottomPanel && (
          <div
            className={styles.bottomPanel}
            style={{
              height: bottomHeight,
            }}
          >
            {bottomPanel}
          </div>
        )}
        {bottomPanel && (
          <div
            className={`${styles.resizeHandleContainer} ${styles.resizeHandleHorizontal}`}
            style={{ bottom: bottomHeight }}
          >
            <ResizeHandle
              direction="horizontal"
              onMouseDown={handleBottomResize}
            />
          </div>
        )}
      </div>
      {rightPanel && (
        <div
          className={styles.panel}
          style={{
            width: rightWidth,
          }}
        >
          {rightPanel}
          <div
            className={`${styles.resizeHandleContainer} ${styles.resizeHandleVertical} ${styles.resizeHandleRight}`}
          >
            <ResizeHandle
              direction="vertical"
              onMouseDown={handleRightResize}
            />
          </div>
        </div>
      )}
    </div>
  );
};
