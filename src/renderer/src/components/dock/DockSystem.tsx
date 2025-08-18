import type React from "react";
import { useCallback, useRef, useState } from "react";
import styles from "./DockSystem.module.css";
import { ResizeHandle } from "./ResizeHandle";
import { useResize } from "./useResize";

export interface DockSystemProps {
  center: React.ReactNode;
  leftTop?: React.ReactNode;
  leftBottom?: React.ReactNode;
  rightTop?: React.ReactNode;
  rightBottom?: React.ReactNode;
  centerBottom?: React.ReactNode;
  defaultLeftWidth?: number;
  defaultRightWidth?: number;
  defaultCenterBottomHeight?: number;
  defaultLeftBottomHeight?: number;
  defaultRightBottomHeight?: number;
}

export const DockSystem: React.FC<DockSystemProps> = ({
  center,
  leftTop,
  leftBottom,
  rightTop,
  rightBottom,
  centerBottom,
  defaultLeftWidth = 300,
  defaultRightWidth = 300,
  defaultCenterBottomHeight = 300,
  defaultLeftBottomHeight = 300,
  defaultRightBottomHeight = 300,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [rightWidth, setRightWidth] = useState(defaultRightWidth);
  const [centerBottomHeight, setCenterBottomHeight] = useState(
    defaultCenterBottomHeight,
  );
  const [leftBottomHeight, setLeftBottomHeight] = useState(
    defaultLeftBottomHeight,
  );
  const [rightBottomHeight, setRightBottomHeight] = useState(
    defaultRightBottomHeight,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);

  const getLeftConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth -
        (rightTop || rightBottom ? rightWidth : 0) -
        100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [rightWidth, rightTop, rightBottom]);

  const getRightConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth -
        (leftTop || leftBottom ? leftWidth : 0) -
        100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Infinity };
  }, [leftWidth, leftTop, leftBottom]);

  const getCenterBottomConstraints = useCallback(() => {
    if (centerPanelRef.current) {
      const maxHeight = centerPanelRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Infinity };
  }, []);

  const getLeftBottomConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxHeight = containerRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Infinity };
  }, []);

  const getRightBottomConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxHeight = containerRef.current.offsetHeight - 100;
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
  const handleCenterBottomResize = useResize(
    setCenterBottomHeight,
    () => centerBottomHeight,
    getCenterBottomConstraints,
    true,
    true,
  );
  const handleLeftBottomResize = useResize(
    setLeftBottomHeight,
    () => leftBottomHeight,
    getLeftBottomConstraints,
    true,
    true,
  );
  const handleRightBottomResize = useResize(
    setRightBottomHeight,
    () => rightBottomHeight,
    getRightBottomConstraints,
    true,
    true,
  );

  return (
    <div ref={containerRef} className={styles.container}>
      {(leftTop || leftBottom) && (
        <div
          className={styles.leftPanelContainer}
          style={{
            width: leftWidth,
          }}
        >
          <div className={styles.leftTopPanel}>{leftTop}</div>
          {leftBottom && (
            <div
              className={styles.leftBottomPanel}
              style={{
                height: leftBottomHeight,
              }}
            >
              {leftBottom}
            </div>
          )}
          {leftBottom && (
            <div
              className={`${styles.resizeHandleContainer} ${styles.resizeHandleHorizontal}`}
              style={{ bottom: leftBottomHeight }}
            >
              <ResizeHandle
                direction="horizontal"
                onMouseDown={handleLeftBottomResize}
              />
            </div>
          )}
          <div
            className={`${styles.resizeHandleContainer} ${styles.resizeHandleVertical} ${styles.resizeHandleLeft}`}
          >
            <ResizeHandle direction="vertical" onMouseDown={handleLeftResize} />
          </div>
        </div>
      )}
      <div ref={centerPanelRef} className={styles.centerPanelContainer}>
        <div className={styles.centerPanel}>{center}</div>
        {centerBottom && (
          <div
            className={styles.centerBottomPanel}
            style={{
              height: centerBottomHeight,
            }}
          >
            {centerBottom}
          </div>
        )}
        {centerBottom && (
          <div
            className={`${styles.resizeHandleContainer} ${styles.resizeHandleHorizontal}`}
            style={{ bottom: centerBottomHeight }}
          >
            <ResizeHandle
              direction="horizontal"
              onMouseDown={handleCenterBottomResize}
            />
          </div>
        )}
      </div>
      {(rightTop || rightBottom) && (
        <div
          className={styles.rightPanelContainer}
          style={{
            width: rightWidth,
          }}
        >
          <div className={styles.rightTopPanel}>{rightTop}</div>
          {rightBottom && (
            <div
              className={styles.rightBottomPanel}
              style={{
                height: rightBottomHeight,
              }}
            >
              {rightBottom}
            </div>
          )}
          {rightBottom && (
            <div
              className={`${styles.resizeHandleContainer} ${styles.resizeHandleHorizontal}`}
              style={{ bottom: rightBottomHeight }}
            >
              <ResizeHandle
                direction="horizontal"
                onMouseDown={handleRightBottomResize}
              />
            </div>
          )}
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
