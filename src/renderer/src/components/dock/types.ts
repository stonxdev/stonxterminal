export interface DockDimensions {
  leftPaneWidth: number;
  rightPaneWidth: number;
  bottomPaneHeight: number;
  minLeftWidth: number;
  maxLeftWidth: number;
  minRightWidth: number;
  maxRightWidth: number;
  minBottomHeight: number;
  maxBottomHeight: number;
}

export interface DockProps {
  leftPanel?: React.ReactNode;
  centerPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  initialDimensions?: Partial<DockDimensions>;
  onDimensionsChange?: (dimensions: DockDimensions) => void;
}
