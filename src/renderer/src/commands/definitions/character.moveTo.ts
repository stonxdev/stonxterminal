import { createMoveCommand } from "../../simulation/types";
import { defineCommand } from "../defineCommand";

export interface MoveToPayload {
  characterId: string;
  destination: { x: number; y: number; z: number };
}

export const characterMoveTo = defineCommand<MoveToPayload>({
  id: "character.moveTo",
  name: "Move Character To",
  execute: (context, payload) => {
    console.info("[character.moveTo] Execute called with payload:", payload);

    if (!payload) {
      console.warn(
        "character.moveTo requires payload: { characterId, destination }",
      );
      return;
    }

    const { characterId, destination } = payload;
    const character = context.game.getCharacter(characterId);

    if (!character) {
      console.warn(`Character ${characterId} not found`);
      return;
    }

    console.info("[character.moveTo] Found character:", character.id);

    if (!context.game.isTilePassable(destination)) {
      console.warn("Cannot move to impassable tile:", destination);
      return;
    }

    console.info("[character.moveTo] Tile is passable, issuing command");
    const command = createMoveCommand(destination);
    context.game.issueCharacterCommand(characterId, command);
    console.info("[character.moveTo] Command issued successfully");
  },
});
