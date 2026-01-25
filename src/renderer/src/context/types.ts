import type { CommandRegistry } from "../commands/types";
import type { UseModalResult } from "../components/floating/modal";
import type { AvailableThemeId, themeMap } from "../theming/themes";

export interface ThemingContextData {
  activeThemeId: AvailableThemeId;
  setActiveThemeId: (themeId: AvailableThemeId) => void;
  themeMap: typeof themeMap;
}

export interface ColonyContextData {
  commands: CommandRegistry;
  modal: UseModalResult;
  theming: ThemingContextData;
}
