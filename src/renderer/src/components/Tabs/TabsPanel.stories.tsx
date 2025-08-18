import type { Meta, StoryObj } from "@storybook/react";
import { TabsPanel } from "./TabsPanel";
import type { TabData } from "./types";

const meta: Meta<typeof TabsPanel> = {
  title: "Components/TabsPanel",
  component: TabsPanel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    bodyHeight: {
      control: "text",
      description: "Height of the content body",
    },
    bodyWidth: {
      control: "text",
      description: "Width of the content body",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample tab data
const sampleTabs: TabData[] = [
  { id: "tab1", label: "First Tab" },
  { id: "tab2", label: "Second Tab" },
  { id: "tab3", label: "Third Tab" },
];

// Sample content components
const FirstTabContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>First Tab Content</h2>
    <p>This is the content for the first tab.</p>
    <ul>
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
);

const SecondTabContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Second Tab Content</h2>
    <p>This is the content for the second tab.</p>
    <div
      style={{ background: "#f0f0f0", padding: "10px", borderRadius: "4px" }}
    >
      <p>This is a highlighted section in the second tab.</p>
    </div>
  </div>
);

const ThirdTabContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Third Tab Content</h2>
    <p>This is the content for the third tab.</p>
    <button type="button" onClick={() => alert("Button clicked!")}>
      Click me!
    </button>
  </div>
);

// Sample tab content map
const sampleTabContent = {
  tab1: <FirstTabContent />,
  tab2: <SecondTabContent />,
  tab3: <ThirdTabContent />,
};

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    tabContent: sampleTabContent,
    bodyHeight: "400px",
    bodyWidth: "500px",
  },
};

export const CustomSize: Story = {
  args: {
    tabs: sampleTabs,
    tabContent: sampleTabContent,
    bodyHeight: "300px",
    bodyWidth: "700px",
  },
};

export const SingleTab: Story = {
  args: {
    tabs: [{ id: "single", label: "Only Tab" }],
    tabContent: {
      single: (
        <div style={{ padding: "20px" }}>
          <h2>Single Tab</h2>
          <p>This is the only tab in this example.</p>
        </div>
      ),
    },
    bodyHeight: "200px",
    bodyWidth: "400px",
  },
};

export const EmptyTabs: Story = {
  args: {
    tabs: [],
    tabContent: {},
    bodyHeight: "300px",
    bodyWidth: "500px",
  },
};
