import type React from "react";

/**
 * Base action interface with common properties shared by all action types.
 */
export interface BaseAction {
  id: string;
  label?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  disabled?: boolean;
  variant?: "default" | "destructive";
}

/**
 * Handler-based action that executes a function directly.
 * Best for simple actions and Storybook examples.
 */
export interface HandlerAction extends BaseAction {
  type: "handler";
  onExecute: () => void | Promise<void>;
}

/**
 * Command-based action that executes through the command registry.
 * Best for application-wide actions that need to be consistent and type-safe.
 */
export interface CommandAction extends BaseAction {
  type: "command";
  command: string;
  commandArgs?: Record<string, unknown>;
}

/**
 * Union type for all supported action types.
 */
export type Action = HandlerAction | CommandAction;
