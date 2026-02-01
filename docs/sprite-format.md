# Sprite Format

This document describes the ASCII-based pixel art format used for defining 32x32 sprites.

## Directory Structure

Each sprite lives in its own folder under `src/renderer/public/sprites/`:

```
src/renderer/public/sprites/characters/
  male-1/
    source.txt       # ASCII pixel definition (source of truth)
    male-1.png       # Generated PNG output
    male-1.aseprite  # Optional: Aseprite file for manual edits
```

## Source File Format

The `source.txt` file has two sections: a **palette** and a **pixel grid**.

### Example

```
# Palette
. = transparent
X = #000000
S = #F5DEB3
H = #8B4513
C = #3366CC

# Pixels (32x32)
................................
................................
...........HHHHHH...............
..........HHHHHHHH..............
..........SSSSSSSS..............
..........S.SS.SS.S.............
..........SSSSSSSS..............
...........CCCCCC...............
..........CCCCCCCC..............
...........CC..CC...............
...........SS..SS...............
................................
```

### Palette Section

- Lines starting with `#` are comments
- Format: `char = color`
- `char` is a single character used in the pixel grid
- `color` can be:
  - `transparent` - fully transparent pixel
  - `#RRGGBB` - 6-digit hex color (opaque)
  - `#RRGGBBAA` - 8-digit hex color (with alpha)

### Pixel Grid Section

- Begins after a comment containing the word "pixel" (e.g., `# Pixels (32x32)`)
- Exactly 32 rows of exactly 32 characters each
- Each character must be defined in the palette

## CLI Usage

Generate a PNG from a source file:

```bash
npm run cli -- pixel-to-png src/renderer/public/sprites/characters/male-1
```

The command reads `source.txt` from the specified folder and outputs `<folder-name>.png` in the same folder.

### Options

| Option | Description |
|--------|-------------|
| `-s, --size <number>` | Tile size in pixels (default: 32) |
| `-o, --output <name>` | Output filename without extension |

### Examples

```bash
# Standard 32x32 sprite
npm run cli -- pixel-to-png src/renderer/public/sprites/characters/female-1

# Custom output name
npm run cli -- pixel-to-png src/renderer/public/sprites/characters/female-1 -o avatar

# Different tile size (e.g., 16x16)
npm run cli -- pixel-to-png src/renderer/public/sprites/tiles/grass -s 16
```

## Workflow

1. Create a new folder under `src/renderer/public/sprites/`
2. Create `source.txt` with palette and pixel grid
3. Run `npm run cli -- pixel-to-png <folder-path>`
4. The PNG is generated in the same folder

For manual touch-ups, you can edit the PNG in Aseprite and save alongside the source file.
