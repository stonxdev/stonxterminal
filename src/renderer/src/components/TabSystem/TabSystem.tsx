import { useState, useRef, useEffect, useId } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import styles from "./TabSystem.module.css";
import { Tab } from "./Tab";
import type { TabData } from "./types";

type TabSystemProps = {
  items: TabData[];
  onReorder: (startIndex: number, finishIndex: number) => void;
  onDropToAnotherTabSystem: (item: TabData, finishIndex?: number) => void;
};

export const TabSystem = ({
  items,
  onReorder,
  onDropToAnotherTabSystem,
}: TabSystemProps): React.ReactElement => {
  const [selectedTab, setSelectedTab] = useState<string | null>(
    items.length > 0 ? items[0].id : null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const tabSystemId = useId();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return dropTargetForElements({
      element: el,
      canDrop: ({ source }) =>
        source.data.type === "tab" && source.data.tabSystemId !== tabSystemId,
      onDrop: ({ source }) => {
        if (source.data.type === "tab") {
          onDropToAnotherTabSystem(source.data.item as TabData);
        }
      },
    });
  }, [onDropToAnotherTabSystem, tabSystemId]);

  return (
    <div ref={ref} className={styles.tabContainer}>
      {items.map((item, index) => (
        <Tab
          key={item.id}
          item={item}
          index={index}
          isSelected={selectedTab === item.id}
          onSelect={() => setSelectedTab(item.id)}
          onReorder={onReorder}
          onDropToAnotherTabSystem={onDropToAnotherTabSystem}
          tabSystemId={tabSystemId}
        />
      ))}
    </div>
  );
};
