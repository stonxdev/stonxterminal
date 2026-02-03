import { Tabs } from "@renderer/components/tabs";
import type { TabItem } from "@renderer/components/tabs/types";
import { useConfigStore } from "@renderer/config/config-store";
import { DEFAULT_CONFIG } from "@renderer/config/defaults";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfigEditor } from "./ConfigEditor";
import { ConfigEditorToolbar } from "./ConfigEditorToolbar";

type SettingsTab = "overrides" | "defaults" | "calculated";

export function SettingsContent() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("overrides");

  // Local editor state for unsaved changes
  const [overridesEditorValue, setOverridesEditorValue] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);

  // Get store state
  const overrides = useConfigStore((state) => state.overrides);
  const computed = useConfigStore((state) => state.computed);
  const setOverrides = useConfigStore((state) => state.setOverrides);
  const save = useConfigStore((state) => state.save);

  // Initialize editor value from store
  const storeOverridesJson = useMemo(
    () => JSON.stringify(overrides, null, 2),
    [overrides],
  );

  // Sync editor with store on first render or when store changes externally
  useEffect(() => {
    if (!isDirty) {
      setOverridesEditorValue(storeOverridesJson);
    }
  }, [storeOverridesJson, isDirty]);

  // Computed values for read-only tabs
  const defaultsJson = useMemo(
    () => JSON.stringify(DEFAULT_CONFIG, null, 2),
    [],
  );

  const computedJson = useMemo(
    () => JSON.stringify(computed, null, 2),
    [computed],
  );

  // Handlers
  const handleOverridesChange = useCallback((value: string) => {
    setOverridesEditorValue(value);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const parsed = JSON.parse(overridesEditorValue);
      setOverrides(parsed);
      await save();
      setIsDirty(false);
    } catch (error) {
      console.error("Invalid JSON:", error);
      // Could show error toast here
    }
  }, [overridesEditorValue, setOverrides, save]);

  const handleRestore = useCallback(() => {
    setOverridesEditorValue(storeOverridesJson);
    setIsDirty(false);
  }, [storeOverridesJson]);

  // Build tab items with Monaco editors
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: "overrides",
        label: "Overrides",
        dirty: isDirty,
        content: (
          <div className="flex flex-col h-full">
            <ConfigEditorToolbar
              onSave={handleSave}
              onRestore={handleRestore}
              isDirty={isDirty}
              isReadOnly={false}
            />
            <div className="flex-1 min-h-0">
              <ConfigEditor
                value={overridesEditorValue}
                onChange={handleOverridesChange}
                readOnly={false}
              />
            </div>
          </div>
        ),
      },
      {
        id: "defaults",
        label: "Defaults",
        content: (
          <div className="flex flex-col h-full">
            <ConfigEditorToolbar isReadOnly={true} />
            <div className="flex-1 min-h-0">
              <ConfigEditor value={defaultsJson} readOnly={true} />
            </div>
          </div>
        ),
      },
      {
        id: "calculated",
        label: "Calculated",
        content: (
          <div className="flex flex-col h-full">
            <ConfigEditorToolbar isReadOnly={true} />
            <div className="flex-1 min-h-0">
              <ConfigEditor value={computedJson} readOnly={true} />
            </div>
          </div>
        ),
      },
    ],
    [
      overridesEditorValue,
      defaultsJson,
      computedJson,
      isDirty,
      handleOverridesChange,
      handleSave,
      handleRestore,
    ],
  );

  return (
    <Tabs
      tabs={tabs}
      activeTabId={activeTab}
      onTabChange={(id) => setActiveTab(id as SettingsTab)}
      variant="secondary"
      keepMounted={true}
    />
  );
}
