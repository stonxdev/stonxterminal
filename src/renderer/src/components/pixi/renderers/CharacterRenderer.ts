// =============================================================================
// CHARACTER RENDERER
// =============================================================================
// Renders characters as sprites with direction indicators

import { Assets, Container, Graphics, Sprite, type Texture } from "pixi.js";
import {
  type Direction,
  getCharacterCenterPosition,
  getCharacterDirection,
} from "../../../simulation/movement";
import type { Character, EntityId } from "../../../simulation/types";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Character sprite half-size for positioning calculations */
const CHARACTER_HALF_SIZE = 16;

/** Direction indicator length */
const DIRECTION_INDICATOR_LENGTH = 8;

/** Selection ring padding */
const SELECTION_PADDING = 4;

// =============================================================================
// CHARACTER GRAPHICS
// =============================================================================

interface CharacterGraphics {
  container: Container;
  body: Sprite;
  directionIndicator: Graphics;
  selectionRing: Graphics;
}

/** Character sprite size (32x32 pixels, fits one cell) */
const CHARACTER_SPRITE_SIZE = 32;

/** Character sprite path */
const CHARACTER_SPRITE_PATH = "/sprites/characters/male-1.png";

// =============================================================================
// CHARACTER RENDERER CLASS
// =============================================================================

/**
 * Renders characters as sprites with direction indicators.
 * Manages a pool of graphics objects for efficient rendering.
 */
export class CharacterRenderer {
  private parentContainer: Container;
  private cellSize: number;
  private graphics: Map<EntityId, CharacterGraphics> = new Map();

  /** Cached character texture (loaded via preloadAssets) */
  private static characterTexture: Texture | null = null;

  constructor(parentContainer: Container, cellSize: number) {
    this.parentContainer = parentContainer;
    this.cellSize = cellSize;
  }

  /**
   * Preload character sprite assets. Call this before creating any CharacterRenderer instances.
   */
  static async preloadAssets(): Promise<void> {
    if (CharacterRenderer.characterTexture) {
      console.info("[CharacterRenderer] Assets already loaded");
      return;
    }
    console.info("[CharacterRenderer] Preloading character assets...");
    try {
      const texture = await Assets.load<Texture>(CHARACTER_SPRITE_PATH);
      CharacterRenderer.characterTexture = texture;
      console.info("[CharacterRenderer] Character texture loaded:", {
        width: texture.width,
        height: texture.height,
      });
    } catch (error) {
      console.error(
        "[CharacterRenderer] Failed to load character texture:",
        error,
      );
    }
  }

  /**
   * Update all character graphics.
   *
   * @param characters - Map of all characters to render
   * @param selectedId - ID of the currently selected character (if any)
   * @param zLevel - Current z-level to filter characters by (optional)
   */
  update(
    characters: Map<EntityId, Character>,
    selectedId: EntityId | null,
    zLevel?: number,
  ): void {
    console.info("[CharacterRenderer] update called", {
      characterCount: characters.size,
      zLevel,
      selectedId,
    });

    // Track which characters we've seen
    const seenIds = new Set<EntityId>();

    // Update or create graphics for each character
    for (const [id, character] of characters) {
      // Filter by z-level if provided
      if (zLevel !== undefined && character.position.z !== zLevel) {
        console.info("[CharacterRenderer] Skipping character (wrong z-level)", {
          id,
          characterZ: character.position.z,
          viewingZ: zLevel,
        });
        continue;
      }

      seenIds.add(id);

      let charGraphics = this.graphics.get(id);

      if (!charGraphics) {
        // Create new graphics for this character
        console.info("[CharacterRenderer] Creating graphics for character", {
          id,
          name: character.name,
          position: character.position,
          color: character.color.toString(16),
        });
        charGraphics = this.createCharacterGraphics(character);
        this.graphics.set(id, charGraphics);
        this.parentContainer.addChild(charGraphics.container);
      }

      // Update position and appearance
      this.updateCharacterGraphics(charGraphics, character, id === selectedId);
    }

    // Remove graphics for characters that no longer exist
    for (const [id, charGraphics] of this.graphics) {
      if (!seenIds.has(id)) {
        this.parentContainer.removeChild(charGraphics.container);
        charGraphics.container.destroy({ children: true });
        this.graphics.delete(id);
      }
    }
  }

  /**
   * Create graphics for a character.
   */
  private createCharacterGraphics(_character: Character): CharacterGraphics {
    const container = new Container();

    // Selection ring (drawn first, behind body)
    const selectionRing = new Graphics();
    container.addChild(selectionRing);

    // Character sprite - use preloaded texture if available, otherwise load async
    let body: Sprite;
    if (CharacterRenderer.characterTexture) {
      body = new Sprite(CharacterRenderer.characterTexture);
      console.info("[CharacterRenderer] Using preloaded texture:", {
        width: CharacterRenderer.characterTexture.width,
        height: CharacterRenderer.characterTexture.height,
      });
    } else {
      // Fallback: load async (texture will appear once loaded)
      body = Sprite.from(CHARACTER_SPRITE_PATH);
      console.info("[CharacterRenderer] Texture not preloaded, loading async");
    }
    // Center the sprite anchor so it's positioned at the character center
    body.anchor.set(0.5, 0.5);
    // Ensure sprite fits exactly in one cell (32x32)
    body.width = CHARACTER_SPRITE_SIZE;
    body.height = CHARACTER_SPRITE_SIZE;
    container.addChild(body);

    // Direction indicator
    const directionIndicator = new Graphics();
    container.addChild(directionIndicator);

    return {
      container,
      body,
      directionIndicator,
      selectionRing,
    };
  }

  /**
   * Draw the direction indicator.
   */
  private drawDirectionIndicator(
    graphics: Graphics,
    direction: Direction,
    color: number,
  ): void {
    graphics.clear();

    if (direction === "none") {
      return;
    }

    // Calculate direction vector
    let dx = 0;
    let dy = 0;

    switch (direction) {
      case "north":
        dy = -1;
        break;
      case "south":
        dy = 1;
        break;
      case "east":
        dx = 1;
        break;
      case "west":
        dx = -1;
        break;
    }

    // Draw triangle pointing in direction
    const tipX = dx * (CHARACTER_HALF_SIZE + DIRECTION_INDICATOR_LENGTH);
    const tipY = dy * (CHARACTER_HALF_SIZE + DIRECTION_INDICATOR_LENGTH);
    const baseX = dx * CHARACTER_HALF_SIZE;
    const baseY = dy * CHARACTER_HALF_SIZE;

    // Perpendicular offset for triangle base
    const perpX = -dy * 4;
    const perpY = dx * 4;

    graphics.moveTo(tipX, tipY);
    graphics.lineTo(baseX + perpX, baseY + perpY);
    graphics.lineTo(baseX - perpX, baseY - perpY);
    graphics.closePath();
    graphics.fill(color);
  }

  /**
   * Draw the selection ring.
   */
  private drawSelectionRing(graphics: Graphics, isSelected: boolean): void {
    graphics.clear();

    if (!isSelected) {
      return;
    }

    const radius = CHARACTER_HALF_SIZE + SELECTION_PADDING;

    graphics.circle(0, 0, radius);
    graphics.stroke({ width: 3, color: 0x00ffff });

    // Animated corners (could add animation later)
    const cornerSize = 6;
    const offset = radius - 2;

    // Top-left
    graphics.moveTo(-offset, -offset + cornerSize);
    graphics.lineTo(-offset, -offset);
    graphics.lineTo(-offset + cornerSize, -offset);
    graphics.stroke({ width: 2, color: 0x00ffff });

    // Top-right
    graphics.moveTo(offset - cornerSize, -offset);
    graphics.lineTo(offset, -offset);
    graphics.lineTo(offset, -offset + cornerSize);
    graphics.stroke({ width: 2, color: 0x00ffff });

    // Bottom-left
    graphics.moveTo(-offset, offset - cornerSize);
    graphics.lineTo(-offset, offset);
    graphics.lineTo(-offset + cornerSize, offset);
    graphics.stroke({ width: 2, color: 0x00ffff });

    // Bottom-right
    graphics.moveTo(offset - cornerSize, offset);
    graphics.lineTo(offset, offset);
    graphics.lineTo(offset, offset - cornerSize);
    graphics.stroke({ width: 2, color: 0x00ffff });
  }

  /**
   * Update a character's graphics with current state.
   */
  private updateCharacterGraphics(
    charGraphics: CharacterGraphics,
    character: Character,
    isSelected: boolean,
  ): void {
    // Update position
    const center = getCharacterCenterPosition(character, this.cellSize);
    console.info("[CharacterRenderer] Updating position", {
      name: character.name,
      tilePos: character.position,
      visualOffset: character.visualOffset,
      centerPixels: center,
      cellSize: this.cellSize,
    });
    charGraphics.container.x = center.x;
    charGraphics.container.y = center.y;

    // Update direction indicator
    const direction = getCharacterDirection(character);
    this.drawDirectionIndicator(
      charGraphics.directionIndicator,
      direction,
      character.color,
    );

    // Update selection ring
    this.drawSelectionRing(charGraphics.selectionRing, isSelected);
  }

  /**
   * Clean up all graphics.
   */
  destroy(): void {
    for (const [, charGraphics] of this.graphics) {
      this.parentContainer.removeChild(charGraphics.container);
      charGraphics.container.destroy({ children: true });
    }
    this.graphics.clear();
  }

  /**
   * Get the character at a pixel position (for hit testing).
   *
   * @param x - Pixel X coordinate
   * @param y - Pixel Y coordinate
   * @param characters - Map of characters to check
   * @returns The character at the position, or null
   */
  getCharacterAtPosition(
    x: number,
    y: number,
    characters: Map<EntityId, Character>,
  ): Character | null {
    for (const [, character] of characters) {
      const center = getCharacterCenterPosition(character, this.cellSize);
      const dx = x - center.x;
      const dy = y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= CHARACTER_HALF_SIZE + 4) {
        return character;
      }
    }

    return null;
  }
}
