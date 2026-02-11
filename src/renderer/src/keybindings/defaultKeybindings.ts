import type { Keybinding } from "../commands/types";

/**
 * Default keybindings for Colony applications.
 * These provide core functionality that most apps will want.
 */
const DEFAULT_KEYBINDINGS: Keybinding[] = [
  {
    key: ["meta+k", "ctrl+k"],
    command: "workbench.runCommand",
  },
];

/**
 * User keybinding entry from configuration.
 * Uses "args" (VS Code convention) instead of internal "payload".
 */
export interface UserKeybindingEntry {
  key: string;
  command: string;
  args?: Record<string, unknown>;
}

/**
 * Merges user keybinding overrides with defaults (VS Code-style semantics).
 *
 * - Entries with the same `command` as a default replace the default's key.
 * - Prefix `key` with "-" to remove a default binding for that command.
 * - New commands (not in defaults) are added.
 */
export function mergeWithUserOverrides(
  userEntries: UserKeybindingEntry[],
): Keybinding[] {
  // Start with a mutable copy of defaults
  let result: Keybinding[] = DEFAULT_KEYBINDINGS.map((b) => ({ ...b }));

  for (const entry of userEntries) {
    if (entry.key.startsWith("-")) {
      // Removal: strip the "-" prefix is not needed for matching —
      // we just remove all defaults for this command
      result = result.filter((b) => b.command !== entry.command);
    } else {
      // Replace any default binding for the same command, then add the user's
      result = result.filter((b) => b.command !== entry.command);
      result.push({
        key: entry.key,
        command: entry.command,
        ...(entry.args ? { payload: entry.args } : {}),
      });
    }
  }

  return result;
}

/**
 * Default keybindings object with merge functionality.
 */
export const defaultKeybindings = {
  /**
   * Get the default keybindings array.
   */
  get(): Keybinding[] {
    return [...DEFAULT_KEYBINDINGS];
  },

  /**
   * Merge defaults with user overrides from configuration.
   */
  mergeWithUserOverrides,
};
