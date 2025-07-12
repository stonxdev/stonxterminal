import { DockSystem } from "@renderer/components/dock/DockSystem";
import { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Components/DockSystem",
  component: DockSystem,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof DockSystem>;

export default meta;

type Story = StoryObj<typeof DockSystem>;

export const Default: Story = {
  args: {
    leftPanel: <div>Left Panel Content</div>,
    centerPanel: <div>Center Panel Content</div>,
    rightPanel: <div>Right Panel Content</div>,
    bottomPanel: <div>Bottom Panel Content</div>,
  },
};
