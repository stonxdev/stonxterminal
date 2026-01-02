import { Container, type FederatedPointerEvent, Rectangle } from "pixi.js";

/**
 * SIMPLE VIEWPORT
 *
 * A minimal viewport with pan (drag) and zoom (wheel) support.
 *
 * Features:
 * - Pan up/down/left/right via mouse drag
 * - Zoom in/out via mouse wheel (zooms toward cursor position)
 */

export interface ViewportOptions {
  /** Width of the screen/canvas in pixels */
  screenWidth?: number;

  /** Height of the screen/canvas in pixels */
  screenHeight?: number;

  /** Minimum zoom scale (default: 0.1) */
  minScale?: number;

  /** Maximum zoom scale (default: 5) */
  maxScale?: number;

  /** Zoom speed multiplier (default: 0.1) */
  zoomSpeed?: number;
}

export class SimpleViewport extends Container {
  /** Screen dimensions */
  public screenWidth: number;
  public screenHeight: number;

  /** Zoom constraints */
  private minScale: number;
  private maxScale: number;
  private zoomSpeed: number;

  /** Track if we're currently dragging */
  private isDragging = false;

  /** Remember the last pointer position during drag */
  private lastPointerPosition: { x: number; y: number } | null = null;

  /** Reference to wheel handler for cleanup */
  private wheelHandler: ((e: WheelEvent) => void) | null = null;

  /** The DOM element we're attached to (for wheel events) */
  private domElement: HTMLElement | null = null;

  constructor(options: ViewportOptions = {}) {
    super();

    // Set defaults
    this.screenWidth = options.screenWidth ?? 800;
    this.screenHeight = options.screenHeight ?? 600;
    this.minScale = options.minScale ?? 0.1;
    this.maxScale = options.maxScale ?? 5;
    this.zoomSpeed = options.zoomSpeed ?? 0.1;

    // Make this container interactive so it can receive pointer events
    this.eventMode = "static";

    // Set up drag listeners
    this.setupDragListeners();

    // Update hit area initially
    this.updateHitArea();
  }

  /**
   * Update the hit area to always cover the screen.
   * Since hitArea is in local (world) coordinates, we need to calculate
   * what world region corresponds to the screen.
   */
  private updateHitArea(): void {
    // The hit area needs to be in local coordinates.
    // Screen (0,0) corresponds to world (-this.x/scale, -this.y/scale)
    const worldX = -this.x / this.scale.x;
    const worldY = -this.y / this.scale.y;
    const worldWidth = this.screenWidth / this.scale.x;
    const worldHeight = this.screenHeight / this.scale.y;

    this.hitArea = new Rectangle(worldX, worldY, worldWidth, worldHeight);
  }

  /**
   * Attach wheel zoom to a DOM element (usually the canvas)
   */
  public attachWheelZoom(element: HTMLElement): void {
    this.domElement = element;
    this.wheelHandler = this.onWheel.bind(this);
    element.addEventListener("wheel", this.wheelHandler, { passive: false });
  }

  /**
   * Handle wheel events for zooming
   */
  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    // Get the mouse position relative to the canvas
    const rect = this.domElement?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the world position under the mouse BEFORE zooming
    const worldPosBefore = this.screenToWorld(mouseX, mouseY);

    // Calculate new scale
    const direction = event.deltaY < 0 ? 1 : -1; // Scroll up = zoom in
    const scaleFactor = 1 + direction * this.zoomSpeed;
    let newScale = this.scale.x * scaleFactor;

    // Clamp to min/max
    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));

    // Apply the new scale
    this.scale.set(newScale);

    // Calculate the world position under the mouse AFTER zooming
    const worldPosAfter = this.screenToWorld(mouseX, mouseY);

    // Adjust position so the world point under the mouse stays in place
    // This creates the "zoom toward cursor" effect
    this.x += (worldPosAfter.x - worldPosBefore.x) * this.scale.x;
    this.y += (worldPosAfter.y - worldPosBefore.y) * this.scale.y;

    // Update hit area after zoom
    this.updateHitArea();
  }

  /**
   * Pan: drag to move around
   */
  private setupDragListeners(): void {
    this.on("pointerdown", this.onDragStart, this);
    this.on("globalpointermove", this.onDragMove, this);
    this.on("pointerup", this.onDragEnd, this);
    this.on("pointerupoutside", this.onDragEnd, this);
  }

  private onDragStart(event: FederatedPointerEvent): void {
    this.isDragging = true;
    this.lastPointerPosition = {
      x: event.global.x,
      y: event.global.y,
    };
    const hitRect = this.hitArea as Rectangle;
    console.info(
      `[Viewport] POINTERDOWN screenPos=(${event.global.x.toFixed(0)}, ${event.global.y.toFixed(0)}) viewportPos=(${this.x.toFixed(0)}, ${this.y.toFixed(0)}) scale=${this.scale.x.toFixed(2)} hitArea=(${hitRect.x}, ${hitRect.y}, ${hitRect.width}, ${hitRect.height})`,
    );
  }

  private onDragMove(event: FederatedPointerEvent): void {
    // Log ALL pointermove events to see if they're firing even when not dragging
    if (!this.isDragging) {
      // Uncomment below to see moves when NOT dragging (very verbose)
      // console.info(`[Viewport] pointermove (NOT dragging) screenPos=(${event.global.x.toFixed(0)}, ${event.global.y.toFixed(0)})`);
      return;
    }

    if (!this.lastPointerPosition) {
      return;
    }

    // Calculate how much the pointer moved
    const deltaX = event.global.x - this.lastPointerPosition.x;
    const deltaY = event.global.y - this.lastPointerPosition.y;

    console.info(
      `[Viewport] POINTERMOVE (dragging) screenPos=(${event.global.x.toFixed(0)}, ${event.global.y.toFixed(0)}) delta=(${deltaX.toFixed(0)}, ${deltaY.toFixed(0)})`,
    );

    // Move the viewport by that amount (pan)
    this.x += deltaX;
    this.y += deltaY;

    // Update hit area after pan
    this.updateHitArea();

    // Update the last position for the next move
    this.lastPointerPosition = {
      x: event.global.x,
      y: event.global.y,
    };
  }

  private onDragEnd(event?: FederatedPointerEvent): void {
    const screenPosStr = event
      ? `(${event.global.x.toFixed(0)}, ${event.global.y.toFixed(0)})`
      : "no-event";
    console.info(
      `[Viewport] POINTERUP wasDragging=${this.isDragging} screenPos=${screenPosStr} viewportPos=(${this.x.toFixed(0)}, ${this.y.toFixed(0)})`,
    );
    this.isDragging = false;
    this.lastPointerPosition = null;
  }

  /**
   * Programmatic pan: move viewport by a delta
   */
  public panBy(deltaX: number, deltaY: number): void {
    this.x += deltaX;
    this.y += deltaY;
    this.updateHitArea();
  }

  /**
   * Programmatic pan: move viewport to center on a world position
   */
  public panTo(worldX: number, worldY: number): void {
    this.x = this.screenWidth / 2 - worldX * this.scale.x;
    this.y = this.screenHeight / 2 - worldY * this.scale.y;
    this.updateHitArea();
  }

  /**
   * Programmatic zoom: set the scale directly
   */
  public setZoom(scale: number, centerOnScreen = true): void {
    const clampedScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, scale),
    );

    if (centerOnScreen) {
      // Get the world position at screen center before zooming
      const centerWorld = this.screenToWorld(
        this.screenWidth / 2,
        this.screenHeight / 2,
      );

      // Apply new scale
      this.scale.set(clampedScale);

      // Re-center on that world position (this also updates hit area)
      this.panTo(centerWorld.x, centerWorld.y);
    } else {
      this.scale.set(clampedScale);
      this.updateHitArea();
    }
  }

  /**
   * Programmatic zoom: zoom in by a factor
   */
  public zoomIn(factor = 1.2): void {
    this.setZoom(this.scale.x * factor);
  }

  /**
   * Programmatic zoom: zoom out by a factor
   */
  public zoomOut(factor = 1.2): void {
    this.setZoom(this.scale.x / factor);
  }

  /**
   * Get the current zoom level
   */
  public getZoom(): number {
    return this.scale.x;
  }

  /**
   * Resize the viewport when the screen/canvas size changes
   */
  public resize(screenWidth: number, screenHeight: number): void {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.updateHitArea();
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  public screenToWorld(
    screenX: number,
    screenY: number,
  ): { x: number; y: number } {
    return {
      x: (screenX - this.x) / this.scale.x,
      y: (screenY - this.y) / this.scale.y,
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  public worldToScreen(
    worldX: number,
    worldY: number,
  ): { x: number; y: number } {
    return {
      x: worldX * this.scale.x + this.x,
      y: worldY * this.scale.y + this.y,
    };
  }

  /**
   * Get visible world bounds
   */
  public getVisibleBounds(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } {
    const topLeft = this.screenToWorld(0, 0);
    const bottomRight = this.screenToWorld(this.screenWidth, this.screenHeight);
    return {
      left: topLeft.x,
      top: topLeft.y,
      right: bottomRight.x,
      bottom: bottomRight.y,
    };
  }

  /**
   * Destroy and clean up
   */
  public override destroy(): void {
    // Remove wheel listener
    if (this.domElement && this.wheelHandler) {
      this.domElement.removeEventListener("wheel", this.wheelHandler);
      this.wheelHandler = null;
      this.domElement = null;
    }

    // Remove Pixi event listeners
    this.removeAllListeners();

    // Call parent destroy
    super.destroy();
  }
}
