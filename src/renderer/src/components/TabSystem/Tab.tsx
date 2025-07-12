import { useState, useRef, useEffect } from "react";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import styles from "./TabSystem.module.css";
import type { TabData } from "./types";

type TabProps = {
  item: TabData;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onReorder: (startIndex: number, finishIndex: number) => void;
  onDropToAnotherTabSystem: (item: TabData, finishIndex: number) => void;
  tabSystemId: string;
};

export const Tab = ({
  item,
  index,
  isSelected,
  onSelect,
  onReorder,
  onDropToAnotherTabSystem,
  tabSystemId,
}: TabProps): React.ReactElement => {
  const ref = useRef<HTMLButtonElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<Edge | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    return combine(
      draggable({
        element: el,
        getInitialData: () => ({ item, index, type: "tab", tabSystemId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            render: ({ container }) => {
              const preview = document.createElement("div");
              preview.className = styles.tabPreview;
              preview.innerText = item.label;
              container.appendChild(preview);
              return (): void => {
                container.removeChild(preview);
              };
            },
          });
        },
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element: el,
        canDrop: ({ source }) => source.data.type === "tab",
        getData: ({ input }) =>
          attachClosestEdge(
            { type: "tab", item, index },
            { element: el, input, allowedEdges: ["left", "right"] },
          ),
        onDragEnter: (args) => {
          if ((args.source.data.item as TabData)?.id !== item.id) {
            const edge = extractClosestEdge(args.self.data);
            setDropIndicator(edge);
          }
        },
        onDragLeave: () => setDropIndicator(null),
        onDrop: ({ source, self }) => {
          setDropIndicator(null);
          if (source.data.type === "tab") {
            const edge = extractClosestEdge(self.data);
            const targetIndex = edge === "left" ? index : index + 1;

            if (source.data.tabSystemId === tabSystemId) {
              onReorder(source.data.index as number, targetIndex);
            } else {
              onDropToAnotherTabSystem(
                source.data.item as TabData,
                targetIndex,
              );
            }
          }
        },
      }),
    );
  }, [item, index, onReorder, onDropToAnotherTabSystem, tabSystemId]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={ref}
        className={`${styles.tab} ${isSelected ? styles.selected : ""} ${isDragging ? styles.dragging : ""}`}
        onClick={onSelect}
      >
        {item.label}
      </button>
      {dropIndicator && (
        <div className={`${styles.dropIndicator} ${styles[dropIndicator]}`} />
      )}
    </div>
  );
};
