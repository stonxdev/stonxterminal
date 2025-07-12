import { DockSystem } from "@renderer/components/dock/DockSystem";
import {
  LeftPanel,
  CenterPanel,
  BottomPanel,
  RightPanel,
} from "@renderer/components/panels/DemoPanels";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <DockSystem
        leftPanel={<LeftPanel />}
        centerPanel={<CenterPanel />}
        bottomPanel={<BottomPanel />}
        rightPanel={<RightPanel />}
      />
    </div>
  );
};
