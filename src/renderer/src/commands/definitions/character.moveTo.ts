import { createMoveCommand } from "../../simulation/types";
import { defineCommand } from "../defineCommand";

export interface MoveToPayload {
  characterId: string | string[];
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

    const { destination } = payload;

    // Normalize to array for uniform handling
    const characterIds = Array.isArray(payload.characterId)
      ? payload.characterId
      : [payload.characterId];

    if (!context.game.isTilePassable(destination)) {
      console.warn("Cannot move to impassable tile:", destination);
      return;
    }

    console.info(
      "[character.moveTo] Issuing move command to",
      characterIds.length,
      "character(s)",
    );

    for (const characterId of characterIds) {
      const character = context.game.getCharacter(characterId);
      if (!character) {
        console.warn(`Character ${characterId} not found, skipping`);
        continue;
      }

      const command = createMoveCommand(destination);
      context.game.issueCharacterCommand(characterId, command);
      console.info("[character.moveTo] Command issued to:", character.id);
    }
  },
});
