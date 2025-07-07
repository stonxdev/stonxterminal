import ReactDOM from "react-dom/client";
import "dockview/dist/styles/dockview.css";
import { StrictMode } from "react";
import { App } from "@renderer/App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
