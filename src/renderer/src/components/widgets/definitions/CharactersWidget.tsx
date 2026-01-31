import { MoreHorizontal, MousePointer, Users } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useColony } from "../../../context/ColonyContext";
import { useCharactersArray, useSelectedCharacter } from "../../../game-state";
import type { Character } from "../../../simulation/types";
import { type Column, DataGrid } from "../../data-grid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../dropdown-menu";
import type { WidgetComponentProps, WidgetDefinition } from "../types";

function ActionsDropdown({ characterId }: { characterId: string }) {
  const { game } = useColony();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => game.selectCharacter(characterId)}>
          <MousePointer size={12} />
          Select
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CharactersWidget(_props: WidgetComponentProps) {
  const characters = useCharactersArray();
  const selectedCharacter = useSelectedCharacter();

  const columns: Column<Character>[] = useMemo(
    () => [
      { key: "name", name: "Name", width: 100 },
      { key: "type", name: "Type", width: 80 },
      {
        key: "position",
        name: "Position",
        width: 100,
        renderCell: ({ row }) =>
          `${row.position.x}, ${row.position.y}, ${row.position.z}`,
      },
      {
        key: "actions",
        name: "",
        width: 40,
        renderCell: ({ row }) => <ActionsDropdown characterId={row.id} />,
      },
    ],
    [],
  );

  const rowClass = useCallback(
    (row: Character) => {
      return selectedCharacter?.id === row.id ? "bg-cyan-900/30" : "";
    },
    [selectedCharacter?.id],
  );

  return (
    <DataGrid
      columns={columns}
      rows={characters}
      rowKeyGetter={(row) => row.id}
      rowClass={rowClass}
    />
  );
}

export const charactersWidget: WidgetDefinition = {
  id: "characters",
  label: "Characters",
  icon: Users,
  component: CharactersWidget,
  closable: false,
};
