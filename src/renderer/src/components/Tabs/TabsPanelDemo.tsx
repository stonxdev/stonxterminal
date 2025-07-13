import React from "react";
import { TabsPanel } from "./TabsPanel";
import type { TabData } from "./types";

// Example content components
const WelcomeContent = () => (
  <div style={{ padding: "20px", lineHeight: "1.6" }}>
    <h2>Welcome to TabsPanel Demo!</h2>
    <p>This is a demonstration of the TabsPanel component.</p>
    <p>Key features:</p>
    <ul>
      <li>Clickable tabs that switch content</li>
      <li>Configurable body height and width</li>
      <li>Drag and drop support (inherited from Tabs component)</li>
      <li>Clean, modern styling</li>
    </ul>
  </div>
);

const SettingsContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Settings</h2>
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "5px" }}>Theme:</label>
      <select style={{ padding: "5px", width: "200px" }}>
        <option>Light</option>
        <option>Dark</option>
      </select>
    </div>
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "flex", alignItems: "center" }}>
        <input type="checkbox" style={{ marginRight: "8px" }} />
        Enable notifications
      </label>
    </div>
    <button
      style={{
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
      }}
    >
      Save Settings
    </button>
  </div>
);

const DataContent = () => (
  <div style={{ padding: "20px" }}>
    <h2>Data Overview</h2>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>Total Users</h3>
        <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>
          1,234
        </p>
      </div>
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
          Active Sessions
        </h3>
        <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>567</p>
      </div>
      <div
        style={{
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
          textAlign: "center",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#6c757d" }}>
          Total Revenue
        </h3>
        <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold" }}>
          $89,012
        </p>
      </div>
    </div>
    <p>This tab shows some sample data visualization.</p>
  </div>
);

export const TabsPanelDemo: React.FC = () => {
  const tabs: TabData[] = [
    { id: "welcome", label: "Welcome" },
    { id: "settings", label: "Settings" },
    { id: "data", label: "Data" },
  ];

  const tabContent = {
    welcome: <WelcomeContent />,
    settings: <SettingsContent />,
    data: <DataContent />,
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>TabsPanel Demo</h1>
      <p>Here's how to use the TabsPanel component:</p>

      <TabsPanel
        tabs={tabs}
        tabContent={tabContent}
        bodyHeight="450px"
        bodyWidth="100%"
        onReorder={(startIndex, finishIndex) => {
          console.log(`Reordered tab from ${startIndex} to ${finishIndex}`);
        }}
        onDropToAnotherTabSystem={(item) => {
          console.log("Dropped tab to another system:", item);
        }}
      />

      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#f8f9fa",
          borderRadius: "6px",
        }}
      >
        <h3>Usage Example:</h3>
        <pre
          style={{
            backgroundColor: "#fff",
            padding: "15px",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {`import { TabsPanel } from "./components/Tabs";

const tabs = [
  { id: "tab1", label: "First Tab" },
  { id: "tab2", label: "Second Tab" },
];

const tabContent = {
  tab1: <MyFirstComponent />,
  tab2: <MySecondComponent />,
};

<TabsPanel
  tabs={tabs}
  tabContent={tabContent}
  bodyHeight="400px"
  bodyWidth="100%"
/>`}
        </pre>
      </div>
    </div>
  );
};
