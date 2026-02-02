import { Focus, User } from "lucide-react";
import { SearchableTreeNavigator } from "../../components/command-palette";
import { ModalFrame } from "../../components/floating/modal";
import type { MenuItem } from "../../menu/types";
import { createCommand } from "../createCommand";

export interface CharacterFocusArgs {
  characterId?: string;
}

export const characterFocus = createCommand<CharacterFocusArgs>({
  id: "character.focus",
  name: "Focus Character",
  icon: Focus,
  execute: (context, args) => {
    // If a specific character ID is provided, focus it directly
    if (args?.characterId) {
      context.commands.execute("character.select", {
        characterId: args.characterId,
      });
      context.game.focusCharacter(args.characterId);
      context.commands.execute("world.setZoom", { scale: 2 });
      return;
    }

    // Otherwise, show a modal to select from available characters
    const characters = context.game.getCharacters();

    if (characters.length === 0) {
      console.warn("No characters to focus");
      return;
    }

    const currentSelection = context.game.getSelectedCharacter();

    // Sort: selected character first, then alphabetically by name
    const sortedCharacters = [...characters].sort((a, b) => {
      if (currentSelection?.id === a.id) return -1;
      if (currentSelection?.id === b.id) return 1;
      return a.name.localeCompare(b.name);
    });

    const characterItems: MenuItem[] = sortedCharacters.map((character) => ({
      id: character.id,
      icon: User,
      label: character.name,
      subtitle: `${character.type} at (${character.position.x}, ${character.position.y})`,
      onExecute: () => {
        context.modal.closeModal();
        context.commands.execute("character.select", {
          characterId: character.id,
        });
        context.game.focusCharacter(character.id);
        context.commands.execute("world.setZoom", { scale: 2 });
      },
    }));

    context.modal.openModal({
      content: (
        <ModalFrame data-testid="character-focus-picker">
          <SearchableTreeNavigator
            items={characterItems}
            placeHolder="Search characters to focus..."
            data-testid="character-focus-picker-navigator"
          />
        </ModalFrame>
      ),
      alignment: "top",
      size: "lg",
      showBackdrop: true,
    });
  },
});
