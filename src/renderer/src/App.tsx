import { DockSystem } from "@renderer/components/dock/DockSystem";
import {
  LeftPanel,
  CenterPanel,
  BottomPanel,
  RightPanel,
} from "@renderer/components/panels/DemoPanels";
import "./App.css"; // Import your global styles

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
