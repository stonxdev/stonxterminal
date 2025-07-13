import { useState } from "react";
import { Tabs } from "./Tabs";
import type { TabsPanelProps } from "./types";
import styles from "./TabsPanel.module.css";

export const TabsPanel = ({
  tabs,
  tabContent,
  bodyHeight = "400px",
  bodyWidth = "100%",
  onReorder = (): void => {},
  onDropToAnotherTabSystem = (): void => {},
}: TabsPanelProps): React.ReactElement => {
  const [selectedTabId, setSelectedTabId] = useState<string | null>(
    tabs.length > 0 ? tabs[0].id : null,
  );

  const selectedContent = selectedTabId ? tabContent[selectedTabId] : null;

  return (
    <div className={styles.tabsPanel}>
      <div className={styles.tabsContainer}>
        <Tabs
          items={tabs}
          selectedTab={selectedTabId}
          onTabSelect={setSelectedTabId}
          onReorder={onReorder}
          onDropToAnotherTabSystem={onDropToAnotherTabSystem}
        />
      </div>
      <div
        className={styles.bodyContainer}
        style={{
          height: bodyHeight,
          width: bodyWidth,
        }}
      >
        {selectedContent || (
          <div className={styles.emptyState}>
            {tabs.length === 0
              ? "No tabs available"
              : "No content for selected tab"}
          </div>
        )}
      </div>
    </div>
  );
};
