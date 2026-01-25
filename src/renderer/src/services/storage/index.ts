import type { StorageService } from "./types";

/**
 * Detect if running in Electron or Web environment
 */
export function isElectron(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.api !== "undefined" &&
    typeof window.api.readFileContent === "function"
  );
}

let storageServiceInstance: StorageService | null = null;

/**
 * Get the platform-appropriate storage service
 * Uses singleton pattern for consistent state
 */
export async function getStorageService(): Promise<StorageService> {
  if (storageServiceInstance) {
    return storageServiceInstance;
  }

  if (isElectron()) {
    const { createElectronStorage } = await import("./electron-storage");
    storageServiceInstance = await createElectronStorage();
  } else {
    const { createWebStorage } = await import("./web-storage");
    storageServiceInstance = await createWebStorage();
  }

  return storageServiceInstance;
}

// Re-export types
export * from "./types";
