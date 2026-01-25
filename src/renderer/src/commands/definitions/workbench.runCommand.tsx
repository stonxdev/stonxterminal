import { Terminal } from "lucide-react";
import { SearchableTreeNavigator } from "../../components/command-palette";
import { ModalFrame } from "../../components/floating/modal";
import type { MenuItem } from "../../menu/types";
import { createCommand } from "../createCommand";

export const workbenchRunCommand = createCommand({
  id: "workbench.runCommand",
  name: "Run Command",
  icon: Terminal,
  execute: (context) => {
    const commands = context.commands.getAllCommands();
    const commandItems: MenuItem[] = commands.map((command) => ({
      id: command.id,
      icon: command.icon || Terminal,
      label: command.name,
      onExecute: () => {
        context.modal.closeModal();
        context.commands.execute(command.id);
      },
    }));
    context.modal.openModal({
      content: (
        <ModalFrame data-testid="command-palette">
          <SearchableTreeNavigator
            items={commandItems}
            placeHolder="Search in commands..."
            data-testid="command-palette-navigator"
          />
        </ModalFrame>
      ),
      alignment: "top",
      size: "lg",
      showBackdrop: true,
    });
  },
});
