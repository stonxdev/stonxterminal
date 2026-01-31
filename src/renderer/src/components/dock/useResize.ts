import { useCallback, useState } from "react";

type GetConstraints = () => { min: number; max: number };

type ResizeEvent = React.MouseEvent | React.TouchEvent;

const getCoordinates = (
  e: ResizeEvent | MouseEvent | TouchEvent,
  isHorizontal: boolean,
): number => {
  if ("touches" in e) {
    const touch = e.touches[0] || (e as TouchEvent).changedTouches?.[0];
    return touch ? (isHorizontal ? touch.clientY : touch.clientX) : 0;
  }
  return isHorizontal ? e.clientY : e.clientX;
};

export const useResize = (
  onResize: (newSize: number) => void,
  getStartSize: () => number,
  getConstraints: GetConstraints,
  isReverse = false,
  isHorizontal = false,
) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleResizeStart = useCallback(
    (e: ResizeEvent) => {
      e.preventDefault();
      setIsDragging(true);
      const startCoordinate = getCoordinates(e, isHorizontal);
      const startSize = getStartSize();

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentCoordinate = getCoordinates(moveEvent, isHorizontal);
        const delta = currentCoordinate - startCoordinate;
        const newSize = startSize + (isReverse ? -delta : delta);
        const { min, max } = getConstraints();
        onResize(Math.max(min, Math.min(newSize, max)));
      };

      const handleEnd = () => {
        setIsDragging(false);
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("touchcancel", handleEnd);
      };

      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchmove", handleMove, { passive: false });
      document.addEventListener("touchend", handleEnd);
      document.addEventListener("touchcancel", handleEnd);
    },
    [onResize, getStartSize, getConstraints, isReverse, isHorizontal],
  );

  return { onResizeStart: handleResizeStart, isDragging };
};
