# Command System

This document explains how the command system works in Everyone is Fine.

## Overview

The command system provides a centralized way to define, register, and execute actions throughout the application. It follows a pattern similar to VS Code's command palette, where commands can be triggered programmatically, via keybindings, or through the UI.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Command System                           │
├─────────────────────────────────────────────────────────────────┤
│  CommandRegistry                                                │
│  ├── register(command)     Register a command                   │
│  ├── execute(id, args?)    Execute a command by ID              │
│  ├── getCommand(id)        Get a single command                 │
│  └── getAllCommands()      Get all registered commands          │
│                                                                 │
│  CommandDefinition                                              │
│  ├── id: string            Unique identifier (e.g., "world.setZoom") │
│  ├── name: string          Human-readable name                  │
│  ├── icon?: IconComponent  Lucide icon for UI display           │
│  ├── argsSchema?           Schema for command arguments         │
│  └── execute(context, args?) The command implementation         │
└─────────────────────────────────────────────────────────────────┘
```

## Core Concepts

### Command Registry

The `CommandRegistry` is a singleton that manages all commands in the application. It's defined in [CommandRegistry.tsx](../src/renderer/src/commands/CommandRegistry.tsx).

```typescript
import { commandRegistry } from "../commands/CommandRegistry";

// Register a command
commandRegistry.register(myCommand);

// Execute a command
await commandRegistry.execute("world.setZoom", { scale: 2 });

// Get all commands (useful for command palette)
const allCommands = commandRegistry.getAllCommands();
```

### Command Definition

A command definition describes what a command does and how it's displayed. The interface is defined in [types.ts](../src/renderer/src/commands/types.ts):

```typescript
interface CommandDefinition<TArgs = unknown> {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  icon?: IconComponent;          // Lucide icon component
  argsSchema?: ObjectSchema;     // Schema for arguments (enables form UI)
  execute: (context: ColonyContextData, args?: TArgs) => void | Promise<void>;
}
```

### Command Context

Commands receive a `ColonyContextData` object that provides access to various application subsystems:

```typescript
interface ColonyContextData {
  commands: CommandRegistry;     // Execute other commands
  modal: UseModalResult;         // Open/close modals
  theming: ThemingContextData;   // Theme management
  game: GameContextData;         // Game state and actions
}
```

## Creating Commands

Use the `createCommand` factory function for type-safe command definitions:

```typescript
import { createCommand } from "../commands/createCommand";

export const myCommand = createCommand({
  id: "namespace.commandName",
  name: "My Command",
  icon: SomeIcon,
  execute: (context) => {
    // Command implementation
  },
});
```

### Command ID Conventions

Command IDs follow a namespaced pattern:
- `workbench.*` - UI/workbench commands (e.g., `workbench.runCommand`, `workbench.setTheme`)
- `character.*` - Character-related commands (e.g., `character.select`, `character.focus`)
- `world.*` - World/viewport commands (e.g., `world.setZoom`)

## Commands with Arguments

Commands can define an argument schema using the `nu` schema builder. When a command with a schema is executed without arguments, a form modal is automatically displayed.

### Example: Command with Arguments

```typescript
import { nu, type Infer } from "../../schemas";
import { createCommand } from "../createCommand";

// Define the argument schema
const setZoomSchema = nu.object({
  scale: nu.number().withMetadata({
    label: "Zoom Level",
    description: "Value between 0.1 and 4",
    defaultValue: 1,
  }),
});

// Infer TypeScript type from schema
type SetZoomArgs = Infer<typeof setZoomSchema>;

export const worldSetZoom = createCommand<SetZoomArgs>({
  id: "world.setZoom",
  name: "Set Zoom Level",
  icon: ZoomIn,
  argsSchema: setZoomSchema,
  execute: (context, args) => {
    if (args?.scale === undefined) {
      console.warn("world.setZoom requires args: { scale }");
      return;
    }
    context.game.setZoom(args.scale);
  },
});
```

### How Argument Forms Work

1. When `execute(commandId)` is called without arguments and the command has an `argsSchema`:
   - The command registry closes any open modals
   - A `SchemaFormModal` is displayed with fields generated from the schema
   - User fills out the form and submits
   - Command is re-executed with the form data as arguments

2. When `execute(commandId, args)` is called with arguments:
   - Arguments are validated against the schema using Zod
   - If validation passes, the command executes with the validated args
   - If validation fails, an error is logged and execution stops

## Commands with Interactive UI

Some commands display their own modal UI for selection (e.g., character picker, theme picker):

```typescript
export const characterSelect = createCommand({
  id: "character.select",
  name: "Select Character",
  icon: Users,
  execute: (context) => {
    const characters = context.game.getCharacters();

    const characterItems = characters.map((character) => ({
      id: character.id,
      icon: User,
      label: character.name,
      onExecute: () => {
        context.modal.closeModal();
        context.game.selectCharacter(character.id);
      },
    }));

    context.modal.openModal({
      content: (
        <ModalFrame>
          <SearchableTreeNavigator
            items={characterItems}
            placeHolder="Search characters..."
          />
        </ModalFrame>
      ),
      alignment: "top",
      size: "lg",
      showBackdrop: true,
    });
  },
});
```

## Keybindings

Commands can be bound to keyboard shortcuts. Keybindings are defined in [defaultKeybindings.ts](../src/renderer/src/keybindings/defaultKeybindings.ts):

```typescript
interface Keybinding {
  key: string | string[];           // Key combo(s) e.g., "meta+k" or ["meta+k", "ctrl+k"]
  command: string;                  // Command ID to execute
  commandArgs?: Record<string, unknown>;  // Optional arguments
}
```

### Default Keybindings

```typescript
const DEFAULT_KEYBINDINGS: Keybinding[] = [
  {
    key: ["meta+k", "ctrl+k"],       // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
    command: "workbench.runCommand", // Opens the command palette
    commandArgs: {},
  },
];
```

### Extending Keybindings

```typescript
import { defaultKeybindings } from "../keybindings/defaultKeybindings";

const customKeybindings = defaultKeybindings.extend({
  add: [
    { key: "meta+t", command: "workbench.setTheme" },
    { key: "f", command: "character.focus" },
  ],
  removeCommands: ["workbench.runCommand"], // Remove specific defaults
});
```

## Registration and Initialization

Commands are registered in [ColonyContext.tsx](../src/renderer/src/context/ColonyContext.tsx) during application initialization:

```typescript
useEffect(() => {
  // Clear any existing commands
  commandRegistry.clear();

  // Register default commands
  commandRegistry.register(workbenchRunCommand);
  commandRegistry.register(workbenchSetTheme);
  commandRegistry.register(characterSelect);
  commandRegistry.register(characterMoveTo);
  commandRegistry.register(characterFocus);
  commandRegistry.register(worldSetZoom);

  // Set the context for the command registry
  commandRegistry.setContext(contextData);

  // Register keybindings
  const keybindings = defaultKeybindings.get();
  registerKeybindings(keybindings);

  // Set context for keybinding manager
  keybindingManager.setContext(contextData);
}, [contextData]);
```

## Available Commands

| Command ID | Name | Description |
|------------|------|-------------|
| `workbench.runCommand` | Run Command | Opens the command palette |
| `workbench.setTheme` | Set Theme | Theme picker with live preview |
| `character.select` | Select Character | Character picker modal |
| `character.moveTo` | Move Character | Move selected character to position |
| `character.focus` | Focus Character | Pan viewport to character |
| `world.setZoom` | Set Zoom Level | Adjust viewport zoom |

## File Structure

```
src/renderer/src/commands/
├── CommandRegistry.tsx       # Registry singleton implementation
├── createCommand.ts          # Factory function for type-safe commands
├── types.ts                  # TypeScript interfaces
└── definitions/              # Command implementations
    ├── index.ts              # Export all commands
    ├── workbench.runCommand.tsx
    ├── workbench.setTheme.tsx
    ├── character.select.tsx
    ├── character.moveTo.ts
    ├── character.focus.ts
    └── world.setZoom.ts
```

## Best Practices

1. **Use namespaced IDs**: Follow the `namespace.action` pattern for command IDs
2. **Provide icons**: All user-facing commands should have an icon for the command palette
3. **Use argsSchema for inputs**: If a command needs user input, define a schema rather than hardcoding a modal
4. **Handle missing args**: Always check for undefined args in commands with optional arguments
5. **Clean up modals**: Close modals after command execution to maintain a clean UI state
6. **Use createCommand**: Always use the factory function for type safety
