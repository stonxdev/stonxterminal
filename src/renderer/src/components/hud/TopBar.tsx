import { Command } from "lucide-react";
import type React from "react";
import { commandRegistry } from "../../commands/CommandRegistry";

export const TopBar: React.FC = () => {
  const handleCommandPalette = () => {
    commandRegistry.execute("workbench.runCommand");
  };

  return (
    <div className="p-2 text-white flex items-center justify-between">
      <div>Resources / Time</div>
      <button
        type="button"
        onClick={handleCommandPalette}
        className="pointer-events-auto flex items-center gap-1 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm"
        title="Open command palette (⌘K)"
      >
        <Command size={14} />
        <span>K</span>
      </button>
    </div>
  );
};
