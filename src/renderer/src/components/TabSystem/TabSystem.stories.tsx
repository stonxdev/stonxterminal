import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { TabSystem } from "./TabSystem";

const meta: Meta<typeof TabSystem> = {
  title: "Components/TabSystem",
  component: TabSystem,
};

export default meta;
type Story = StoryObj<typeof TabSystem>;

const initialTabs1 = [
  { id: "1", label: "Tab 1" },
  { id: "2", label: "Tab 2" },
  { id: "3", label: "Tab 3" },
];

const initialTabs2 = [
  { id: "4", label: "Tab 4" },
  { id: "5", label: "Tab 5" },
];

const DraggableTabs = () => {
  const [tabs1, setTabs1] = useState(initialTabs1);
  const [tabs2, setTabs2] = useState(initialTabs2);

  const handleReorder1 = (startIndex: number, finishIndex: number) => {
    const newTabs = Array.from(tabs1);
    const [removed] = newTabs.splice(startIndex, 1);
    newTabs.splice(finishIndex, 0, removed);
    setTabs1(newTabs);
  };

  const handleReorder2 = (startIndex: number, finishIndex: number) => {
    const newTabs = Array.from(tabs2);
    const [removed] = newTabs.splice(startIndex, 1);
    newTabs.splice(finishIndex, 0, removed);
    setTabs2(newTabs);
  };

  const handleDropInTab1 = (item) => {
    if (!tabs1.find((t) => t.id === item.id)) {
      setTabs1([...tabs1, item]);
      setTabs2(tabs2.filter((t) => t.id !== item.id));
    }
  };

  const handleDropInTab2 = (item) => {
    if (!tabs2.find((t) => t.id === item.id)) {
      setTabs2([...tabs2, item]);
      setTabs1(tabs1.filter((t) => t.id !== item.id));
    }
  };

  return (
    <div>
      <TabSystem
        items={tabs1}
        onReorder={handleReorder1}
        onDropToAnotherTabSystem={handleDropInTab1}
      />
      <div style={{ marginTop: "20px" }} />
      <TabSystem
        items={tabs2}
        onReorder={handleReorder2}
        onDropToAnotherTabSystem={handleDropInTab2}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <DraggableTabs />,
};
