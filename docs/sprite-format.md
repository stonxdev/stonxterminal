# Sprite Format

This document describes the ASCII-based pixel art format used for defining 32x32 sprites.

## Universal Palette

All sprites share a universal palette defined in:
```
src/renderer/public/sprites/palette/palette.txt
```

The palette maps single characters to colors. For example:
- `.` = transparent
- `0` = #000000 (Black)
- `W` = #FFFFFF (White)
- `M` = #32CD32 (Lime green)
- etc.

View the palette file for the complete list of available colors and their character codes.

## Directory Structure

Each sprite lives in its own folder under `src/renderer/public/sprites/`:

```
src/renderer/public/sprites/
  palette/
    palette.txt          # Universal color palette (shared by all sprites)
  characters/
    male-1/
      source.txt         # ASCII pixel grid (source of truth)
      male-1.png         # Generated PNG output
      male-1.aseprite    # Optional: Aseprite file for manual edits
  terrain/
    soil/
      source.txt
      soil.png
```

## Source File Format

The `source.txt` file contains **only the pixel grid** (no palette section - colors come from the universal palette).

### Example

```
# 32x32 sprite
................................
................................
...........MMMMMM...............
..........MNNNNNNM..............
.........MNNLLLLNNM.............
........MNNNLLLLNNNM............
.......MNNNNLLLLNNNNM...........
................................
```

### Rules

- Lines starting with `#` are comments (optional)
- Each non-comment, non-empty line is a row of pixels
- Exactly 32 rows of exactly 32 characters each
- Each character must exist in the universal palette
- If a character is not in the palette, the conversion will fail

## CLI Commands

### pixel-to-png

Convert source.txt to PNG:

```bash
# Single sprite
npm run cli -- pixel-to-png src/renderer/public/sprites/terrain/soil

# All sprites
npm run cli -- pixel-to-png --all
```

Options:
| Option | Description |
|--------|-------------|
| `-a, --all` | Process all sprites |
| `-d, --dir <path>` | Base directory (default: src/renderer/public/sprites) |
| `-s, --size <number>` | Tile size in pixels (default: 32) |
| `-o, --output <name>` | Output filename without extension |

### png-to-pixel

Convert PNG to source.txt (validates colors against palette):

```bash
# Single sprite
npm run cli -- png-to-pixel src/renderer/public/sprites/terrain/soil

# All sprites
npm run cli -- png-to-pixel --all
```

**Important:** The PNG must only contain colors that exist in the universal palette. If any color is not found, the command will fail and list the missing colors.

Options:
| Option | Description |
|--------|-------------|
| `-a, --all` | Process all sprites |
| `-d, --dir <path>` | Base directory (default: src/renderer/public/sprites) |
| `-o, --output <name>` | Output filename (default: source.txt) |

## Workflow

### Creating a new sprite

1. Create a new folder under `src/renderer/public/sprites/<category>/`
2. Create `source.txt` with the pixel grid using characters from the universal palette
3. Run `npm run cli -- pixel-to-png <folder-path>`
4. The PNG is generated in the same folder

### Importing an existing PNG

1. Ensure the PNG only uses colors from the universal palette
2. Run `npm run cli -- png-to-pixel <folder-path>`
3. The command generates `source.txt` from the PNG
4. If colors are missing from the palette, either:
   - Add them to `palette/palette.txt`, or
   - Adjust the PNG to use existing palette colors

### Editing sprites

For manual edits, you can:
1. Edit `source.txt` directly using palette characters
2. Run `pixel-to-png` to regenerate the PNG

Or:
1. Edit the PNG in an image editor (using only palette colors)
2. Run `png-to-pixel` to regenerate the source.txt

## Palette Format

The palette file uses this format:
```
# Comment
char = #RRGGBB  Name
```

Example:
```
. = transparent    Void
0 = #000000        Black
W = #FFFFFF        White
M = #32CD32        Lime
```
