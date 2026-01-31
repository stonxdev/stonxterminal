import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { HorizontalResizeHandle } from "../resize-handle/HorizontalResizeHandle";
import { VerticalResizeHandle } from "../resize-handle/VerticalResizeHandle";
import { useResize } from "./useResize";

const DockContext = createContext<boolean>(false);

export interface DockProps {
  top?: React.ReactNode;
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

export const Dock: React.FC<DockProps> = ({
  top,
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

  const isNested = useContext(DockContext);

  const getLeftConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth -
        (rightTop || rightBottom ? rightWidth : 0) -
        100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Number.POSITIVE_INFINITY };
  }, [rightWidth, rightTop, rightBottom]);

  const getRightConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxWidth =
        containerRef.current.offsetWidth -
        (leftTop || leftBottom ? leftWidth : 0) -
        100;
      return { min: 100, max: maxWidth };
    }
    return { min: 100, max: Number.POSITIVE_INFINITY };
  }, [leftWidth, leftTop, leftBottom]);

  const getCenterBottomConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxHeight = containerRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Number.POSITIVE_INFINITY };
  }, []);

  const getLeftBottomConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxHeight = containerRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Number.POSITIVE_INFINITY };
  }, []);

  const getRightBottomConstraints = useCallback(() => {
    if (containerRef.current) {
      const maxHeight = containerRef.current.offsetHeight - 100;
      return { min: 50, max: maxHeight };
    }
    return { min: 50, max: Number.POSITIVE_INFINITY };
  }, []);

  const leftResize = useResize(
    setLeftWidth,
    () => leftWidth,
    getLeftConstraints,
  );
  const rightResize = useResize(
    setRightWidth,
    () => rightWidth,
    getRightConstraints,
    true,
  );
  const centerBottomResize = useResize(
    setCenterBottomHeight,
    () => centerBottomHeight,
    getCenterBottomConstraints,
    true,
    true,
  );
  const leftBottomResize = useResize(
    setLeftBottomHeight,
    () => leftBottomHeight,
    getLeftBottomConstraints,
    true,
    true,
  );
  const rightBottomResize = useResize(
    setRightBottomHeight,
    () => rightBottomHeight,
    getRightBottomConstraints,
    true,
    true,
  );

  const hasLeft = leftTop || leftBottom;
  const hasRight = rightTop || rightBottom;

  return (
    <DockContext.Provider value={true}>
      <div
        ref={containerRef}
        className={`flex flex-col h-full w-full min-h-0 min-w-0 ${isNested ? "h-auto w-auto" : "h-screen w-screen"}`}
      >
        {top && (
          <div
            className="w-full bg-background border-b border-border"
            style={{ pointerEvents: "auto" }}
          >
            {top}
          </div>
        )}
        <div className="flex flex-1 min-h-0">
          {hasLeft && (
            <div
              className="flex flex-col relative bg-background border-r border-border"
              style={{
                width: leftWidth,
                pointerEvents: "auto",
              }}
            >
              {leftTop && (
                <div className="flex-1 bg-background relative overflow-y-auto">
                  {leftTop}
                </div>
              )}
              {leftBottom && (
                <div
                  className="bg-background relative overflow-y-auto"
                  style={{
                    height: leftBottomHeight,
                  }}
                >
                  {leftTop && (
                    <VerticalResizeHandle
                      onResizeStart={leftBottomResize.onResizeStart}
                      isDragging={leftBottomResize.isDragging}
                      align="top"
                    />
                  )}
                  {leftBottom}
                </div>
              )}
              <HorizontalResizeHandle
                onResizeStart={leftResize.onResizeStart}
                isDragging={leftResize.isDragging}
                align="right"
              />
            </div>
          )}

          <div className="flex-1 flex flex-col relative min-w-0 min-h-0">
            <div
              className={`flex-1 relative min-h-0 overflow-hidden ${center ? "bg-background" : ""}`}
              style={{ pointerEvents: center ? "auto" : "none" }}
            >
              {center}
            </div>
            {centerBottom && (
              <div
                className="bg-background relative overflow-y-auto border-t border-border"
                style={{
                  height: centerBottomHeight,
                  pointerEvents: "auto",
                }}
              >
                <VerticalResizeHandle
                  onResizeStart={centerBottomResize.onResizeStart}
                  isDragging={centerBottomResize.isDragging}
                  align="top"
                />
                {centerBottom}
              </div>
            )}
          </div>

          {hasRight && (
            <div
              className="flex flex-col relative bg-background border-l border-border"
              style={{
                width: rightWidth,
                pointerEvents: "auto",
              }}
            >
              {rightTop && (
                <div className="flex-1 bg-background relative overflow-y-auto">
                  {rightTop}
                </div>
              )}
              {rightBottom && (
                <div
                  className="bg-background relative overflow-y-auto"
                  style={{
                    height: rightBottomHeight,
                  }}
                >
                  {rightTop && (
                    <VerticalResizeHandle
                      onResizeStart={rightBottomResize.onResizeStart}
                      isDragging={rightBottomResize.isDragging}
                      align="top"
                    />
                  )}
                  {rightBottom}
                </div>
              )}
              <HorizontalResizeHandle
                onResizeStart={rightResize.onResizeStart}
                isDragging={rightResize.isDragging}
                align="left"
              />
            </div>
          )}
        </div>
      </div>
    </DockContext.Provider>
  );
};
