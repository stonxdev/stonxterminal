import React from "react";
import styles from "./DemoPanels.module.css";

export const LeftPanel: React.FC = () => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Explorer</h3>
      <div>
        <div className={styles.explorerItem}>📁 src</div>
        <div className={`${styles.explorerItem} ${styles.explorerItemNested}`}>
          📄 App.tsx
        </div>
        <div className={`${styles.explorerItem} ${styles.explorerItemNested}`}>
          📄 main.tsx
        </div>
      </div>
    </div>
  );
};

export const CenterPanel: React.FC = () => {
  return (
    <div className={`${styles.panel} ${styles.centerPanel}`}>
      <h3 className={styles.title}>Center Panel - Main Editor</h3>
      <div>Welcome to the VS Code-inspired dock system!</div>
      <div style={{ marginTop: "16px" }}>Features:</div>
      <ul className={styles.featureList}>
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
    <div className={`${styles.panel} ${styles.bottomPanel}`}>
      <h3 className={styles.title}>Terminal</h3>
      <div className={styles.terminalLine}>
        <div>$ npm run dev</div>
        <div style={{ color: "#66d9ef" }}>➜ Local: http://localhost:5173/</div>
        <div>$</div>
      </div>
    </div>
  );
};

export const RightPanel: React.FC = () => {
  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>Extensions</h3>
      <div>
        <div className={styles.extensionCard}>
          <div className={styles.extensionName}>Prettier</div>
          <div className={styles.extensionDescription}>Code formatter</div>
        </div>
        <div className={styles.extensionCard}>
          <div className={styles.extensionName}>ESLint</div>
          <div className={styles.extensionDescription}>Code linter</div>
        </div>
      </div>
    </div>
  );
};
