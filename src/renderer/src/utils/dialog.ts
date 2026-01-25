/**
 * Utility functions for showing dialog windows
 * Supports both Electron (native) and Web (browser fallback) environments
 */

/**
 * Check if running in Electron environment
 */
function isElectron(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.api?.showMessageBox === "function"
  );
}

/**
 * Shows an error dialog with the given message
 * @param message The error message to display
 * @param title Optional title for the dialog (defaults to "Error")
 * @param detail Optional detailed error message
 */
export async function showErrorDialog(
  message: string,
  title = "Error",
  detail?: string,
): Promise<void> {
  if (isElectron()) {
    await window.api.showMessageBox({
      type: "error",
      title,
      message,
      detail,
      buttons: ["OK"],
      defaultId: 0,
    });
  } else {
    // Web fallback
    alert(`${title}\n\n${message}${detail ? `\n\n${detail}` : ""}`);
  }
}

/**
 * Shows an info dialog with the given message
 * @param message The info message to display
 * @param title Optional title for the dialog (defaults to "Information")
 * @param detail Optional detailed message
 */
export async function showInfoDialog(
  message: string,
  title = "Information",
  detail?: string,
): Promise<void> {
  if (isElectron()) {
    await window.api.showMessageBox({
      type: "info",
      title,
      message,
      detail,
      buttons: ["OK"],
      defaultId: 0,
    });
  } else {
    // Web fallback
    alert(`${title}\n\n${message}${detail ? `\n\n${detail}` : ""}`);
  }
}

/**
 * Shows a warning dialog with the given message
 * @param message The warning message to display
 * @param title Optional title for the dialog (defaults to "Warning")
 * @param detail Optional detailed warning message
 */
export async function showWarningDialog(
  message: string,
  title = "Warning",
  detail?: string,
): Promise<void> {
  if (isElectron()) {
    await window.api.showMessageBox({
      type: "warning",
      title,
      message,
      detail,
      buttons: ["OK"],
      defaultId: 0,
    });
  } else {
    // Web fallback
    alert(`${title}\n\n${message}${detail ? `\n\n${detail}` : ""}`);
  }
}

/**
 * Shows a confirmation dialog with the given message
 * @param message The confirmation message to display
 * @param title Optional title for the dialog (defaults to "Confirm")
 * @param detail Optional detailed message
 * @returns True if the user clicked "Yes", false otherwise
 */
export async function showConfirmDialog(
  message: string,
  title = "Confirm",
  detail?: string,
): Promise<boolean> {
  if (isElectron()) {
    const { response } = await window.api.showMessageBox({
      type: "question",
      title,
      message,
      detail,
      buttons: ["Yes", "No"],
      defaultId: 0,
    });
    return response === 0; // 0 = "Yes" button
  }
  // Web fallback
  return confirm(`${title}\n\n${message}${detail ? `\n\n${detail}` : ""}`);
}
