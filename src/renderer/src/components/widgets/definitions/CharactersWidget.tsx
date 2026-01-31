import { Users } from "lucide-react";
import { useCharactersArray } from "../../../game-state";
import type { Character } from "../../../simulation/types";
import { type Column, DataGrid } from "../../data-grid";
import type { WidgetComponentProps, WidgetDefinition } from "../types";

// Column definitions for character data
const columns: Column<Character>[] = [
  { key: "name", name: "Name", width: 100 },
  { key: "type", name: "Type", width: 80 },
  {
    key: "position",
    name: "Position",
    width: 100,
    renderCell: ({ row }) =>
      `${row.position.x}, ${row.position.y}, ${row.position.z}`,
  },
];

function CharactersWidget(_props: WidgetComponentProps) {
  const characters = useCharactersArray();

  return (
    <DataGrid
      columns={columns}
      rows={characters}
      rowKeyGetter={(row) => row.id}
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
