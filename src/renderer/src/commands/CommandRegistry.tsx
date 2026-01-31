import { SchemaFormModal } from "../components/form";
import type {
  ColonyContextData,
  CommandDefinition,
  CommandRegistry,
} from "./types";

class CommandRegistryImpl implements CommandRegistry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private commands = new Map<string, CommandDefinition<any>>();
  private context: ColonyContextData | null = null;

  setContext(context: ColonyContextData) {
    this.context = context;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register(command: CommandDefinition<any>) {
    this.commands.set(command.id, command);
  }

  async execute(commandId: string, args?: unknown): Promise<void> {
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

    // If command has argsSchema and no args provided, show form modal
    if (command.argsSchema && args === undefined) {
      const context = this.context;
      // Close any existing modals (like command palette) before opening the form
      context.modal.closeAllModals();
      context.modal.openModal({
        content: (
          <SchemaFormModal
            schema={command.argsSchema}
            title={command.name}
            onSubmit={(data) => {
              context.modal.closeModal();
              // Re-execute with the form data
              this.execute(commandId, data);
            }}
            onCancel={() => context.modal.closeModal()}
          />
        ),
        alignment: "top",
        size: "lg",
        showBackdrop: true,
      });
      return;
    }

    // Validate args if schema exists
    if (command.argsSchema && args !== undefined) {
      const result = command.argsSchema.toZod().safeParse(args);
      if (!result.success) {
        console.error(`Invalid args for command "${commandId}":`, result.error);
        return;
      }
      args = result.data;
    }

    try {
      await command.execute(this.context, args);
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
