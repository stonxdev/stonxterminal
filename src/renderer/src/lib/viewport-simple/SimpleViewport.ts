import { Container, type FederatedPointerEvent } from "pixi.js";

/**
 * SIMPLE VIEWPORT - Learning Version
 *
 * This is a minimal viewport implementation to understand the core concepts.
 *
 * CONCEPT 1: What is a Viewport?
 * ===============================
 * A viewport is a "camera" that lets you pan and zoom around a large world.
 * Think of it like Google Maps - you can drag to move around and zoom in/out.
 *
 * The viewport is a Container that holds all your world objects. When you move
 * the viewport's position or scale, everything inside moves/scales with it.
 *
 * CONCEPT 2: Screen vs World Coordinates
 * =======================================
 * - Screen coordinates: Where things appear on your canvas (e.g., pixel 500x300 on your screen)
 * - World coordinates: Where things actually are in the game world (e.g., position 5000x3000)
 *
 * The viewport transforms between these two coordinate systems.
 */

export interface SimpleViewportOptions {
  /** Width of the screen/canvas in pixels */
  screenWidth?: number;

  /** Height of the screen/canvas in pixels */
  screenHeight?: number;

  /** Enable dragging to pan the viewport */
  enableDrag?: boolean;
}

/**
 * A simple viewport that demonstrates the core concept: dragging to pan around a world.
 *
 * This implementation focuses on ONE feature: panning (moving the viewport around).
 * No zoom, no fancy plugins, just the basics.
 */
export class SimpleViewport extends Container {
  /** Screen dimensions */
  public screenWidth: number;
  public screenHeight: number;

  /** Is drag enabled? */
  private enableDrag: boolean;

  /** Track if we're currently dragging */
  private isDragging = false;

  /** Remember the last pointer position during drag */
  private lastPointerPosition: { x: number; y: number } | null = null;

  constructor(options: SimpleViewportOptions = {}) {
    super();

    // Set defaults
    this.screenWidth = options.screenWidth ?? 800;
    this.screenHeight = options.screenHeight ?? 600;
    this.enableDrag = options.enableDrag ?? true;

    // Make this container interactive
    this.eventMode = "static";

    // Set up event listeners if drag is enabled
    if (this.enableDrag) {
      this.setupDragListeners();
    }
  }

  /**
   * CONCEPT 3: Drag to Pan
   * ======================
   * When you drag, we need to:
   * 1. Track when dragging starts (pointerdown)
   * 2. Move the viewport as the pointer moves (pointermove)
   * 3. Stop dragging when pointer is released (pointerup)
   *
   * The key insight: moving the viewport is just changing its x/y position!
   * If you move the container to the right (+x), the world appears to move left.
   */
  private setupDragListeners() {
    // Start dragging
    this.on("pointerdown", this.onDragStart, this);

    // Continue dragging (we listen globally so it works even if pointer leaves viewport)
    this.on("globalpointermove", this.onDragMove, this);

    // Stop dragging
    this.on("pointerup", this.onDragEnd, this);
    this.on("pointerupoutside", this.onDragEnd, this);
  }

  private onDragStart(event: FederatedPointerEvent) {
    this.isDragging = true;

    // Remember where the pointer started
    this.lastPointerPosition = {
      x: event.global.x,
      y: event.global.y,
    };
  }

  private onDragMove(event: FederatedPointerEvent) {
    // Only move if we're actually dragging
    if (!this.isDragging || !this.lastPointerPosition) {
      return;
    }

    // Calculate how much the pointer moved
    const deltaX = event.global.x - this.lastPointerPosition.x;
    const deltaY = event.global.y - this.lastPointerPosition.y;

    // Move the viewport by that amount
    // This is the CORE of panning: just add to the viewport's position
    this.x += deltaX;
    this.y += deltaY;

    // Update the last position for the next move
    this.lastPointerPosition = {
      x: event.global.x,
      y: event.global.y,
    };
  }

  private onDragEnd() {
    this.isDragging = false;
    this.lastPointerPosition = null;
  }

  /**
   * CONCEPT 4: Coordinate Conversion
   * =================================
   * Converting between screen and world coordinates is essential.
   *
   * Pixi provides toLocal() and toGlobal() methods that do this automatically
   * based on the container's transform (position, scale, rotation).
   */

  /**
   * Convert screen coordinates to world coordinates.
   *
   * Example: The pointer is at screen position (100, 100).
   *          What world position is that pointing at?
   */
  public screenToWorld(screenX: number, screenY: number) {
    return this.toLocal({ x: screenX, y: screenY });
  }

  /**
   * Convert world coordinates to screen coordinates.
   *
   * Example: An object is at world position (5000, 3000).
   *          Where does it appear on the screen?
   */
  public worldToScreen(worldX: number, worldY: number) {
    return this.toGlobal({ x: worldX, y: worldY });
  }

  /**
   * Get the world coordinates of the top-left corner of the screen.
   * This tells you what part of the world is currently visible.
   */
  public getTopLeft() {
    return this.screenToWorld(0, 0);
  }

  /**
   * Get the world coordinates of the bottom-right corner of the screen.
   */
  public getBottomRight() {
    return this.screenToWorld(this.screenWidth, this.screenHeight);
  }

  /**
   * Destroy and clean up
   */
  public destroy() {
    // Remove event listeners
    this.removeAllListeners();

    // Call parent destroy
    super.destroy();
  }
}
