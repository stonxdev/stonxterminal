export interface DockProps {
  leftPanel?: React.ReactNode;
  centerPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

export const DockSystem: React.FC<DockProps> = () => {
  return <div className={"p-2 bg-primary"}>Nice</div>;
};
