import { Button } from "@renderer/components/buttons/Button";
import { RotateCcw, Save } from "lucide-react";

interface ConfigEditorToolbarProps {
  onSave?: () => void;
  onRestore?: () => void;
  isDirty?: boolean;
  isReadOnly: boolean;
  parseError?: string | null;
}

export function ConfigEditorToolbar({
  onSave,
  onRestore,
  isDirty = false,
  isReadOnly,
  parseError,
}: ConfigEditorToolbarProps) {
  if (isReadOnly) {
    return (
      <div className="flex items-center h-8 px-3 border-b border-border bg-secondary/50">
        <span className="text-xs text-muted-foreground">Read-only</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 h-8 px-3 border-b border-border bg-secondary/50">
      <Button
        variant="secondary"
        onClick={onSave}
        disabled={!isDirty}
        className="h-6 px-2 text-xs"
      >
        <Save className="w-3 h-3" />
        Save
      </Button>
      <Button
        variant="secondary"
        onClick={onRestore}
        disabled={!isDirty}
        className="h-6 px-2 text-xs"
      >
        <RotateCcw className="w-3 h-3" />
        Restore
      </Button>
      {parseError ? (
        <span className="text-xs text-red-500 ml-2 truncate" title={parseError}>
          Invalid JSON (changes won't apply)
        </span>
      ) : (
        isDirty && (
          <span className="text-xs text-yellow-500 ml-2">Unsaved changes</span>
        )
      )}
    </div>
  );
}
