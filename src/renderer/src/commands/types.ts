import type { ColonyContextData } from "../context/types";
import type { IconComponent } from "../menu/types";

export type { ColonyContextData };

/**
 * Type-safe command definition for Colony.
 */
export interface CommandDefinition {
  id: string;
  name: string;
  /**
   * Icon component (not instantiated) for this command.
   * Used in command palettes, menus, and anywhere the command is displayed.
   */
  icon?: IconComponent;
  /**
   * Command execution function.
   */
  execute: (context: ColonyContextData) => void | Promise<void>;
}

/**
 * Keybinding interface for command-based keybindings.
 */
export interface Keybinding {
  key: string | string[];
  command: string;
  commandArgs?: Record<string, unknown>;
}

export interface CommandRegistry {
  register: (command: CommandDefinition) => void;
  execute: (commandId: string, args?: unknown) => Promise<void>;
  getCommand: (commandId: string) => CommandDefinition | undefined;
  getAllCommands: () => CommandDefinition[];
}
