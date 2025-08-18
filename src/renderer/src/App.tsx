import { Dock } from "@renderer/components/dock/Dock";
import PixiSquare from "./components/pixi/PixiExample";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <Dock
        leftTop={<div>Left</div>}
        center={<PixiSquare />}
        rightTop={<div>Right</div>}
      />
    </div>
  );
};
