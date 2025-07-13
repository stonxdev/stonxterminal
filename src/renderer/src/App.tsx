import { DockSystem } from "@renderer/components/dock/DockSystem";
import {
  LeftPanel,
  CenterPanel,
  BottomPanel,
  RightPanel,
} from "@renderer/components/layout/panels-old/DemoPanels";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <DockSystem
        leftTop={<LeftPanel />}
        leftBottom={<LeftPanel />}
        center={<CenterPanel />}
        centerBottom={<BottomPanel />}
        rightTop={<RightPanel />}
        rightBottom={<RightPanel />}
      />
    </div>
  );
};
