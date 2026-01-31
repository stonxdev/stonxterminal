import type { CommandDefinition } from "./types";

/**
 * Factory function for creating type-safe command definitions.
 *
 * @param definition - The command definition
 * @returns A command definition
 */
export function createCommand<TArgs = unknown>(
  definition: CommandDefinition<TArgs>,
): CommandDefinition<TArgs> {
  return definition;
}
