import type {
  BiomeType,
  StructureType,
  TerrainType,
  Tile,
  World,
  ZLevel,
} from "../types";
import { createStructureData, createTile } from "./tile-factory";
import {
  createWeatherState,
  createWorldTime,
  SeededRandom,
} from "./world-factory";

/** Biome-specific generation configuration */
interface BiomeConfig {
  terrainWeights: Array<{ type: TerrainType; weight: number }>;
  treeTypes: StructureType[];
  treeDensity: number;
  waterChance: number;
  rockFormationChance: number;
}

const BIOME_CONFIGS: Record<BiomeType, BiomeConfig> = {
  temperate_forest: {
    terrainWeights: [
      { type: "soil", weight: 0.6 },
      { type: "gravel", weight: 0.2 },
      { type: "rock", weight: 0.2 },
    ],
    treeTypes: ["tree_oak", "tree_pine"],
    treeDensity: 0.15,
    waterChance: 0.05,
    rockFormationChance: 0.03,
  },
  desert: {
    terrainWeights: [
      { type: "sand", weight: 0.8 },
      { type: "rock", weight: 0.15 },
      { type: "gravel", weight: 0.05 },
    ],
    treeTypes: [],
    treeDensity: 0.01,
    waterChance: 0.01,
    rockFormationChance: 0.05,
  },
  tundra: {
    terrainWeights: [
      { type: "soil", weight: 0.3 },
      { type: "rock", weight: 0.4 },
      { type: "gravel", weight: 0.3 },
    ],
    treeTypes: ["tree_pine"],
    treeDensity: 0.05,
    waterChance: 0.08,
    rockFormationChance: 0.1,
  },
  jungle: {
    terrainWeights: [
      { type: "soil", weight: 0.7 },
      { type: "clay", weight: 0.2 },
      { type: "gravel", weight: 0.1 },
    ],
    treeTypes: ["tree_oak"],
    treeDensity: 0.4,
    waterChance: 0.1,
    rockFormationChance: 0.02,
  },
  mountain: {
    terrainWeights: [
      { type: "rock", weight: 0.5 },
      { type: "granite", weight: 0.3 },
      { type: "gravel", weight: 0.2 },
    ],
    treeTypes: ["tree_pine"],
    treeDensity: 0.08,
    waterChance: 0.03,
    rockFormationChance: 0.2,
  },
  swamp: {
    terrainWeights: [
      { type: "clay", weight: 0.5 },
      { type: "soil", weight: 0.3 },
      { type: "water_shallow", weight: 0.2 },
    ],
    treeTypes: ["tree_oak"],
    treeDensity: 0.2,
    waterChance: 0.25,
    rockFormationChance: 0.01,
  },
  plains: {
    terrainWeights: [
      { type: "soil", weight: 0.8 },
      { type: "gravel", weight: 0.15 },
      { type: "rock", weight: 0.05 },
    ],
    treeTypes: ["tree_oak"],
    treeDensity: 0.03,
    waterChance: 0.03,
    rockFormationChance: 0.02,
  },
};

/** Pick terrain based on weighted probabilities */
function pickWeightedTerrain(
  rng: SeededRandom,
  weights: Array<{ type: TerrainType; weight: number }>,
): TerrainType {
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let random = rng.next() * totalWeight;

  for (const { type, weight } of weights) {
    random -= weight;
    if (random <= 0) {
      return type;
    }
  }

  return weights[0].type;
}

/** Update pathfinding data for a tile */
function updateTilePathfinding(tile: Tile): void {
  let isPassable = true;
  let movementCost = 1;

  // Check terrain
  const terrainPassable =
    tile.terrain.type !== "water_deep" &&
    tile.terrain.type !== "lava" &&
    tile.terrain.type !== "void";

  if (!terrainPassable) {
    isPassable = false;
    movementCost = Number.POSITIVE_INFINITY;
  } else {
    // Apply terrain movement cost
    if (tile.terrain.type === "water_shallow") movementCost = 2;
    else if (tile.terrain.type === "sand") movementCost = 1.2;
    else if (tile.terrain.type === "gravel") movementCost = 1.3;
  }

  // Check structure
  if (tile.structure) {
    const structureType = tile.structure.type;
    if (
      structureType === "wall_stone" ||
      structureType === "wall_wood" ||
      structureType === "wall_metal" ||
      structureType === "wall_brick" ||
      structureType === "tree_oak" ||
      structureType === "tree_pine" ||
      structureType === "boulder"
    ) {
      isPassable = false;
      movementCost = Number.POSITIVE_INFINITY;
    }
  }

  tile.pathfinding.isPassable = isPassable;
  tile.pathfinding.movementCost = movementCost;
}

/** Generate a z-level with procedural terrain */
export function generateZLevel(
  z: number,
  width: number,
  height: number,
  seed: number,
  biome: BiomeType,
): ZLevel {
  const rng = new SeededRandom(seed + z * 1000);
  const config = BIOME_CONFIGS[biome];
  const tiles: Tile[] = new Array(width * height);

  // First pass: generate terrain
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const terrainType = pickWeightedTerrain(rng, config.terrainWeights);

      // Add water patches
      const isWater = rng.chance(config.waterChance);
      const finalTerrainType = isWater ? "water_shallow" : terrainType;

      tiles[index] = createTile({
        terrain: {
          type: finalTerrainType,
          moisture: rng.next() * 0.5 + (isWater ? 0.5 : 0.25),
          temperature: 15 + rng.next() * 10,
        },
      });
    }
  }

  // Second pass: add structures (trees, boulders)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const tile = tiles[index];

      // Skip water tiles
      if (
        tile.terrain.type === "water_shallow" ||
        tile.terrain.type === "water_deep"
      ) {
        continue;
      }

      // Add trees
      if (config.treeTypes.length > 0 && rng.chance(config.treeDensity)) {
        tile.structure = createStructureData(rng.pick(config.treeTypes), {
          health: 150 + rng.nextInt(0, 100),
        });
        continue;
      }

      // Add rock formations
      if (rng.chance(config.rockFormationChance)) {
        tile.structure = createStructureData("boulder", {
          health: 300 + rng.nextInt(0, 200),
        });
      }
    }
  }

  // Update pathfinding cache
  for (let i = 0; i < tiles.length; i++) {
    updateTilePathfinding(tiles[i]);
  }

  return {
    z,
    width,
    height,
    tiles,
    isGenerated: true,
    biome,
  };
}

/** Generate a complete world with procedural generation */
export function generateWorld(
  name: string,
  width: number,
  height: number,
  options?: {
    seed?: number;
    biome?: BiomeType;
    generateUnderground?: boolean;
  },
): World {
  const seed = options?.seed ?? Math.floor(Math.random() * 2147483647);
  const biome = options?.biome ?? "temperate_forest";

  // Create world with procedurally generated surface
  const world: World = {
    metadata: {
      id: `world_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      name,
      seed,
      createdAt: Date.now(),
      version: "1.0.0",
      tickCount: 0,
    },
    dimensions: {
      width,
      height,
      minZ: options?.generateUnderground ? -5 : 0,
      maxZ: 1,
    },
    levels: new Map(),
    surfaceZ: 0,
    time: createWorldTime(),
    weather: createWeatherState(),
  };

  // Generate surface level
  const surfaceLevel = generateZLevel(0, width, height, seed, biome);
  world.levels.set(0, surfaceLevel);

  return world;
}
