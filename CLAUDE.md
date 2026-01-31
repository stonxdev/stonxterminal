# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The narrator may have lied

## Essential Commands

### Development
```bash
npm run dev              # Start development server with hot-reload
npm run storybook        # Run Storybook for component development
```

### Build & Production
```bash
npm run build            # Typecheck and build for production
npm run build:mac        # Build for macOS
npm run build:win        # Build for Windows  
npm run build:linux      # Build for Linux
npm run start            # Preview production build
```

### Code Quality
```bash
npm run lint             # Run Biome linter
npm run lint:fix         # Run Biome with auto-fix
npm run typecheck        # Run TypeScript type checking (both node and web)
npm run typecheck:node   # Type check Node/Electron main process
npm run typecheck:web    # Type check renderer/React code
npm run format           # Format code with Biome
```

## IMPORTANT: Code Quality Checks
**After making any code changes, ALWAYS run:**
```bash
npm run typecheck        # Ensure TypeScript types are correct
npm run lint:fix         # Fix linting and formatting issues
```
These commands must pass before considering any task complete.

## Architecture

### Three-Process Architecture
The application follows Electron's multi-process architecture:

1. **Main Process** (`src/main/`): Electron main process handling window management, native APIs, and IPC communication
2. **Preload Scripts** (`src/preload/`): Bridge between main and renderer with controlled API exposure
3. **Renderer Process** (`src/renderer/`): React application with the UI components

### Key Components

**Docking System** (`src/renderer/src/components/dock/`):
- `DockSystem.tsx`: Main container managing the layout with six panel slots (leftTop, leftBottom, center, centerBottom, rightTop, rightBottom)
- `ResizeHandle.tsx`: Draggable handles for resizing panels
- Uses CSS Grid for layout with configurable column/row sizes stored in CSS variables

**Layout System** (`src/renderer/src/components/layout/`):
- Panel-based architecture with widgets that can be placed in dock slots
- Widget registry pattern in `widgets/widget-map.ts`
- Demo panels showing integration examples

**Component Library** (`src/renderer/src/components/`):
- Tab system with drag-and-drop support via Atlaskit Pragmatic DnD
- Monaco Editor integration for code editing
- Pixi.js integration for graphics rendering

### Technology Stack
- **Framework**: Electron + React 18
- **Build Tool**: Vite with electron-vite
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS v4
- **UI Components**: Custom components with Storybook
- **Editor**: Monaco Editor
- **Graphics**: Pixi.js
- **Drag & Drop**: @atlaskit/pragmatic-drag-and-drop
- **AI Integration**: Multiple providers (Anthropic, OpenAI, Google, OpenRouter)

### Path Aliases
- `@renderer`: Maps to `src/renderer/src/`
- `@electron-toolkit/*`: Electron utilities

### Configuration Files
- `electron.vite.config.ts`: Vite configuration for all three processes
- `electron-builder.yml`: Electron Builder packaging configuration
- `tsconfig.*.json`: TypeScript configs for different targets
- `eslint.config.mjs`: ESLint configuration
- `postcss.config.mjs`: PostCSS/Tailwind configuration