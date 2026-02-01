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

    if (trimmed === "" || trimmed.startsWith("#")) {
      if (trimmed.toLowerCase().includes("pixel")) {
        inPixelSection = true;
      }
      continue;
    }

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

    if (Object.keys(palette).length > 0) {
      inPixelSection = true;
      pixels.push(trimmed);
    }
  }

  return { palette, pixels };
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

function findSpriteFolders(baseDir: string): string[] {
  const folders: string[] = [];

  function scanDir(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subPath = path.join(dir, entry.name);
        const sourceFile = path.join(subPath, "source.txt");

        if (fs.existsSync(sourceFile)) {
          folders.push(subPath);
        } else {
          // Recurse into subdirectories
          scanDir(subPath);
        }
      }
    }
  }

  scanDir(baseDir);
  return folders;
}

function generateSprite(
  folderPath: string,
  size: number,
): { success: boolean; output: string; error?: string } {
  const sourceFile = path.join(folderPath, "source.txt");
  const folderName = path.basename(folderPath);
  const outputFile = path.join(folderPath, `${folderName}.png`);

  try {
    const content = fs.readFileSync(sourceFile, "utf-8");
    const { palette, pixels } = parseSourceFile(content);

    if (Object.keys(palette).length === 0) {
      return {
        success: false,
        output: folderPath,
        error: "No palette entries found",
      };
    }

    if (pixels.length !== size) {
      return {
        success: false,
        output: folderPath,
        error: `Expected ${size} rows, got ${pixels.length}`,
      };
    }

    const png = createPng(pixels, palette, size);
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(outputFile, buffer);

    return { success: true, output: outputFile };
  } catch (error) {
    return {
      success: false,
      output: folderPath,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export const generateAllSpritesCommand = new Command("generate-all-sprites")
  .description("Generate PNGs for all sprites with source.txt files")
  .option(
    "-d, --dir <path>",
    "Base directory to scan for sprites",
    "assets/sprites",
  )
  .option("-s, --size <number>", "Tile size in pixels", "32")
  .action((options: { dir: string; size: string }) => {
    const baseDir = path.resolve(options.dir);
    const size = Number.parseInt(options.size, 10);

    console.log(`Scanning ${baseDir} for sprite folders...`);

    const folders = findSpriteFolders(baseDir);

    if (folders.length === 0) {
      console.log("No sprite folders with source.txt found.");
      return;
    }

    console.log(`Found ${folders.length} sprite(s) to generate.\n`);

    let successCount = 0;
    let failCount = 0;

    for (const folder of folders) {
      const result = generateSprite(folder, size);

      if (result.success) {
        console.log(`✓ ${path.relative(baseDir, result.output)}`);
        successCount++;
      } else {
        console.log(
          `✗ ${path.relative(baseDir, result.output)} - ${result.error}`,
        );
        failCount++;
      }
    }

    console.log(`\nDone: ${successCount} generated, ${failCount} failed.`);

    if (failCount > 0) {
      process.exit(1);
    }
  });
