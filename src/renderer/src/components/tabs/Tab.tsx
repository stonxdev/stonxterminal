import { cn } from "@renderer/utils/cn";
import { X } from "lucide-react";
import type { TabProps } from "./types";

export function Tab({ tab, isActive, variant, onSelect, onClose }: TabProps) {
  const { id, label, icon: Icon, closable, dirty } = tab;

  const handleClick = () => {
    onSelect(id);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Delete" && closable && onClose) {
      onClose(id);
    }
  };

  return (
    <div
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors outline-none cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
        // Primary variant styles
        variant === "primary" && [
          "border-r border-border",
          isActive
            ? "bg-background text-foreground"
            : "bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        ],
        // Secondary variant styles
        variant === "secondary" && [
          "border-b-2 bg-transparent",
          isActive
            ? "text-foreground border-primary"
            : "text-muted-foreground border-transparent hover:text-foreground hover:border-muted-foreground",
        ],
      )}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      <span className="truncate max-w-[120px]">{label}</span>
      {dirty && (
        <span
          className="h-2 w-2 rounded-full bg-foreground shrink-0"
          title="Unsaved changes"
        />
      )}
      {closable && (
        <button
          type="button"
          tabIndex={-1}
          onClick={handleClose}
          className={cn(
            "h-4 w-4 shrink-0 rounded flex items-center justify-center cursor-pointer",
            "opacity-40 hover:opacity-100 hover:bg-accent",
            isActive && "opacity-60",
          )}
          aria-label={`Close ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
