import React from "react";

export const LeftPanel: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        backgroundColor: "#f3f4f6",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
        Explorer
      </h3>
      <div>
        <div style={{ padding: "8px", cursor: "pointer" }}>📁 src</div>
        <div style={{ padding: "8px", paddingLeft: "24px", cursor: "pointer" }}>
          📄 App.tsx
        </div>
        <div style={{ padding: "8px", paddingLeft: "24px", cursor: "pointer" }}>
          📄 main.tsx
        </div>
      </div>
    </div>
  );
};

export const CenterPanel: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        boxSizing: "border-box",
        backgroundColor: "#ffffff",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
        Center Panel - Main Editor
      </h3>
      <div>Welcome to the VS Code-inspired dock system!</div>
      <div style={{ marginTop: "16px" }}>Features:</div>
      <ul style={{ marginTop: "8px", paddingLeft: "16px" }}>
        <li>Resizable left, right, and bottom panels</li>
        <li>Fixed panel sizes with draggable resize handles</li>
        <li>Flexible center panel that adapts to available space</li>
        <li>VS Code-like layout and styling</li>
      </ul>
    </div>
  );
};

export const BottomPanel: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        backgroundColor: "#1e1e1e",
        color: "#00ff00",
      }}
    >
      <h3
        style={{
          margin: "0 0 16px 0",
          fontSize: "18px",
          fontWeight: "600",
          color: "#ffffff",
        }}
      >
        Terminal
      </h3>
      <div style={{ fontFamily: "monospace" }}>
        <div>$ npm run dev</div>
        <div style={{ color: "#66d9ef" }}>➜ Local: http://localhost:5173/</div>
        <div>$ </div>
      </div>
    </div>
  );
};

export const RightPanel: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "16px",
        backgroundColor: "#f3f4f6",
        boxSizing: "border-box",
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>
        Extensions
      </h3>
      <div>
        <div
          style={{
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          <div style={{ fontWeight: "500" }}>Prettier</div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>
            Code formatter
          </div>
        </div>
        <div
          style={{
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "4px",
          }}
        >
          <div style={{ fontWeight: "500" }}>ESLint</div>
          <div style={{ fontSize: "14px", color: "#6b7280" }}>Code linter</div>
        </div>
      </div>
    </div>
  );
};
