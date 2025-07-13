export type TabData = {
  id: string;
  label: string;
};

export type TabsPanelProps = {
  tabs: TabData[];
  tabContent: Record<string, React.ReactElement>;
  bodyHeight?: string | number;
  bodyWidth?: string | number;
  onReorder?: (startIndex: number, finishIndex: number) => void;
  onDropToAnotherTabSystem?: (item: TabData, finishIndex?: number) => void;
};
