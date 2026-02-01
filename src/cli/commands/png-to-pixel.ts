import * as fs from "node:fs";
import * as path from "node:path";
import { Command } from "commander";
import { PNG } from "pngjs";

const DEFAULT_SPRITES_DIR = "src/renderer/public/sprites";

// Characters to use for palette (excluding common punctuation that might confuse)
// '.' is reserved for transparent
const PALETTE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz@#$%&*+=~";

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

function colorToHex(color: Color): string {
  const r = color.r.toString(16).padStart(2, "0").toUpperCase();
  const g = color.g.toString(16).padStart(2, "0").toUpperCase();
  const b = color.b.toString(16).padStart(2, "0").toUpperCase();

  if (color.a < 255) {
    const a = color.a.toString(16).padStart(2, "0").toUpperCase();
    return `#${r}${g}${b}${a}`;
  }

  return `#${r}${g}${b}`;
}

function colorKey(color: Color): string {
  return `${color.r},${color.g},${color.b},${color.a}`;
}

function isTransparent(color: Color): boolean {
  return color.a === 0;
}

function extractColorsFromPng(png: PNG): Map<string, Color> {
  const colors = new Map<string, Color>();

  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const color: Color = {
        r: png.data[idx],
        g: png.data[idx + 1],
        b: png.data[idx + 2],
        a: png.data[idx + 3],
      };

      const key = colorKey(color);
      if (!colors.has(key)) {
        colors.set(key, color);
      }
    }
  }

  return colors;
}

function buildPalette(colors: Map<string, Color>): Map<string, string> {
  const palette = new Map<string, string>();
  let charIndex = 0;

  // Sort colors: transparent first, then by luminance
  const sortedColors = Array.from(colors.entries()).sort(([, a], [, b]) => {
    if (isTransparent(a) && !isTransparent(b)) return -1;
    if (!isTransparent(a) && isTransparent(b)) return 1;

    // Sort by luminance for consistent ordering
    const lumA = a.r * 0.299 + a.g * 0.587 + a.b * 0.114;
    const lumB = b.r * 0.299 + b.g * 0.587 + b.b * 0.114;
    return lumB - lumA; // Brightest first
  });

  for (const [key, color] of sortedColors) {
    if (isTransparent(color)) {
      palette.set(key, ".");
    } else {
      if (charIndex >= PALETTE_CHARS.length) {
        throw new Error(
          `Too many unique colors (${colors.size}). Maximum supported: ${PALETTE_CHARS.length + 1}`,
        );
      }
      palette.set(key, PALETTE_CHARS[charIndex]);
      charIndex++;
    }
  }

  return palette;
}

function generateSourceTxt(
  png: PNG,
  palette: Map<string, string>,
  colors: Map<string, Color>,
): string {
  const lines: string[] = [];

  // Write palette section
  lines.push("# Palette");

  // Sort palette entries for output
  const paletteEntries = Array.from(palette.entries())
    .map(([key, char]) => {
      const color = colors.get(key);
      if (!color) throw new Error(`Color not found: ${key}`);
      return { key, char, color };
    })
    .sort((a, b) => {
      if (a.char === ".") return -1;
      if (b.char === ".") return 1;
      return a.char.localeCompare(b.char);
    });

  for (const { char, color } of paletteEntries) {
    if (isTransparent(color)) {
      lines.push(`. = transparent`);
    } else {
      lines.push(`${char} = ${colorToHex(color)}`);
    }
  }

  // Write pixel section
  lines.push("");
  lines.push(`# Pixels (${png.width}x${png.height})`);

  for (let y = 0; y < png.height; y++) {
    let row = "";
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const color: Color = {
        r: png.data[idx],
        g: png.data[idx + 1],
        b: png.data[idx + 2],
        a: png.data[idx + 3],
      };

      const key = colorKey(color);
      const char = palette.get(key);
      if (!char) {
        throw new Error(`Color not found in palette: ${key}`);
      }
      row += char;
    }
    lines.push(row);
  }

  lines.push(""); // Trailing newline
  return lines.join("\n");
}

function findFoldersWithPng(baseDir: string): string[] {
  const folders: string[] = [];

  function scanDir(dir: string): void {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subPath = path.join(dir, entry.name);
        const pngFiles = fs
          .readdirSync(subPath)
          .filter((f) => f.endsWith(".png"));

        if (pngFiles.length === 1) {
          folders.push(subPath);
        }
        // Always recurse to find nested sprites
        scanDir(subPath);
      }
    }
  }

  scanDir(baseDir);
  return folders;
}

function convertSingle(
  inputPath: string,
  outputName?: string,
): void {
  let pngFile: string;
  let outputDir: string;

  const stat = fs.statSync(inputPath);
  if (stat.isDirectory()) {
    const pngFiles = fs
      .readdirSync(inputPath)
      .filter((f) => f.endsWith(".png"));
    if (pngFiles.length === 0) {
      console.error(`Error: No PNG files found in ${inputPath}`);
      process.exit(1);
    }
    if (pngFiles.length > 1) {
      console.error(
        `Error: Multiple PNG files found. Please specify which one to convert.`,
      );
      process.exit(1);
    }
    pngFile = path.join(inputPath, pngFiles[0]);
    outputDir = inputPath;
  } else {
    pngFile = inputPath;
    outputDir = path.dirname(inputPath);
  }

  const outputFile = path.join(outputDir, outputName || "source.txt");

  if (!fs.existsSync(pngFile)) {
    console.error(`Error: PNG file not found: ${pngFile}`);
    process.exit(1);
  }

  const buffer = fs.readFileSync(pngFile);
  const png = PNG.sync.read(buffer);

  console.log(`Reading: ${pngFile} (${png.width}x${png.height})`);

  const colors = extractColorsFromPng(png);
  console.log(`Found ${colors.size} unique colors`);

  const palette = buildPalette(colors);
  const content = generateSourceTxt(png, palette, colors);

  fs.writeFileSync(outputFile, content);
  console.log(`Created: ${outputFile}`);
}

function convertAll(baseDir: string): void {
  console.log(`Scanning ${baseDir} for PNG files...\n`);

  const folders = findFoldersWithPng(baseDir);

  if (folders.length === 0) {
    console.log("No folders with single PNG files found.");
    return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const folder of folders) {
    try {
      const pngFiles = fs
        .readdirSync(folder)
        .filter((f) => f.endsWith(".png"));
      const pngFile = path.join(folder, pngFiles[0]);
      const outputFile = path.join(folder, "source.txt");

      const buffer = fs.readFileSync(pngFile);
      const png = PNG.sync.read(buffer);

      const colors = extractColorsFromPng(png);
      const palette = buildPalette(colors);
      const content = generateSourceTxt(png, palette, colors);

      fs.writeFileSync(outputFile, content);

      console.log(`✓ ${path.relative(baseDir, outputFile)} (${colors.size} colors)`);
      successCount++;
    } catch (error) {
      console.log(
        `✗ ${path.relative(baseDir, folder)} - ${error instanceof Error ? error.message : error}`,
      );
      failCount++;
    }
  }

  console.log(`\nDone: ${successCount} converted, ${failCount} failed.`);

  if (failCount > 0) {
    process.exit(1);
  }
}

export const pngToPixelCommand = new Command("png-to-pixel")
  .description("Convert PNG files to source.txt pixel definitions")
  .argument("[input]", "Path to PNG file or folder (or omit with --all)")
  .option("-a, --all", "Process all sprites in the sprites directory")
  .option(
    "-d, --dir <path>",
    "Base directory for --all mode",
    DEFAULT_SPRITES_DIR,
  )
  .option("-o, --output <name>", "Output filename (default: source.txt)")
  .action(
    (
      input: string | undefined,
      options: { all?: boolean; dir: string; output?: string },
    ) => {
      try {
        if (options.all) {
          const baseDir = path.resolve(options.dir);
          convertAll(baseDir);
        } else if (input) {
          const inputPath = path.resolve(input);
          convertSingle(inputPath, options.output);
        } else {
          console.error(
            "Error: Specify an input path or use --all to process all sprites",
          );
          process.exit(1);
        }
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : error}`,
        );
        process.exit(1);
      }
    },
  );
