# Game Color System

All in-game colors (world, characters, structures, terrain, minimap, etc.) are centralized in the theming system. Themes define base colors, and users can override any color via the Settings JSON editor.

## Architecture

```
Theme definition (gameColors: hex strings)
       + User config overrides (theme.gameColors)
                  |
            deep merge
                  |
          GameColors object
                  |
    useGameColorStore.resolve()
                  |
      ResolvedGameColors (precomputed)
          ├── .pixi numbers    → Pixi.js renderers
          ├── .rgba tuples     → Canvas 2D (minimap)
          └── .css strings     → CSS / Canvas strokeStyle
```

### Canonical format

All game colors are stored as `#RRGGBB` hex strings in theme definitions. At resolution time, they are converted to the format each consumer needs:

| Consumer | Format | Conversion |
|----------|--------|------------|
| Pixi.js renderers | `0xRRGGBB` number | `hexToPixi()` |
| Canvas 2D (minimap terrain) | `[r, g, b, a]` tuple | `hexToRGBA()` |
| Canvas 2D (strokes/fills) | `"#RRGGBB"` string | Used directly |

## Key Files

| File | Purpose |
|------|---------|
| `src/renderer/src/theming/theme.ts` | `GameColors` and `ColorScaleHex` interfaces |
| `src/renderer/src/theming/default-game-colors.ts` | Default values for all game colors |
| `src/renderer/src/theming/game-color-store.ts` | Zustand store with precomputed `ResolvedGameColors` |
| `src/renderer/src/theming/color-utils.ts` | `hexToPixi`, `hexToRGBA`, `pixiToHex`, `resolveColorScale` |
| `src/renderer/src/theming/themes/dark.ts` | Dark theme (imports `defaultGameColors`) |
| `src/renderer/src/theming/themes/light.ts` | Light theme |
| `src/renderer/src/theming/themes/terminal.ts` | Terminal theme |
| `src/renderer/src/context/ColonyContext.tsx` | Resolves colors on theme/config change |
| `src/renderer/src/config/config-schema.ts` | JSON schema with autocomplete for color paths |

## Color Groups

The `GameColors` interface organizes colors by domain:

| Group | Examples | Used by |
|-------|----------|---------|
| `world` | background, gridLine, worldBoundary, infoText, itemFallbackDot | World.tsx |
| `selection` | highlight, hoverFill, pathLine | World.tsx, CharacterRenderer, PathRenderer |
| `characters` | colonistPalette, colonistFallback, minimapDot | GameScreen, MiniMapWidget |
| `jobs` | chop, mine, move, defaultJob, indicatorBorder | CharacterRenderer |
| `progressBar` | background, fill, border | JobProgressRenderer |
| `structures` | `Record<StructureType, string>` (19 entries) | World.tsx, MiniMapWidget |
| `terrain` | `Record<TerrainType, string>` (13 entries) | MiniMapWidget |
| `minimap` | background, viewportRect | MiniMapWidget |
| `heatmaps` | temperature, moisture, movementCost (color scales) | HeatMapRenderer |

## User Overrides

Users override colors in the Settings widget (Overrides tab) using flat dot-path keys:

```json
{
  "theme.gameColors": {
    "world.background": "#0a0a1e",
    "terrain.soil": "#aa8855",
    "jobs.chop": "#a0522d",
    "structures.wall_stone": "#606060"
  }
}
```

The Monaco editor provides:
- **Autocomplete** for all known color paths (with default values shown)
- **Inline color swatches** next to hex values
- **Native color picker** popup when clicking a swatch

### How overrides are applied

1. `ColonyContext` reads the active theme's `gameColors` (e.g. `defaultGameColors`)
2. User overrides from `useConfigStore.get("theme.gameColors")` are applied via `setNestedValue()`
3. The merged result is passed to `useGameColorStore.resolve()`, which precomputes all format variants
4. Renderers read from the store and update live

## Adding a New Color

1. Add the field to the appropriate group in `GameColors` (in `theme.ts`)
2. Add a default value in `default-game-colors.ts`
3. Add the resolved field to `ResolvedGameColors` and the `resolveGameColors()` function in `game-color-store.ts`
4. Use it in the renderer via `this.colors.group.field` (Pixi) or `useGameColorStore` (React/Canvas)

The new color will automatically appear in the Monaco editor autocomplete and be overridable by users.

## Adding a New Theme

1. Create a new file in `src/renderer/src/theming/themes/`
2. Import `defaultGameColors` and override specific sections:

```typescript
import { defaultGameColors } from "../default-game-colors";
import type { ColonyTheme } from "../theme";

export const myTheme: ColonyTheme = {
  id: "my-theme",
  name: "My Theme",
  type: "dark",
  colors: { /* UI colors in oklch */ },
  gameColors: {
    ...defaultGameColors,
    world: {
      ...defaultGameColors.world,
      background: "#0d0d1a",
    },
  },
};
```

3. Register it in `src/renderer/src/theming/themes/index.ts`

## Live Updates

All renderers support live color updates:

- **Pixi.js renderers** (`CharacterRenderer`, `PathRenderer`, `JobProgressRenderer`) accept colors via constructor and expose `updateColors(colors)`. `World.tsx` subscribes to `useGameColorStore` and calls these on change.
- **MiniMapWidget** subscribes to `useGameColorStore` to regenerate the terrain bitmap when colors change.
- **World.tsx** subscribes to `useGameColorStore` for background color and overlay color updates.

When a user changes a color in Settings and saves, the pipeline re-resolves immediately and all renderers update within the same frame.
