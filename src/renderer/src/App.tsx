import { RouterProvider } from "@tanstack/react-router";
import { useEffect } from "react";
import { registerBuiltInControlBars } from "./components/control-bars";
import { registerBuiltInWidgets } from "./components/widgets";
import { ColonyProvider } from "./context/ColonyContext";
import { useIsMobilePhone } from "./hooks/useIsMobilePhone";
import { registerBuiltInLayers, useLayerStore } from "./layers";
import { router } from "./router";
import { MobileNotSupportedScreen } from "./screens/MobileNotSupportedScreen";

/**
 * Prevent browser-level pinch-to-zoom gestures.
 * iOS Safari ignores the viewport meta tag's user-scalable=no,
 * so we need to intercept touch gestures at the document level.
 */
function usePreventBrowserZoom() {
  useEffect(() => {
    // Prevent pinch-to-zoom on touchmove (2+ fingers)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent double-tap-to-zoom by intercepting gesturestart (Safari-specific)
    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    // Prevent gesturechange (Safari pinch gesture)
    const handleGestureChange = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart);
    document.addEventListener("gesturechange", handleGestureChange);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("gesturestart", handleGestureStart);
      document.removeEventListener("gesturechange", handleGestureChange);
    };
  }, []);
}

export const App: React.FC = () => {
  usePreventBrowserZoom();
  const isMobilePhone = useIsMobilePhone();

  // Initialize widget, layer, and control bar systems
  useEffect(() => {
    registerBuiltInWidgets();
    registerBuiltInLayers();
    registerBuiltInControlBars();
    useLayerStore.getState().initialize();
  }, []);

  if (isMobilePhone) {
    return <MobileNotSupportedScreen />;
  }

  return (
    <ColonyProvider>
      <RouterProvider router={router} />
    </ColonyProvider>
  );
};
