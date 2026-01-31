import { createMoveCommand } from "../../simulation/types";
import { createCommand } from "../createCommand";

export interface MoveToArgs {
  characterId: string;
  destination: { x: number; y: number; z: number };
}

export const characterMoveTo = createCommand<MoveToArgs>({
  id: "character.moveTo",
  name: "Move Character To",
  execute: (context, args) => {
    if (!args) {
      console.warn(
        "character.moveTo requires args: { characterId, destination }",
      );
      return;
    }

    const { characterId, destination } = args;
    const character = context.game.getCharacter(characterId);

    if (!character) {
      console.warn(`Character ${characterId} not found`);
      return;
    }

    if (!context.game.isTilePassable(destination)) {
      console.warn("Cannot move to impassable tile");
      return;
    }

    const command = createMoveCommand(destination);
    context.game.issueCharacterCommand(characterId, command);
  },
});
