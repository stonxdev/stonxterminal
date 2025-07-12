import type { TabData } from "@renderer/components/Tabs/types";

export type Layout = {
  leftPanel: {
    width: number;
    tabs: TabData[];
  };
  rightPanel: {
    width: number;
    tabs: TabData[];
  };
};
