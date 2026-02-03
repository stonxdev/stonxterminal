import { Focus, User } from "lucide-react";
import { SearchableTreeNavigator } from "../../components/command-palette";
import { ModalFrame } from "../../components/floating/modal";
import type { MenuItem } from "../../menu/types";
import { defineCommand } from "../defineCommand";

export interface CharacterFocusPayload {
  characterId?: string;
}

export const characterFocus = defineCommand<CharacterFocusPayload>({
  id: "character.focus",
  name: "Focus Character",
  icon: Focus,
  execute: (context, payload) => {
    console.info("[character.focus] Executing with payload:", payload);

    // If a specific character ID is provided, focus it directly
    if (payload?.characterId) {
      console.info(
        "[character.focus] Focusing character:",
        payload.characterId,
      );
      context.commands.dispatch("character.select", {
        characterId: payload.characterId,
      });
      context.game.focusCharacter(payload.characterId);
      context.commands.dispatch("world.setZoom", { scale: 2 });
      console.info("[character.focus] Done focusing character");
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
        context.commands.dispatch("character.select", {
          characterId: character.id,
        });
        context.game.focusCharacter(character.id);
        context.commands.dispatch("world.setZoom", { scale: 2 });
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
