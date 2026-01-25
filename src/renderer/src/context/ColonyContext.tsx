import {
  createContext,
  type FC,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { commandRegistry } from "../commands/CommandRegistry";
import {
  workbenchRunCommand,
  workbenchSetTheme,
} from "../commands/definitions";
import { ModalProvider, useModal } from "../components/floating/modal";
import { defaultKeybindings } from "../keybindings/defaultKeybindings";
import { keybindingManager } from "../keybindings/KeybindingManager";
import { registerKeybindings } from "../keybindings/registerKeybindings";
import { injectThemeVariables } from "../theming/runtime-theme-generator";
import { type AvailableThemeId, themeMap } from "../theming/themes";
import type { ColonyContextData, ThemingContextData } from "./types";

// Create the context
const ColonyContext = createContext<ColonyContextData | null>(null);

// Internal provider that has access to useModal
const ColonyContextInner: FC<{ children: ReactNode }> = ({ children }) => {
  const modal = useModal();
  const [activeThemeId, setActiveThemeIdState] =
    useState<AvailableThemeId>("dark");

  // Set active theme and update DOM
  const setActiveThemeId = useCallback((themeId: AvailableThemeId) => {
    setActiveThemeIdState(themeId);
    // Update the data-theme attribute on the document element
    document.documentElement.setAttribute("data-theme", themeId);
  }, []);

  // Create theming context data
  const theming: ThemingContextData = useMemo(
    () => ({
      activeThemeId,
      setActiveThemeId,
      themeMap,
    }),
    [activeThemeId, setActiveThemeId],
  );

  // Create the context data
  const contextData: ColonyContextData = useMemo(
    () => ({
      commands: commandRegistry,
      modal,
      theming,
    }),
    [modal, theming],
  );

  // Initialize theming on mount
  useEffect(() => {
    // Inject all theme CSS variables
    const themes = Object.values(themeMap);
    injectThemeVariables(themes);

    // Set initial theme
    document.documentElement.setAttribute("data-theme", activeThemeId);
  }, []);

  // Register commands on mount
  useEffect(() => {
    // Clear any existing commands
    commandRegistry.clear();

    // Register default commands
    commandRegistry.register(workbenchRunCommand);
    commandRegistry.register(workbenchSetTheme);

    // Set the context for the command registry
    commandRegistry.setContext(contextData);

    // Register keybindings
    const keybindings = defaultKeybindings.get();
    registerKeybindings(keybindings);

    // Set context for keybinding manager
    keybindingManager.setContext(contextData);
  }, [contextData]);

  return (
    <ColonyContext.Provider value={contextData}>
      {children}
    </ColonyContext.Provider>
  );
};

// Main provider component that wraps ModalProvider
export const ColonyProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ModalProvider>
      <ColonyContextInner>{children}</ColonyContextInner>
    </ModalProvider>
  );
};

// Hook to use the Colony context
export const useColony = (): ColonyContextData => {
  const context = useContext(ColonyContext);
  if (!context) {
    throw new Error("useColony must be used within a ColonyProvider");
  }
  return context;
};
