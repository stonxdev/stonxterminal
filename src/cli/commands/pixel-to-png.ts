import * as fs from "node:fs";
import * as path from "node:path";
import { Command } from "commander";
import { PNG } from "pngjs";

interface Palette {
  [char: string]: { r: number; g: number; b: number; a: number };
}

function parseHexColor(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length === 6) {
    return {
      r: Number.parseInt(cleanHex.slice(0, 2), 16),
      g: Number.parseInt(cleanHex.slice(2, 4), 16),
      b: Number.parseInt(cleanHex.slice(4, 6), 16),
      a: 255,
    };
  }

  if (cleanHex.length === 8) {
    return {
      r: Number.parseInt(cleanHex.slice(0, 2), 16),
      g: Number.parseInt(cleanHex.slice(2, 4), 16),
      b: Number.parseInt(cleanHex.slice(4, 6), 16),
      a: Number.parseInt(cleanHex.slice(6, 8), 16),
    };
  }

  throw new Error(`Invalid hex color: ${hex}`);
}

function parseSourceFile(content: string): {
  palette: Palette;
  pixels: string[];
} {
  const lines = content.split("\n");
  const palette: Palette = {};
  const pixels: string[] = [];

  let inPixelSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (trimmed === "" || trimmed.startsWith("#")) {
      // Check if we're entering the pixel section
      if (trimmed.toLowerCase().includes("pixel")) {
        inPixelSection = true;
      }
      continue;
    }

    // Check for palette definition: "char = #hexcolor" or "char = transparent"
    const paletteMatch = trimmed.match(/^(.)[ ]*=[ ]*(.+)$/);
    if (paletteMatch && !inPixelSection) {
      const [, char, colorValue] = paletteMatch;
      const cleanColor = colorValue.trim();

      if (cleanColor.toLowerCase() === "transparent") {
        palette[char] = { r: 0, g: 0, b: 0, a: 0 };
      } else {
        palette[char] = parseHexColor(cleanColor);
      }
      continue;
    }

    // If we have palette entries, assume remaining non-comment lines are pixel rows
    if (Object.keys(palette).length > 0) {
      inPixelSection = true;
      pixels.push(trimmed);
    }
  }

  return { palette, pixels };
}

function validatePixelData(
  pixels: string[],
  palette: Palette,
  size: number,
): void {
  if (pixels.length !== size) {
    throw new Error(`Expected ${size} rows of pixels, got ${pixels.length}`);
  }

  for (let row = 0; row < pixels.length; row++) {
    if (pixels[row].length !== size) {
      throw new Error(
        `Row ${row + 1} has ${pixels[row].length} characters, expected ${size}`,
      );
    }

    for (let col = 0; col < pixels[row].length; col++) {
      const char = pixels[row][col];
      if (!(char in palette)) {
        throw new Error(
          `Unknown palette character '${char}' at row ${row + 1}, column ${col + 1}`,
        );
      }
    }
  }
}

function createPng(pixels: string[], palette: Palette, size: number): PNG {
  const png = new PNG({ width: size, height: size });

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const char = pixels[y][x];
      const color = palette[char];
      const idx = (size * y + x) << 2;

      png.data[idx] = color.r;
      png.data[idx + 1] = color.g;
      png.data[idx + 2] = color.b;
      png.data[idx + 3] = color.a;
    }
  }

  return png;
}

export const pixelToPngCommand = new Command("pixel-to-png")
  .description("Convert a pixel definition source.txt to PNG")
  .argument("<folder>", "Path to the sprite folder containing source.txt")
  .option("-s, --size <number>", "Tile size in pixels", "32")
  .option("-o, --output <name>", "Output filename (without extension)")
  .action((folder: string, options: { size: string; output?: string }) => {
    const size = Number.parseInt(options.size, 10);
    const folderPath = path.resolve(folder);
    const sourceFile = path.join(folderPath, "source.txt");

    // Determine output filename
    const folderName = path.basename(folderPath);
    const outputName = options.output || folderName;
    const outputFile = path.join(folderPath, `${outputName}.png`);

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.error(`Error: source.txt not found in ${folderPath}`);
      process.exit(1);
    }

    try {
      // Read and parse source file
      const content = fs.readFileSync(sourceFile, "utf-8");
      const { palette, pixels } = parseSourceFile(content);

      // Validate
      if (Object.keys(palette).length === 0) {
        throw new Error("No palette entries found in source.txt");
      }

      validatePixelData(pixels, palette, size);

      // Create PNG
      const png = createPng(pixels, palette, size);

      // Write PNG file
      const buffer = PNG.sync.write(png);
      fs.writeFileSync(outputFile, buffer);

      console.log(`Created: ${outputFile}`);
    } catch (error) {
      console.error(`Error: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  });
