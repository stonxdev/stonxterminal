import { Terminal } from "lucide-react";
import { SearchableTreeNavigator } from "../../components/command-palette";
import { ModalFrame } from "../../components/floating/modal";
import type { MenuItem } from "../../menu/types";
import { defineAction } from "../defineAction";

export const workbenchRunCommand = defineAction({
  id: "workbench.runCommand",
  name: "Run Command",
  icon: Terminal,
  execute: (context) => {
    // Get only executable actions (those with execute function)
    const actions = context.actions.getExecutableActions();
    const actionItems: MenuItem[] = actions.map((action) => ({
      id: action.id,
      icon: action.icon || Terminal,
      label: action.name,
      onExecute: () => {
        context.modal.closeModal();
        context.actions.dispatch(action.id);
      },
    }));
    context.modal.openModal({
      content: (
        <ModalFrame data-testid="command-palette">
          <SearchableTreeNavigator
            items={actionItems}
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
