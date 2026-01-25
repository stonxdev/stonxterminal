import type {
  ColonyContextData,
  CommandDefinition,
  CommandRegistry,
} from "./types";

class CommandRegistryImpl implements CommandRegistry {
  private commands = new Map<string, CommandDefinition>();
  private context: ColonyContextData | null = null;

  setContext(context: ColonyContextData) {
    this.context = context;
  }

  register(command: CommandDefinition) {
    this.commands.set(command.id, command);
  }

  async execute(commandId: string, _args?: unknown): Promise<void> {
    if (!this.context) {
      throw new Error(
        "Command context not set. Make sure to initialize the command system.",
      );
    }

    const command = this.commands.get(commandId);
    if (!command) {
      console.warn(`Command not found: ${commandId}`);
      return;
    }

    try {
      await command.execute(this.context);
    } catch (error) {
      console.error(`Error executing command "${commandId}":`, error);
    }
  }

  getCommand(commandId: string): CommandDefinition | undefined {
    return this.commands.get(commandId);
  }

  getAllCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  clear() {
    this.commands.clear();
  }
}

export const commandRegistry = new CommandRegistryImpl();
