import React, { useState, useCallback, useRef } from "react";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";
import styles from "./DockSystem.module.css";

export const DockSystem: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(300);
  const [rightWidth, setRightWidth] = useState(300);
  const [bottomHeight, setBottomHeight] = useState(200);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

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

  const getBottomConstraints = useCallback(() => {
    if (centerPanelRef.current) {
      const maxHeight = centerPanelRef.current.offsetHeight - 100; // Ensure center panel has at least 100px
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
      <div
        className={styles.panel}
        style={{
          width: leftWidth,
        }}
      >
        <p className={styles.panelText}>Left Panel</p>
        <div
          className={`${styles.resizeHandleContainer} ${styles.resizeHandleVertical} ${styles.resizeHandleLeft}`}
        >
          <ResizeHandle direction="vertical" onMouseDown={handleLeftResize} />
        </div>
      </div>
      <div ref={centerPanelRef} className={styles.centerPanelContainer}>
        <div className={styles.centerPanel}>
          <p className={styles.panelText}>Center Panel</p>
        </div>
        <div
          className={styles.bottomPanel}
          style={{
            height: bottomHeight,
          }}
        >
          <p className={styles.panelText}>Bottom Panel</p>
        </div>
        <div
          className={`${styles.resizeHandleContainer} ${styles.resizeHandleHorizontal}`}
          style={{ bottom: bottomHeight }}
        >
          <ResizeHandle direction="horizontal" onMouseDown={handleBottomResize} />
        </div>
      </div>
      <div
        className={styles.panel}
        style={{
          width: rightWidth,
        }}
      >
        <p className={styles.panelText}>Right Panel</p>
        <div
          className={`${styles.resizeHandleContainer} ${styles.resizeHandleVertical} ${styles.resizeHandleRight}`}
        >
          <ResizeHandle direction="vertical" onMouseDown={handleRightResize} />
        </div>
      </div>
    </div>
  );
};
