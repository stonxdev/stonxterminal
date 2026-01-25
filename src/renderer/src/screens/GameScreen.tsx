import { Dock } from "@renderer/components/dock/Dock";
import { LeftPanel, RightPanel, TopBar } from "@renderer/components/hud";
import { useCallback, useEffect, useMemo, useRef } from "react";
import WorldShowcase from "../components/pixi/WorldShowcase";
import {
  useCharacterActions,
  useCurrentZLevel,
  useWorld,
  useWorldActions,
} from "../game-state";
import { createCharacter } from "../simulation/types";
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

// Demo colonist colors
const COLONIST_COLORS = [0x4a90d9, 0xd94a4a, 0x4ad94a];
const COLONIST_NAMES = ["Alice", "Bob", "Charlie"];

export const GameScreen: React.FC = () => {
  const { setWorld } = useWorldActions();
  const { addCharacter } = useCharacterActions();
  const world = useWorld();
  const currentZLevel = useCurrentZLevel();
  const hasSpawnedCharacters = useRef(false);

  // Find passable tiles for spawning characters
  const findPassableTiles = useCallback(
    (count: number, zLevel: number) => {
      if (!world) return [];
      const level = world.levels.get(zLevel);
      if (!level) return [];

      const passableTiles: Array<{ x: number; y: number }> = [];
      for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
          // Tiles are stored as flat array: tiles[y * width + x]
          const tile = level.tiles[y * level.width + x];
          if (tile?.pathfinding?.isPassable) {
            passableTiles.push({ x, y });
          }
        }
      }

      // Shuffle and take first 'count' tiles
      const shuffled = passableTiles.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);
    },
    [world],
  );

  // Generate and set world on mount
  useEffect(() => {
    const config = DEFAULT_WORLD_CONFIG;
    const newWorld = generateWorld(config.name, config.width, config.height, {
      seed: config.seed,
      biome: config.biome,
    });
    setWorld(newWorld, config);
  }, [setWorld]);

  // Spawn demo characters after world is loaded
  useEffect(() => {
    console.info("[GameScreen] Spawn effect running", {
      hasWorld: !!world,
      currentZLevel,
      alreadySpawned: hasSpawnedCharacters.current,
    });

    if (!world || hasSpawnedCharacters.current) return;

    const spawnPositions = findPassableTiles(3, currentZLevel);
    console.info("[GameScreen] Found passable tiles:", spawnPositions.length, spawnPositions);

    if (spawnPositions.length === 0) {
      console.warn("[GameScreen] No passable tiles found!");
      return;
    }

    // Mark as spawned to prevent re-spawning
    hasSpawnedCharacters.current = true;

    // Create demo colonists
    spawnPositions.forEach((pos, index) => {
      const character = createCharacter({
        name: COLONIST_NAMES[index] ?? `Colonist ${index + 1}`,
        type: "colonist",
        position: { x: pos.x, y: pos.y, z: currentZLevel },
        color: COLONIST_COLORS[index] ?? 0x888888,
      });
      console.info("[GameScreen] Adding character:", character.name, character.position, "color:", character.color.toString(16));
      addCharacter(character);
    });

    console.info(`[GameScreen] Spawned ${spawnPositions.length} demo colonists`);
  }, [world, currentZLevel, findPassableTiles, addCharacter]);

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
