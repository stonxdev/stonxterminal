import { Dock } from "@renderer/components/dock/Dock";
import SimpleWorld from "./components/pixi/SimpleWorld";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "auto" }}>
      <Dock
        leftTop={<div>Left</div>}
        center={<SimpleWorld />}
        rightTop={<div>Right</div>}
      />
    </div>
  );
};
