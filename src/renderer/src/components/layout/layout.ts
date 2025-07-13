import { WidgetId } from "@renderer/components/layout/widgets/widget-map";

export type Layout = {
  leftTopPanel: {
    widgets: WidgetId[];
  };
  leftBottomPanel: {
    widgets: WidgetId[];
    height?: number;
  };
  centerPanel: {
    widgets: WidgetId[];
  };
  centerBottomPanel: {
    widgets: WidgetId[];
    height?: number;
  };
  rightTopPanel: {
    widgets: WidgetId[];
    width?: number;
  };
  rightBottomPanel: {
    widgets: WidgetId[];
    height?: number;
  };
};
