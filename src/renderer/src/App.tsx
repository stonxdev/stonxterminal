import { RouterProvider } from "@tanstack/react-router";
import { ColonyProvider } from "./context/ColonyContext";
import { router } from "./router";

export const App: React.FC = () => {
  return (
    <ColonyProvider>
      <RouterProvider router={router} />
    </ColonyProvider>
  );
};
