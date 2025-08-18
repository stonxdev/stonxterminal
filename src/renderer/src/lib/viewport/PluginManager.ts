import type { FederatedEvent } from "pixi.js";
import type { Drag, Plugin, Wheel } from "./plugins";
import type { Viewport } from "./Viewport";

const PLUGIN_ORDER = ["drag", "wheel"];

/**
 * Use this to access all plugins or add new plugins
 *
 * @public
 */
export class PluginManager {
  /** Maps plugin names to plugins */
  public plugins: Partial<Record<string, Plugin>>;

  /** List of plugins in order of execution */
  public list: Array<Plugin>;

  /** The viewport */
  public readonly viewport: Viewport;

  constructor(viewport: Viewport) {
    this.viewport = viewport;
    this.list = [];
    this.plugins = {};
  }

  /**
   * Inserts a named plugin or a user plugin into the viewport
   * @param {string} name of plugin
   * @param {Plugin} plugin
   * @param {number} index to insert userPlugin (otherwise inserts it at the end)
   */
  public add(name: string, plugin: Plugin): void {
    const oldPlugin = this.plugins[name];

    if (oldPlugin) {
      oldPlugin.destroy();
    }

    this.plugins[name] = plugin;

    this.list = [];
    for (let i = 0; i < PLUGIN_ORDER.length; i++) {
      const plugin = this.plugins[PLUGIN_ORDER[i]];
      if (plugin) {
        this.list.push(plugin);
      }
    }

    plugin.update(this.viewport.lastViewport ? 0 : 16.667);
  }

  /**
   * Get plugin of a certain type
   * @param {string} name of plugin
   * @param {boolean} [ignorePaused] return null if plugin is paused
   */
  public get<_T extends Plugin = Plugin>(
    name: "drag",
    ignorePaused?: boolean,
  ): Drag | null;
  public get<_T extends Plugin = Plugin>(
    name: "wheel",
    ignorePaused?: boolean,
  ): Wheel | null;
  public get<T extends Plugin = Plugin>(
    name: string,
    ignorePaused?: boolean,
  ): T | null;
  public get<T extends Plugin = Plugin>(
    name: string,
    ignorePaused?: boolean,
  ): T | null {
    if (ignorePaused) {
      return (this.plugins[name] as T) || null;
    }
    return (
      ((this.plugins[name]?.paused ? null : this.plugins[name]) as T) || null
    );
  }

  /**
   * Update all active plugins
   * @internal
   * @ignore
   * @param {number} elapsed type in milliseconds since last update
   */
  public update(elapsed: number): void {
    for (const plugin of this.list) {
      plugin.update(elapsed);
    }
  }

  /**
   * Resize all active plugins
   * @internal
   * @ignore
   */
  public resize(): void {
    for (const plugin of this.list) {
      plugin.resize();
    }
  }

  /** Clears all active plugins */
  public reset(): void {
    for (const plugin of this.list) {
      plugin.reset();
    }
  }

  /** Removes plugins from viewport */
  public removeAll(): void {
    this.list.forEach((plugin) => {
      plugin.destroy();
    });
    this.plugins = {};
    this.list = [];
  }

  /**
   * Removes named plugin from viewport
   * @param {string} name of plugin
   */
  public remove(name: string): void {
    if (this.plugins[name]) {
      this.plugins[name]?.destroy();
      delete this.plugins[name];
      this.viewport.emit(`${name}-remove`);
      this.sort();
    }
  }

  /**
   * Pause named plugin
   * @param {string} name of plugin
   */
  public pause(name: string): void {
    if (this.plugins[name]) {
      this.plugins[name].paused = true;
    }
  }

  /**
   * Resume named plugin
   * @param {string} name of plugin
   */
  public resume(name: string): void {
    if (this.plugins[name]) {
      this.plugins[name].paused = false;
    }
  }

  /**
   * Sort plugins according to PLUGIN_ORDER
   * @internal
   * @ignore
   */
  public sort(): void {
    this.list = [];

    for (let i = 0; i < PLUGIN_ORDER.length; i++) {
      const plugin = this.plugins[PLUGIN_ORDER[i]];

      if (plugin) {
        this.list.push(plugin);
      }
    }
  }

  /**
   * Handle down for all plugins
   * @internal
   * @ignore
   */
  public down(event: FederatedEvent): boolean {
    let stop = false;

    for (const plugin of this.list) {
      if (plugin.down(event)) {
        stop = true;
      }
    }

    return stop;
  }

  /**
   * Handle move for all plugins
   * @internal
   * @ignore
   */
  public move(event: FederatedEvent): boolean {
    let stop = false;

    for (const plugin of this.viewport.plugins.list) {
      if (plugin.move(event)) {
        stop = true;
      }
    }

    return stop;
  }

  /**
   * Handle up for all plugins
   * @internal
   * @ignore
   */
  public up(event: FederatedEvent): boolean {
    let stop = false;

    for (const plugin of this.list) {
      if (plugin.up(event)) {
        stop = true;
      }
    }

    return stop;
  }

  /**
   * Handle wheel event for all plugins
   * @internal
   * @ignore
   */
  public wheel(e: WheelEvent): boolean {
    let result = false;

    for (const plugin of this.list) {
      if (plugin.wheel(e)) {
        result = true;
      }
    }

    return result;
  }
}
