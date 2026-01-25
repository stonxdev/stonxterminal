import { Dock } from "@renderer/components/dock/Dock";
import { LeftPanel, RightPanel, TopBar } from "@renderer/components/hud";
import { useEffect, useMemo } from "react";
import WorldShowcase from "../components/pixi/WorldShowcase";
import { useCurrentZLevel, useWorld, useWorldActions } from "../game-state";
import { generateWorld } from "../world/factories/procedural-generator";
import type { BiomeType } from "../world/types";

// Default world generation configuration
const DEFAULT_WORLD_CONFIG = {
  name: "New Colony",
  width: 64,
  height: 64,
  seed: 42,
  biome: "temperate_forest" as BiomeType,
};

export const GameScreen: React.FC = () => {
  const { setWorld } = useWorldActions();
  const world = useWorld();
  const currentZLevel = useCurrentZLevel();

  // Generate and set world on mount
  useEffect(() => {
    const config = DEFAULT_WORLD_CONFIG;
    const newWorld = generateWorld(config.name, config.width, config.height, {
      seed: config.seed,
      biome: config.biome,
    });
    setWorld(newWorld, config);
  }, [setWorld]);

  // Get the current level
  const currentLevel = useMemo(() => {
    if (!world) return null;
    return world.levels.get(currentZLevel) ?? null;
  }, [world, currentZLevel]);

  return (
    <div className="relative w-screen h-screen">
      <div className="absolute inset-0">
        {world && currentLevel && (
          <WorldShowcase world={world} zLevel={currentZLevel} />
        )}
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
