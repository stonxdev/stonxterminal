#!/usr/bin/env node
import { Command } from "commander";
import { generateAllSpritesCommand } from "./commands/generate-all-sprites";
import { pixelToPngCommand } from "./commands/pixel-to-png";

const program = new Command();

program
  .name("colony-cli")
  .description("CLI tools for the Colony game")
  .version("1.0.0");

program.addCommand(pixelToPngCommand);
program.addCommand(generateAllSpritesCommand);

program.parse();
