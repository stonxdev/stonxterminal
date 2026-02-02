import type { Keybinding } from "../actions/types";

/**
 * Default keybindings for Colony applications
 * These provide core functionality that most apps will want
 */
const DEFAULT_KEYBINDINGS: Keybinding[] = [
  {
    key: ["meta+k", "ctrl+k"],
    action: "workbench.runCommand",
  },
];

/**
 * Keybinding extend options
 */
export interface KeybindingExtendOptions {
  /**
   * Additional keybindings to add
   */
  add?: Keybinding[];
  /**
   * List of action IDs to remove from defaults
   */
  removeActions?: string[];
}

/**
 * Creates an extended keybinding configuration from the defaults
 * @param options Configuration for extending keybindings
 * @returns Array of keybindings with extensions applied
 */
function extendKeybindings(
  options: KeybindingExtendOptions = {},
): Keybinding[] {
  const { add = [], removeActions = [] } = options;

  // Start with defaults
  let result = [...DEFAULT_KEYBINDINGS];

  // Remove actions explicitly
  if (removeActions.length > 0) {
    result = result.filter((binding) => {
      return !removeActions.includes(binding.action);
    });
  }

  // Add new keybindings
  result.push(...add);

  return result;
}

/**
 * Default keybindings object with extend functionality
 */
export const defaultKeybindings = {
  /**
   * Get the default keybindings array
   */
  get(): Keybinding[] {
    return [...DEFAULT_KEYBINDINGS];
  },

  /**
   * Extend the default keybindings with additional or overridden bindings
   * @param options Configuration for extending keybindings
   * @returns Array of keybindings with extensions applied
   */
  extend: extendKeybindings,
};
