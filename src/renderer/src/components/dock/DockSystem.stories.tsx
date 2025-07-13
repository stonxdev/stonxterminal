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
    leftTop: <div>Left Top Panel Content</div>,
    center: <div>Center Panel Content</div>,
    rightTop: <div>Right Top Panel Content</div>,
    centerBottom: <div>Center Bottom Panel Content</div>,
  },
};
