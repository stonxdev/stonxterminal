// =============================================================================
// TILE INSPECTOR SCHEMA
// =============================================================================

import type { StructureType, TerrainType } from "../../world/types";
import { nu } from "../core";

/**
 * Terrain type options for enum renderer
 */
export const terrainTypeOptions: Array<{ label: string; value: TerrainType }> =
  [
    { label: "Soil", value: "soil" },
    { label: "Sand", value: "sand" },
    { label: "Clay", value: "clay" },
    { label: "Gravel", value: "gravel" },
    { label: "Rock", value: "rock" },
    { label: "Granite", value: "granite" },
    { label: "Limestone", value: "limestone" },
    { label: "Marble", value: "marble" },
    { label: "Obsidian", value: "obsidian" },
    { label: "Shallow Water", value: "water_shallow" },
    { label: "Deep Water", value: "water_deep" },
    { label: "Lava", value: "lava" },
    { label: "Void", value: "void" },
  ];

/**
 * Structure type options for enum renderer
 */
export const structureTypeOptions: Array<{
  label: string;
  value: StructureType;
}> = [
  { label: "None", value: "none" },
  { label: "Stone Wall", value: "wall_stone" },
  { label: "Wood Wall", value: "wall_wood" },
  { label: "Metal Wall", value: "wall_metal" },
  { label: "Brick Wall", value: "wall_brick" },
  { label: "Wood Door", value: "door_wood" },
  { label: "Metal Door", value: "door_metal" },
  { label: "Auto Door", value: "door_auto" },
  { label: "Bed", value: "bed" },
  { label: "Chair", value: "chair" },
  { label: "Table", value: "table" },
  { label: "Workbench", value: "workbench" },
  { label: "Chest", value: "chest" },
  { label: "Shelf", value: "shelf" },
  { label: "Stockpile Zone", value: "stockpile_zone" },
  { label: "Oak Tree", value: "tree_oak" },
  { label: "Pine Tree", value: "tree_pine" },
  { label: "Bush", value: "bush" },
  { label: "Boulder", value: "boulder" },
];

/**
 * Schema for terrain data in the inspector
 */
export const terrainDataSchema = nu
  .object({
    type: nu.string().withMetadata({
      label: "Terrain Type",
      renderer: "enum",
      enumValues: terrainTypeOptions,
      editable: false,
    }),
    moisture: nu.number().withMetadata({
      label: "Moisture",
      description: "Water content in the terrain",
      unit: "%",
      renderer: "percentage",
      editable: false,
    }),
    temperature: nu.number().withMetadata({
      label: "Temperature",
      unit: "°C",
      editable: false,
    }),
  })
  .withFormLayouts({
    default: {
      type: "form",
      groups: [
        {
          label: "Terrain",
          fields: [
            { name: "type", fieldWidth: 12 },
            { name: "moisture", fieldWidth: 6 },
            { name: "temperature", fieldWidth: 6 },
          ],
        },
      ],
    },
  });

/**
 * Schema for structure data in the inspector
 */
export const structureDataSchema = nu
  .object({
    type: nu.string().withMetadata({
      label: "Type",
      renderer: "enum",
      enumValues: structureTypeOptions,
      editable: false,
    }),
    health: nu.number().withMetadata({
      label: "Health",
      editable: false,
    }),
    rotation: nu.number().withMetadata({
      label: "Rotation",
      unit: "°",
      editable: false,
    }),
  })
  .withFormLayouts({
    default: {
      type: "form",
      groups: [
        {
          fields: [
            { name: "type", fieldWidth: 12 },
            { name: "health", fieldWidth: 6 },
            { name: "rotation", fieldWidth: 6 },
          ],
        },
      ],
    },
  });

/**
 * Schema for pathfinding data in the inspector
 */
export const pathfindingDataSchema = nu
  .object({
    isPassable: nu.boolean().withMetadata({
      label: "Passable",
      editable: false,
    }),
    movementCost: nu.number().withMetadata({
      label: "Movement Cost",
      editable: false,
    }),
  })
  .withFormLayouts({
    default: {
      type: "form",
      groups: [
        {
          label: "Pathfinding",
          fields: [
            { name: "isPassable", fieldWidth: 6 },
            { name: "movementCost", fieldWidth: 6 },
          ],
        },
      ],
    },
  });

/**
 * Main tile inspector schema
 */
export const tileInspectorSchema = nu
  .object({
    position: nu.string().withMetadata({
      label: "Position",
      renderer: "readonly",
      editable: false,
    }),
    zLevel: nu.number().withMetadata({
      label: "Z-Level",
      renderer: "readonly",
      editable: false,
    }),
    terrainType: nu.string().withMetadata({
      label: "Terrain",
      renderer: "enum",
      enumValues: terrainTypeOptions,
      editable: false,
    }),
    moisture: nu.number().withMetadata({
      label: "Moisture",
      unit: "%",
      renderer: "percentage",
      editable: false,
    }),
    temperature: nu.number().withMetadata({
      label: "Temperature",
      unit: "°C",
      editable: false,
    }),
    hasStructure: nu.boolean().withMetadata({
      label: "Has Structure",
      editable: false,
    }),
    structureType: nu.string().optional().withMetadata({
      label: "Structure",
      renderer: "enum",
      enumValues: structureTypeOptions,
      editable: false,
    }),
    itemCount: nu.number().withMetadata({
      label: "Items",
      editable: false,
    }),
    isPassable: nu.boolean().withMetadata({
      label: "Passable",
      editable: false,
    }),
    movementCost: nu.number().withMetadata({
      label: "Movement Cost",
      editable: false,
    }),
  })
  .withFormLayouts({
    default: {
      type: "form",
      groups: [
        {
          label: "Location",
          fields: [
            { name: "position", fieldWidth: 6 },
            { name: "zLevel", fieldWidth: 6 },
          ],
        },
        {
          label: "Terrain",
          fields: [
            { name: "terrainType", fieldWidth: 12 },
            { name: "moisture", fieldWidth: 6 },
            { name: "temperature", fieldWidth: 6 },
          ],
        },
        {
          label: "Structure",
          fields: [
            { name: "hasStructure", fieldWidth: 6 },
            { name: "structureType", fieldWidth: 6 },
          ],
        },
        {
          label: "Properties",
          fields: [
            { name: "itemCount", fieldWidth: 12 },
            { name: "isPassable", fieldWidth: 6 },
            { name: "movementCost", fieldWidth: 6 },
          ],
        },
      ],
    },
  });

/**
 * Type for tile inspector data
 */
export interface TileInspectorData {
  position: string;
  zLevel: number;
  terrainType: string;
  moisture: number;
  temperature: number;
  hasStructure: boolean;
  structureType?: string;
  itemCount: number;
  isPassable: boolean;
  movementCost: number;
}
