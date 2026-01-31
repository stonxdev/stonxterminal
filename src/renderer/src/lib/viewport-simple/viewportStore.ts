import type { SimpleViewport } from "./SimpleViewport";

/**
 * Simple store to hold the viewport reference.
 * This allows commands and other parts of the app to access the viewport.
 */
class ViewportStore {
  private viewport: SimpleViewport | null = null;

  setViewport(viewport: SimpleViewport | null): void {
    this.viewport = viewport;
  }

  getViewport(): SimpleViewport | null {
    return this.viewport;
  }

  /**
   * Pan to a world position (center the viewport on it)
   */
  panTo(worldX: number, worldY: number): void {
    this.viewport?.panTo(worldX, worldY);
  }

  /**
   * Set the zoom level
   */
  setZoom(scale: number): void {
    this.viewport?.setZoom(scale);
  }

  /**
   * Get the current zoom level
   */
  getZoom(): number {
    return this.viewport?.getZoom() ?? 1;
  }
}

export const viewportStore = new ViewportStore();
