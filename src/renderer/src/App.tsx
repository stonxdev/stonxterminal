import "./App.css";
import { DockSystem } from "./components/dock";
import {
  LeftPanel,
  CenterPanel,
  BottomPanel,
  RightPanel,
} from "./components/panels/DemoPanels";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <DockSystem
        leftPanel={<LeftPanel />}
        centerPanel={<CenterPanel />}
        bottomPanel={<BottomPanel />}
        rightPanel={<RightPanel />}
        onDimensionsChange={(dimensions) => {
          console.log("Dock dimensions changed:", dimensions);
        }}
      />
    </div>
  );
};
