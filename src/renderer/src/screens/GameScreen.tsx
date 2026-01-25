import { Dock } from "@renderer/components/dock/Dock";
import { LeftPanel, RightPanel, TopBar } from "@renderer/components/hud";
import SimpleWorld from "../components/pixi/SimpleWorld";

export const GameScreen: React.FC = () => {
  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0">
        <SimpleWorld />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <Dock
          top={<TopBar />}
          leftTop={<LeftPanel />}
          center={null}
          rightTop={<RightPanel />}
        />
      </div>
    </div>
  );
};
