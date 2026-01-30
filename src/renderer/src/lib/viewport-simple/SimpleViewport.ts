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

  /** Drag state */
  private isDragging = false;
  private lastPointerPosition: { x: number; y: number } | null = null;

  /** Wheel zoom state */
  private wheelHandler: ((e: WheelEvent) => void) | null = null;
  private domElement: HTMLElement | null = null;

  /** Touch pinch state */
  private touchStartHandler: ((e: TouchEvent) => void) | null = null;
  private touchMoveHandler: ((e: TouchEvent) => void) | null = null;
  private touchEndHandler: ((e: TouchEvent) => void) | null = null;
  private lastPinchDistance: number | null = null;
  private lastPinchCenter: { x: number; y: number } | null = null;

  constructor(options: ViewportOptions = {}) {
    super();

    this.screenWidth = options.screenWidth ?? 800;
    this.screenHeight = options.screenHeight ?? 600;
    this.minScale = options.minScale ?? 0.1;
    this.maxScale = options.maxScale ?? 5;
    this.zoomSpeed = options.zoomSpeed ?? 0.1;

    this.eventMode = "static";
    this.setupDragListeners();
    this.updateHitArea();
  }

  /**
   * Update hit area to cover the screen (in world coordinates).
   */
  private updateHitArea(): void {
    const bounds = this.getVisibleBounds();
    this.hitArea = new Rectangle(
      bounds.left,
      bounds.top,
      bounds.right - bounds.left,
      bounds.bottom - bounds.top,
    );
  }

  /**
   * Attach wheel zoom and touch pinch to a DOM element (usually the canvas)
   */
  public attachWheelZoom(element: HTMLElement): void {
    this.domElement = element;
    this.wheelHandler = this.onWheel.bind(this);
    element.addEventListener("wheel", this.wheelHandler, { passive: false });

    // Attach touch handlers for pinch-to-zoom on mobile/tablet
    this.touchStartHandler = this.onTouchStart.bind(this);
    this.touchMoveHandler = this.onTouchMove.bind(this);
    this.touchEndHandler = this.onTouchEnd.bind(this);
    element.addEventListener("touchstart", this.touchStartHandler, {
      passive: false,
    });
    element.addEventListener("touchmove", this.touchMoveHandler, {
      passive: false,
    });
    element.addEventListener("touchend", this.touchEndHandler);
    element.addEventListener("touchcancel", this.touchEndHandler);
  }

  private getTouchDistance(touches: TouchList): number {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getTouchCenter(
    touches: TouchList,
    rect: DOMRect,
  ): { x: number; y: number } {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2 - rect.left,
      y: (touches[0].clientY + touches[1].clientY) / 2 - rect.top,
    };
  }

  private onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 2) {
      event.preventDefault();
      this.lastPinchDistance = this.getTouchDistance(event.touches);
      const rect = this.domElement?.getBoundingClientRect();
      if (rect) {
        this.lastPinchCenter = this.getTouchCenter(event.touches, rect);
      }
    }
  }

  private onTouchMove(event: TouchEvent): void {
    if (
      event.touches.length === 2 &&
      this.lastPinchDistance !== null &&
      this.lastPinchCenter !== null
    ) {
      event.preventDefault();

      const rect = this.domElement?.getBoundingClientRect();
      if (!rect) return;

      const currentDistance = this.getTouchDistance(event.touches);
      const currentCenter = this.getTouchCenter(event.touches, rect);

      // Remember world position under pinch center before zoom
      const worldPosBefore = this.screenToWorld(
        this.lastPinchCenter.x,
        this.lastPinchCenter.y,
      );

      // Calculate zoom factor based on pinch distance change
      const zoomFactor = currentDistance / this.lastPinchDistance;

      // Calculate and apply new scale
      const newScale = Math.max(
        this.minScale,
        Math.min(this.maxScale, this.scale.x * zoomFactor),
      );
      this.scale.set(newScale);

      // Adjust position so world point under pinch center stays in place
      const worldPosAfter = this.screenToWorld(
        currentCenter.x,
        currentCenter.y,
      );
      this.x += (worldPosAfter.x - worldPosBefore.x) * this.scale.x;
      this.y += (worldPosAfter.y - worldPosBefore.y) * this.scale.y;

      this.updateHitArea();

      // Update for next frame
      this.lastPinchDistance = currentDistance;
      this.lastPinchCenter = currentCenter;
    }
  }

  private onTouchEnd(event: TouchEvent): void {
    if (event.touches.length < 2) {
      this.lastPinchDistance = null;
      this.lastPinchCenter = null;
    }
  }

  private onWheel(event: WheelEvent): void {
    event.preventDefault();

    const rect = this.domElement?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Remember world position under cursor before zoom
    const worldPosBefore = this.screenToWorld(mouseX, mouseY);

    // Detect Mac trackpad pinch-to-zoom (reports ctrlKey as true)
    const isPinchGesture = event.ctrlKey;

    // Calculate zoom factor based on deltaY magnitude for smooth zooming
    // Pinch gestures have small deltaY values, mouse wheel has larger ones
    let zoomFactor: number;
    if (isPinchGesture) {
      // For pinch: use deltaY directly with a small multiplier for smooth zoom
      // deltaY is typically small (1-10) for pinch gestures
      zoomFactor = 1 - event.deltaY * 0.01;
    } else {
      // For mouse wheel: normalize deltaY and use direction-based zoom
      // deltaY is typically ~100 for each wheel notch
      const direction = event.deltaY < 0 ? 1 : -1;
      zoomFactor = 1 + direction * this.zoomSpeed;
    }

    // Calculate and apply new scale
    const newScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, this.scale.x * zoomFactor),
    );
    this.scale.set(newScale);

    // Adjust position so world point under cursor stays in place
    const worldPosAfter = this.screenToWorld(mouseX, mouseY);
    this.x += (worldPosAfter.x - worldPosBefore.x) * this.scale.x;
    this.y += (worldPosAfter.y - worldPosBefore.y) * this.scale.y;

    this.updateHitArea();
  }

  private setupDragListeners(): void {
    this.on("pointerdown", this.onDragStart, this);
    this.on("globalpointermove", this.onDragMove, this);
    this.on("pointerup", this.onDragEnd, this);
    this.on("pointerupoutside", this.onDragEnd, this);
  }

  private onDragStart(event: FederatedPointerEvent): void {
    this.isDragging = true;
    this.lastPointerPosition = { x: event.global.x, y: event.global.y };
  }

  private onDragMove(event: FederatedPointerEvent): void {
    if (!this.isDragging || !this.lastPointerPosition) return;

    const deltaX = event.global.x - this.lastPointerPosition.x;
    const deltaY = event.global.y - this.lastPointerPosition.y;

    this.x += deltaX;
    this.y += deltaY;
    this.updateHitArea();

    this.lastPointerPosition = { x: event.global.x, y: event.global.y };
  }

  private onDragEnd(): void {
    this.isDragging = false;
    this.lastPointerPosition = null;
  }

  /** Move viewport by a delta in screen pixels */
  public panBy(deltaX: number, deltaY: number): void {
    this.x += deltaX;
    this.y += deltaY;
    this.updateHitArea();
  }

  /** Center viewport on a world position */
  public panTo(worldX: number, worldY: number): void {
    this.x = this.screenWidth / 2 - worldX * this.scale.x;
    this.y = this.screenHeight / 2 - worldY * this.scale.y;
    this.updateHitArea();
  }

  /** Set zoom level, optionally keeping screen center fixed */
  public setZoom(scale: number, centerOnScreen = true): void {
    const clampedScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, scale),
    );

    if (centerOnScreen) {
      const centerWorld = this.screenToWorld(
        this.screenWidth / 2,
        this.screenHeight / 2,
      );
      this.scale.set(clampedScale);
      this.panTo(centerWorld.x, centerWorld.y);
    } else {
      this.scale.set(clampedScale);
      this.updateHitArea();
    }
  }

  /** Zoom in by a factor (default 1.2x) */
  public zoomIn(factor = 1.2): void {
    this.setZoom(this.scale.x * factor);
  }

  /** Zoom out by a factor (default 1.2x) */
  public zoomOut(factor = 1.2): void {
    this.setZoom(this.scale.x / factor);
  }

  /** Get current zoom level */
  public getZoom(): number {
    return this.scale.x;
  }

  /** Update screen dimensions */
  public resize(screenWidth: number, screenHeight: number): void {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.updateHitArea();
  }

  /** Convert screen coordinates to world coordinates */
  public screenToWorld(
    screenX: number,
    screenY: number,
  ): { x: number; y: number } {
    return {
      x: (screenX - this.x) / this.scale.x,
      y: (screenY - this.y) / this.scale.y,
    };
  }

  /** Convert world coordinates to screen coordinates */
  public worldToScreen(
    worldX: number,
    worldY: number,
  ): { x: number; y: number } {
    return {
      x: worldX * this.scale.x + this.x,
      y: worldY * this.scale.y + this.y,
    };
  }

  /** Get the world bounds currently visible on screen */
  public getVisibleBounds(): {
    left: number;
    top: number;
    right: number;
    bottom: number;
  } {
    return {
      left: -this.x / this.scale.x,
      top: -this.y / this.scale.y,
      right: (this.screenWidth - this.x) / this.scale.x,
      bottom: (this.screenHeight - this.y) / this.scale.y,
    };
  }

  public override destroy(): void {
    if (this.domElement) {
      if (this.wheelHandler) {
        this.domElement.removeEventListener("wheel", this.wheelHandler);
        this.wheelHandler = null;
      }
      if (this.touchStartHandler) {
        this.domElement.removeEventListener(
          "touchstart",
          this.touchStartHandler,
        );
        this.touchStartHandler = null;
      }
      if (this.touchMoveHandler) {
        this.domElement.removeEventListener("touchmove", this.touchMoveHandler);
        this.touchMoveHandler = null;
      }
      if (this.touchEndHandler) {
        this.domElement.removeEventListener("touchend", this.touchEndHandler);
        this.domElement.removeEventListener(
          "touchcancel",
          this.touchEndHandler,
        );
        this.touchEndHandler = null;
      }
      this.domElement = null;
    }
    this.removeAllListeners();
    super.destroy();
  }
}
