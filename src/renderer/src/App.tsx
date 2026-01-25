import { Dock } from "@renderer/components/dock/Dock";
import { LeftPanel, RightPanel, TopBar } from "@renderer/components/hud";
import SimpleWorld from "./components/pixi/SimpleWorld";
import { ColonyProvider } from "./context/ColonyContext";

export const App: React.FC = () => {
  return (
    <ColonyProvider>
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
    </ColonyProvider>
  );
};
