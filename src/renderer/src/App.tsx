import { DockSystem } from "@renderer/components/dock/DockSystem";
import {
  BottomPanel,
  CenterPanel,
  LeftPanel,
  RightPanel,
} from "@renderer/components/layout/panels-old/DemoPanels";
import PixiSquare from "./components/PixiExample";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <DockSystem
        leftTop={<div>Left</div>}
        center={<PixiSquare />}
        rightTop={<div>Right</div>}
      />
    </div>
  );
};
