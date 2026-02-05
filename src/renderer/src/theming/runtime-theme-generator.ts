import { logger } from "../lib/logger";
import type { ColonyTheme } from "./theme";

/**
 * Converts a theme property name to a CSS variable name
 * Example: "primaryContainer" -> "--primary-container"
 * Example: "onPrimaryContainer" -> "--on-primary-container"
 */
export function themePropertyToCSSVariable(property: string): string {
  // Convert camelCase to kebab-case
  const kebabCase = property
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, ""); // Remove leading dash if present

  return `--${kebabCase}`;
}

/**
 * Converts VS Code theme colors object to CSS variable declarations
 */
export function generateCSSVariables(colors: Record<string, string>): string {
  return Object.entries(colors)
    .map(
      ([property, value]) =>
        `  ${themePropertyToCSSVariable(property)}: ${value};`,
    )
    .join("\n");
}

/**
 * Generates CSS rule for a theme with all its variables
 */
export function generateThemeCSS(theme: ColonyTheme): string {
  const cssVariables = generateCSSVariables(theme.colors);
  return `  [data-theme="${theme.id}"] {\n${cssVariables}\n  }`;
}

/**
 * Generates CSS for multiple themes
 */
export function generateThemesCSS(themes: ColonyTheme[]): string {
  return themes.map((theme) => generateThemeCSS(theme)).join("\n\n");
}

/**
 * Injects theme CSS variables into the DOM
 */
export function injectThemeVariables(themes: ColonyTheme[]): void {
  const css = generateThemesCSS(themes);

  if (!css.trim()) {
    logger.warn("No theme CSS generated", ["theme"]);
    return;
  }

  // Remove existing theme variables style element if it exists
  const existingStyle = document.getElementById("colony-theme-variables");
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const style = document.createElement("style");
  style.id = "colony-theme-variables";
  style.type = "text/css";
  style.textContent = css;

  // Insert into document head
  document.head.appendChild(style);

  logger.info(`Injected ${themes.length} theme(s) into DOM`, ["theme"]);
}
