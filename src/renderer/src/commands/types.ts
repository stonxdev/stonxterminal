import type { ColonyContextData } from "../context/types";
import type { IconComponent } from "../menu/types";
import type { ObjectSchema } from "../schemas";

export type { ColonyContextData };

/**
 * Type-safe command definition for Colony.
 */
export interface CommandDefinition<TArgs = unknown> {
  id: string;
  name: string;
  /**
   * Icon component (not instantiated) for this command.
   * Used in command palettes, menus, and anywhere the command is displayed.
   */
  icon?: IconComponent;
  /**
   * Schema for command arguments.
   * If provided and command is executed without args, a form modal will be shown.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  argsSchema?: ObjectSchema<any>;
  /**
   * Command execution function.
   * @param context - The colony context data
   * @param args - Optional arguments passed to the command
   */
  execute: (context: ColonyContextData, args?: TArgs) => void | Promise<void>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: (command: CommandDefinition<any>) => void;
  execute: (commandId: string, args?: unknown) => Promise<void>;
  getCommand: (commandId: string) => CommandDefinition | undefined;
  getAllCommands: () => CommandDefinition[];
}
