import { Dock } from "@renderer/components/dock/Dock";
import PixiSquare from "./components/pixi/PixiExample";

export const App: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Background layer - SimpleWorld fills entire screen */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        <PixiSquare />
      </div>

      {/* Overlay layer - Dock on top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Dock
          leftTop={<div style={{ padding: "8px", color: "white" }}>Left</div>}
          center={null}
          rightTop={<div style={{ padding: "8px", color: "white" }}>Right</div>}
        />
      </div>
    </div>
  );
};
