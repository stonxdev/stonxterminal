import { Focus } from "lucide-react";
import { type Infer, nu } from "../../schemas";
import { createCommand } from "../createCommand";

const focusSchema = nu.object({
  characterId: nu.string().optional().withMetadata({
    label: "Character ID",
    description: "Leave empty to focus the currently selected character",
  }),
});

export type FocusArgs = Infer<typeof focusSchema>;

export const characterFocus = createCommand<FocusArgs>({
  id: "character.focus",
  name: "Focus Character",
  icon: Focus,
  argsSchema: focusSchema,
  execute: (context, args) => {
    // If no args provided or characterId is empty, focus the currently selected character
    const characterId = args?.characterId;
    const character = characterId
      ? context.game.getCharacter(characterId)
      : context.game.getSelectedCharacter();

    if (!character) {
      console.warn("No character to focus");
      return;
    }

    context.game.focusCharacter(character.id);
  },
});
