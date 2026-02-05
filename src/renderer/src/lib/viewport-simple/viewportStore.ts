import type { SimpleViewport } from "./SimpleViewport";

/**
 * Store that holds multiple viewport references.
 * Supports multiple World widget instances by broadcasting
 * zoom/pan operations to all registered viewports.
 */
class ViewportStore {
  private viewports = new Map<string, SimpleViewport>();

  addViewport(key: string, viewport: SimpleViewport): void {
    this.viewports.set(key, viewport);
    viewport.onZoomChange = (scale) => {
      for (const [k, vp] of this.viewports) {
        if (k !== key) {
          vp.setZoom(scale);
        }
      }
    };
    viewport.onPanChange = (worldCenterX, worldCenterY) => {
      for (const [k, vp] of this.viewports) {
        if (k !== key) {
          vp.panTo(worldCenterX, worldCenterY);
        }
      }
    };
  }

  removeViewport(key: string): void {
    const viewport = this.viewports.get(key);
    if (viewport) {
      viewport.onZoomChange = undefined;
      viewport.onPanChange = undefined;
    }
    this.viewports.delete(key);
  }

  getViewport(): SimpleViewport | null {
    const first = this.viewports.values().next();
    return first.done ? null : first.value;
  }

  /**
   * Get all registered viewports (for drawing multiple viewport rectangles on the mini-map)
   */
  getAllViewports(): IterableIterator<SimpleViewport> {
    return this.viewports.values();
  }

  /**
   * Pan to a world position on all viewports
   */
  panTo(worldX: number, worldY: number): void {
    for (const viewport of this.viewports.values()) {
      viewport.panTo(worldX, worldY);
    }
  }

  /**
   * Set the zoom level on all viewports
   */
  setZoom(scale: number): void {
    for (const viewport of this.viewports.values()) {
      viewport.setZoom(scale);
    }
  }

  /**
   * Get the current zoom level (from any viewport)
   */
  getZoom(): number {
    return this.getViewport()?.getZoom() ?? 1;
  }
}

export const viewportStore = new ViewportStore();
