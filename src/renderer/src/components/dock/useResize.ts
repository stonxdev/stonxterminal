import { useCallback } from 'react';

type GetConstraints = () => { min: number; max: number };

export const useResize = (
  onResize: (newWidth: number) => void,
  getStartWidth: () => number,
  getConstraints: GetConstraints,
  isReverse = false,
) => {
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = getStartWidth();

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const newWidth = startWidth + (isReverse ? -deltaX : deltaX);
        const { min, max } = getConstraints();
        onResize(Math.max(min, Math.min(newWidth, max)));
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onResize, getStartWidth, getConstraints, isReverse],
  );

  return handleMouseDown;
};
